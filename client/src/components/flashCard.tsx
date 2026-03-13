import {motion} from "framer-motion"
import { useEffect, useState } from "react";
function FlashCard(){
    const [flashCards,setFlashCards]=useState<{front:string,back:string,materialId:string}[]>([])
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
        }
    }
    fetchFlashCards();
    },[])
        return(
            <>
               <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="p-6 bg-white rounded-xl shadow"
                >
                FlashCards
                </motion.div>
                {flashCards && flashCards.length>0?(
                    flashCards.map((card:{front:string,back:string,materialId:string},index)=>(
                        <motion.div
                        key={index}
                        className="p-4 bg-gray-100 rounded-lg shadow"
                        >
                        <h3 className="text-lg font-bold">{card.front}</h3>
                        <p className="text-gray-600">{card.back}</p>
                        </motion.div>
                    ))):(
                        <p className="text-gray-500 mt-4">No flashcards to review right now. Check back later!</p>
                     )

                }
            </>
        )
}
export default FlashCard;
