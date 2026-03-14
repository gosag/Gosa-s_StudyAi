import {motion} from "framer-motion"
import { useEffect, useState } from "react";
import  {Button}  from "./ui/button";
function FlashCard(){
    const [flashCards,setFlashCards]=useState<{front:string,back:string,materialId:string,_id:string}[]>([])
    const [loading,setLoading]=useState(true)
    const [currentCardIndex,setCurrentCardIndex]=useState(0)
    const [showAnswer,setShowAnswer]=useState(false);
    const [updateMessage,setUpdateMessage]=useState("")
    useEffect(()=>{async function fetchFlashCards(){
        try{
            const token=localStorage.getItem("token");
            const res=await fetch("http://localhost:8000/api/flashcards/review",{
                method:"GET",
                headers:{
                    "Authorization":`Bearer ${token}`
                }})
            const data=await res.json();
            if(!res.ok){
                throw new Error("Something went wrong fetching flashcards");
            }
            console.log(data.flashcards)
            setFlashCards(data.flashcards || []);
        }catch(error){
            console.log(error)
        }finally{
            setLoading(false);
        }
    }
    fetchFlashCards();
    },[])
    const currentCard=flashCards[currentCardIndex]
    const handleDifficulty=async (difficulty:string)=>{
        try{
            const token=localStorage.getItem("token")
            const res=await fetch(`http://localhost:8000/api/flashcards/${currentCard._id}/review`,{
                method:"PATCH",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":`Bearer ${token}`
                },
                body:JSON.stringify({difficultyLevel:difficulty})
            })
            const data=await res.json();
            if(!res.ok){
                throw new Error("Something went wrong updating flashcard")
            }
            setUpdateMessage(data.message)
            console.log(data.message)
        }catch(error){
            console.log(error)
            setUpdateMessage("Failed to update flashcard")
        }finally{
            console.log(updateMessage)
        }
    }
        return(
            <>
                {loading ? (
                    <p className="text-gray-500">Loading flashcards...</p>
                ) : flashCards && flashCards.length > 0 ? (
                    <motion.div
                        key={currentCardIndex}
                        className="p-4 bg-gray-100 rounded-lg shadow"
                        >
                        {!showAnswer?(<h3 className="text-lg font-bold">{currentCard.front}</h3>):(<div>
                           <p className="text-gray-600">{currentCard.back}</p>
                           <div className="flex justify-between gap-2 mt-4">
                           <Button onClick={() => handleDifficulty("again")}>again</Button>
                           <Button onClick={() => handleDifficulty("hard")}>Hard</Button>
                           <Button onClick={() => handleDifficulty("good")}>Good</Button>
                           <Button onClick={() => handleDifficulty("easy")}>Easy</Button>
                           </div> 
                        </div>
                        
                        )}
                        <div className="flex justify-between mt-4">
                            <Button
                                onClick={() => {setCurrentCardIndex((prev) => Math.max(0, prev - 1)); setShowAnswer(false)}}
                                disabled={currentCardIndex === 0}
                            >
                                Previous
                            </Button>
                            <Button onClick={() => {setShowAnswer(!showAnswer)}}>
                             Flip
                            </Button>
                            <Button
                                onClick={() => {setCurrentCardIndex((prev) => Math.min(flashCards.length - 1, prev + 1)); setShowAnswer(false)}}
                                disabled={currentCardIndex === flashCards.length - 1}
                            >
                                Next
                            </Button>
                            
                        </div>
                    </motion.div>
                    ):(
                        <p className="text-gray-500 mt-4">No flashcards to review right now. Check back later!</p>
                     )

                }
            </>
        )
}
export default FlashCard;
