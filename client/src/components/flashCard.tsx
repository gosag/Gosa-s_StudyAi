import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState, useCallback } from "react";
import { Button } from "./ui/button";
import { RotateCcw, ArrowRight, ArrowLeft} from "lucide-react";
import ReactMarkdown from "react-markdown";
function FlashCard(){
    const [flashCards,setFlashCards]=useState<{front:string,back:string,materialId:string,_id:string}[]>([])
    const [loading,setLoading]=useState(true)
    const [currentCardIndex,setCurrentCardIndex]=useState(0)
    const [showAnswer,setShowAnswer]=useState(false);
    const [updateMessage,setUpdateMessage]=useState("")

    useEffect(()=>{async function fetchFlashCards(){
        try{
            const token=localStorage.getItem("token");
            const res=await fetch(`${import.meta.env.VITE_API_URL}/api/flashcards/review`,{
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

    const currentCard = flashCards[currentCardIndex];

    const handleDifficulty=async (difficulty:string)=>{
        try{
            const token=localStorage.getItem("token")
            const res=await fetch(`${import.meta.env.VITE_API_URL}/api/flashcards/${currentCard._id}/review`,{
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
            // Auto advance
            if (currentCardIndex < flashCards.length - 1) {
                setTimeout(() => {
                    handleNext();
                }, 500);
            }
        }catch(error){
            console.log(error)
            setUpdateMessage("Failed to update flashcard");

        }finally{
           setTimeout(() => setUpdateMessage(""), 4000);
        }
    }

    const handleNext = useCallback(() => {
        if (currentCardIndex < flashCards.length - 1) {
            setShowAnswer(false);
            setCurrentCardIndex(prev => prev + 1);
            setUpdateMessage("");
        }
    }, [currentCardIndex, flashCards.length]);

    const handlePrev = useCallback(() => {
        if (currentCardIndex > 0) {
            setShowAnswer(false);
            setCurrentCardIndex(prev => prev - 1);
            setUpdateMessage("");
        }
    }, [currentCardIndex]);

    const handleFlip = useCallback(() => {
        setShowAnswer(prev => !prev);
    }, []);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") handleNext();
            if (e.key === "ArrowLeft") handlePrev();
            if (e.key === " " || e.key === "Spacebar") {
                e.preventDefault();
                handleFlip();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleNext, handlePrev, handleFlip]);

    if (loading) {
        return (
            <div className="flex mt-12 flex-col items-center justify-center min-h-[60vh] w-full p-6">
                <div className="w-full max-w-2xl h-80 bg-gray-100 dark:bg-zinc-900 rounded-3xl animate-pulse shadow-sm border border-gray-200 dark:border-zinc-800"></div>
                <div className="flex gap-4 mt-8">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-zinc-900 rounded-full animate-pulse"></div>
                    <div className="w-16 h-12 bg-gray-100 dark:bg-zinc-900 rounded-2xl animate-pulse"></div>
                    <div className="w-12 h-12 bg-gray-100 dark:bg-zinc-900 rounded-full animate-pulse"></div>
                </div>
            </div>
        );
    }

    if (!flashCards || flashCards.length === 0) {
        return (
            <div className="flex mt-12 flex-col items-center justify-center min-h-[60vh] text-center p-6">
                <div className="w-24 h-24 mb-6 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                    <RotateCcw className="w-12 h-12 text-blue-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-zinc-100 mb-2">You're all caught up!</h2>
                <p className="text-gray-500 dark:text-zinc-400 max-w-md">No flashcards to review right now. Take a break or create some new cards to study later.</p>
            </div>
        );
    }

    const progress = ((currentCardIndex + 1) / flashCards.length) * 100;

    return (
        <div className="flex relative flex-col items-center justify-between w-full max-w-3xl mx-auto p-4 md:p-4 font-sans overflow-hidden  min-h-dvh">
            <div className=" relative min-w-[80%] -mt-2  mb-3 mx-2">
                <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Reviewing</span>
                    <span className="text-sm font-semibold text-gray-700 dark:text-zinc-300 bg-gray-100 dark:bg-zinc-900 px-3 py-1 rounded-full">
                        {currentCardIndex + 1} / {flashCards.length}
                    </span>
                </div>
                <div className="w-full h-2 bg-gray-100 dark:bg-zinc-900  rounded-full overflow-hidden">
                    <motion.div 
                        className="h-full bg-blue-600 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    />
                </div>
            </div>

            <div 
                className="relative w-full flex-1 max-h-[50vh] sm:max-h-[60vh] z-10" 
                style={{ perspective: "1000px" }}
            >
                <motion.div
                    className="w-full h-full relative cursor-pointer"
                    onClick={handleFlip}
                    initial={false}
                    animate={{ rotateX: showAnswer ? 180 : 0 }}
                    transition={{ duration: 0.6, type: "spring", stiffness: 200, damping: 20 }}
                    style={{ transformStyle: "preserve-3d" }}
                >
                    {/* Front */}
                    <div
                        className=" sm:h-65  inset-0 flex items-center justify-center p-12 sm:p-8  text-center rounded-3xl bg-white dark:bg-neutral-900  dark:hover:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow duration-300"
                        style={{ backfaceVisibility: "hidden" }}
                    >
                        <div className="pointer-events-none select-none">
                            <span className="text-xs font-bold text-blue-500 dark:text-blue-400 uppercase tracking-widest block mb-4">Question</span>
                            <div className="text-2xl sm:text-3xl md:text-4xl text-gray-800 dark:text-zinc-100 leading-tight prose prose-xl dark:prose-invert max-w-none prose-p:leading-tight prose-strong:text-blue-600 dark:prose-strong:text-blue-400 prose-p:m-0 font-bold">
                                <ReactMarkdown>{currentCard.front?.replace(/\\\*/g, '*').trim()}</ReactMarkdown>
                            </div>
                        </div>
                    </div>

                    {/* Back */}
                    <div 
                        className="absolute inset-0 sm:h-65  flex flex-col items-center justify-center p-12 sm:p-8 text-center rounded-3xl bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-100 dark:border-blue-900/50 shadow-[0_8px_30px_rgb(0,0,0,0.08)]"
                        style={{ backfaceVisibility: "hidden", transform: "rotateX(180deg)" }}
                    >
                        <div className="pointer-events-none select-none overflow-y-auto w-full max-h-full scrollbar-transparent">
                            <span className="text-xs font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest block mb-4">Answer</span>

                             <div className={`text-xl sm:text-2xl text-gray-800 dark:text-zinc-100 leading-relaxed font-medium prose prose-lg dark:prose-invert max-w-none prose-p:leading-relaxed prose-strong:text-indigo-600 dark:prose-strong:text-indigo-400 prose-p:m-0`}>
                             <ReactMarkdown>{currentCard.back?.replace(/\\\*/g, '*').trim()}</ReactMarkdown>
                              </div>
                        </div>
                    </div>
                </motion.div>
            </div>

           
            <div className="w-full  flex flex-col relative  items-center gap-4  sm:gap-6 mt-10 pb-4 sm:pb-8 pt-4">
                
                <div className="flex items-center justify-center gap-4 sm:gap-6">
                    <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full w-12 h-12 border-gray-200 dark:border-zinc-800 text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100 hover:bg-gray-50 dark:hover:bg-zinc-800 shadow-sm"
                        onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                        disabled={currentCardIndex === 0}
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    
                    <Button 
                        onClick={(e) => { e.stopPropagation(); handleFlip(); }}
                        className="rounded-2xl px-8 h-12 bg-gray-900 dark:bg-zinc-100 hover:bg-gray-800 dark:hover:bg-white text-white dark:text-black shadow-md transition-all active:scale-95 flex items-center gap-2"
                    >
                        <RotateCcw className={`w-4 h-4 ${showAnswer ? '-rotate-180' : ''} transition-transform duration-500`} />
                        <span className="font-semibold tracking-wide">{showAnswer ? "Show Question" : "Reveal Answer"}</span>
                    </Button>
                    
                    <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full w-12 h-12 border-gray-200 dark:border-zinc-800 text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100 hover:bg-gray-50 dark:hover:bg-zinc-800 shadow-sm"
                        onClick={(e) => { e.stopPropagation(); handleNext(); }}
                        disabled={currentCardIndex === flashCards.length - 1}
                    >
                        <ArrowRight className="w-5 h-5" />
                    </Button>
                </div>

                {/* Difficulty Rating */}
                <div className="h-16 flex  items-center justify-center overflow-visible">
                    <AnimatePresence>
                        {showAnswer && (
                            <motion.div
                                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}
                                className="flex gap-2 sm:gap-3 p-2 bg-white dark:bg-zinc-900/50  dark:hover:bg-zinc-900 rounded-2xl shadow-lg border border-gray-100 dark:border-zinc-800"
                            >
                                <Button 
                                    variant="ghost" 
                                    onClick={() => handleDifficulty("again")}
                                    className="flex flex-col items-center gap-1 h-auto py-3 px-4 hover:bg-red-50 dark:hover:bg-red-900/40 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-xl"
                                >
                                    <span className="text-2xl">🔄</span>
                                    <span className="text-xs font-semibold">Again</span>
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    onClick={() => handleDifficulty("hard")}
                                    className="flex flex-col items-center gap-1 h-auto py-3 px-4 hover:bg-orange-50 dark:hover:bg-orange-900/40 hover:text-orange-600 dark:hover:text-orange-400 transition-colors rounded-xl"
                                >
                                    <span className="text-2xl">😓</span>
                                    <span className="text-xs font-semibold">Hard</span>
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    onClick={() => handleDifficulty("good")}
                                    className="flex flex-col items-center gap-1 h-auto py-3 px-4 hover:bg-blue-50 dark:hover:bg-blue-900/40 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-xl"
                                >
                                    <span className="text-2xl">🤔</span>
                                    <span className="text-xs font-semibold">Good</span>
                                </Button>
                                <Button 
                                    variant="ghost"
                                    onClick={() => handleDifficulty("easy")}
                                    className="flex flex-col items-center gap-1 h-auto py-3 px-4 hover:bg-green-50 dark:hover:bg-green-900/40 hover:text-green-600 dark:hover:text-green-400 transition-colors rounded-xl"
                                >
                                    <span className="text-2xl">😄</span>
                                    <span className="text-xs font-semibold">Easy</span>
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Status Message */}
                <div className="h-6 flex items-center justify-center">
                    <AnimatePresence>
                        {updateMessage && (
                            <motion.p 
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 5 }}
                                className="text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100"
                            >
                                {updateMessage}
                            </motion.p>
                        )}
                    </AnimatePresence>
                </div>
            </div>
            
        </div>
    );
}

export default FlashCard;



