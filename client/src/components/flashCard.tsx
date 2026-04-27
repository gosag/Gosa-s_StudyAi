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
        <div className="relative min-h-dvh w-full bg-slate-50 dark:bg-[#0A0A0C] flex flex-col items-center py-8 px-4 sm:px-8 font-sans overflow-hidden selection:bg-indigo-500/30">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 dark:bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Header / Progress Area */}
            <div className="w-full max-w-4xl flex items-center justify-between mb-8 sm:mb-12 relative z-10 mt-4 sm:mt-8">
                <div className="flex flex-col gap-2 w-full max-w-45 sm:max-w-xs">
                    <span className="text-[10px] sm:text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest pl-1">Mastery Progress</span>
                    <div className="h-1.5 w-full bg-slate-200/50 dark:bg-zinc-800/50 rounded-full overflow-hidden backdrop-blur-sm">
                        <motion.div 
                            className="h-full bg-linear-to-r from-indigo-500 to-purple-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5, ease: "circOut" }}
                        />
                    </div>
                </div>
                <div className="flex items-center gap-3 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md px-4 py-2 rounded-2xl shadow-sm border border-slate-200/50 dark:border-zinc-800/50">
                    <span className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-zinc-300">
                        {currentCardIndex + 1} <span className="text-slate-400 dark:text-zinc-500 font-normal mx-1">of</span> {flashCards.length}
                    </span>
                </div>
            </div>

            {/* Status Message Floating */}
            <div className="absolute top-20 sm:top-24 left-1/2 -translate-x-1/2 z-50 w-full flex justify-center pointer-events-none">
                <AnimatePresence>
                    {updateMessage && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.9 }}
                            className="flex items-center gap-2 bg-emerald-500/10 dark:bg-emerald-500/20 backdrop-blur-md px-4 py-2 sm:px-5 sm:py-2.5 rounded-full border border-emerald-500/20 shadow-sm mx-4 text-center"
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                            <span className="text-[10px] sm:text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                                {updateMessage}
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Main Flashcard Container */}
            <div 
                className="w-full max-w-3xl flex-1 flex flex-col justify-center items-center relative perspective-distant mb-8 z-20 min-h-75 sm:min-h-100"
                style={{ perspective: "1200px" }}
            >
                {/* Decorative Deck Cards */}
                <div className="absolute inset-0 bg-white/40 dark:bg-zinc-900/40 rounded-[2rem] sm:rounded-[2.5rem] transform translate-y-4 sm:translate-y-8 scale-[0.92] sm:scale-[0.94] border border-slate-200/30 dark:border-zinc-800/30 blur-[2px] z-0" />
                <div className="absolute inset-0 bg-white/60 dark:bg-zinc-900/60 rounded-[2rem] sm:rounded-[2.5rem] transform translate-y-2 sm:translate-y-4 scale-[0.96] sm:scale-[0.97] border border-slate-200/50 dark:border-zinc-800/50 blur-[1px] z-0" />

                <motion.div
                    className="w-full h-full relative grid cursor-pointer z-10 rounded-[2rem] sm:rounded-[2.5rem]"
                    onClick={handleFlip}
                    initial={false}
                    animate={{ rotateY: showAnswer ? 180 : 0 }}
                    transition={{ duration: 0.7, type: "spring", stiffness: 150, damping: 20 }}
                    style={{ transformStyle: "preserve-3d" }}
                >
                    {/* Front Face (Question) */}
                    <div
                        className="col-start-1 row-start-1 w-full h-full flex flex-col items-center justify-center p-6 sm:p-12 text-center rounded-[2rem] sm:rounded-[2.5rem] bg-white dark:bg-zinc-900 shadow-2xl dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-slate-100 dark:border-zinc-800 transition-colors"
                        style={{ backfaceVisibility: "hidden" }}
                    >
                        <div className="w-full flex-1 flex flex-col items-center justify-center pointer-events-none select-none max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-zinc-800 py-4">
                            <span className="text-[10px] sm:text-xs font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-[0.2em] mb-4 sm:mb-8 opacity-80 shrink-0">Question</span>
                            <div className="text-xl sm:text-3xl md:text-4xl text-slate-800 dark:text-zinc-100 leading-snug sm:leading-tight prose prose-lg dark:prose-invert max-w-prose prose-p:leading-snug prose-strong:text-indigo-600 dark:prose-strong:text-indigo-400 font-semibold wrap-break-words wrap-break-words">
                                <ReactMarkdown>{currentCard.front?.replace(/\\\*/g, '*').trim()}</ReactMarkdown>
                            </div>
                        </div>
                    </div>

                    {/* Back Face (Answer) */}
                    <div 
                        className="col-start-1 row-start-1 w-full h-full flex flex-col items-center justify-center p-6 sm:p-12 text-center rounded-[2rem] sm:rounded-[2.5rem] bg-linear-to-b from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/20 dark:to-purple-950/20 shadow-xl dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-indigo-100/50 dark:border-indigo-500/10"
                        style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                    >
                        <div className="w-full flex-1 pointer-events-none select-none overflow-y-auto max-h-[60vh] scrollbar-thin scrollbar-track-transparent scrollbar-thumb-indigo-200 dark:scrollbar-thumb-indigo-900/50 px-2 sm:px-6 py-4">
                            <span className="text-[10px] sm:text-xs font-bold text-purple-500 dark:text-purple-400 uppercase tracking-[0.2em] mb-4 sm:mb-8 block opacity-80 shrink-0">Answer / Explanation</span>
                            <div className="text-[15px] leading-relaxed sm:text-xl md:text-2xl text-slate-700 dark:text-zinc-300 sm:leading-loose font-medium prose prose-md sm:prose-lg dark:prose-invert max-w-prose prose-p:leading-relaxed prose-strong:text-purple-600 dark:prose-strong:text-purple-400 wrap-break-words wrap-break-words origin-center">
                                <ReactMarkdown>{currentCard.back?.replace(/\\\*/g, '*').trim()}</ReactMarkdown>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
            <div className="w-full flex flex-col justify-start items-center gap-4 relative z-20 mb-2 mt-4 sm:mt-8">
                
                {/* Primary Navigation Dock */}
                <div className="pointer-events-auto flex items-center p-2 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-full shadow-lg dark:shadow-[0_8px_32px_rgb(0,0,0,0.4)] border border-white/60 dark:border-white/5 gap-2 w-max mx-auto relative z-20">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full shrink-0 w-12 h-12 sm:w-14 sm:h-14 text-slate-400 hover:text-slate-800 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                        onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                        disabled={currentCardIndex === 0}
                    >
                        <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                    </Button>
                    
                    <Button 
                        onClick={(e) => { e.stopPropagation(); handleFlip(); }}
                        className="rounded-full w-40 sm:w-55 h-12 sm:h-14 bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md shadow-indigo-500/25 dark:shadow-indigo-900/50 transition-all active:scale-95 flex items-center justify-center gap-2 group"
                    >
                        <RotateCcw className={`w-4 h-4 sm:w-5 sm:h-5 ${showAnswer ? '-rotate-180' : ''} transition-transform duration-700 ease-in-out`} />
                        <span className="font-bold tracking-wide text-[11px] sm:text-sm uppercase leading-none mt-px">{showAnswer ? "Question" : "Reveal Answer"}</span>
                    </Button>
                    
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full shrink-0 w-12 h-12 sm:w-14 sm:h-14 text-slate-400 hover:text-slate-800 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                        onClick={(e) => { e.stopPropagation(); handleNext(); }}
                        disabled={currentCardIndex === flashCards.length - 1}
                    >
                        <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
                    </Button>
                </div>

            
                <div className="w-full max-w-85 sm:max-w-md flex justify-center h-18 sm:h-21 items-start relative z-10 -mt-2">
                <AnimatePresence>
                    {showAnswer && (
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -15, scale: 0.95 }}
                            transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}
                            className="pointer-events-auto flex items-center justify-between p-1.5 sm:p-2 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-full shadow-lg dark:shadow-[0_8px_32px_rgb(0,0,0,0.4)] border border-white/60 dark:border-white/5 w-full gap-1 sm:gap-2"
                        >
                            <Button variant="ghost" onClick={() => handleDifficulty("again")} className="flex-1 flex flex-col items-center justify-center gap-1 h-14 sm:h-16 rounded-full hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-500 hover:text-red-500 transition-colors group">
                                <span className="text-xl sm:text-2xl leading-none group-hover:scale-110 transition-transform">🔄</span>
                                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider leading-none">Again</span>
                            </Button>
                            <div className="w-px h-8 bg-slate-200 dark:bg-zinc-800 shrink-0" />
                            <Button variant="ghost" onClick={() => handleDifficulty("hard")} className="flex-1 flex flex-col items-center justify-center gap-1 h-14 sm:h-16 rounded-full hover:bg-orange-50 dark:hover:bg-orange-500/10 text-slate-500 hover:text-orange-500 transition-colors group">
                                <span className="text-xl sm:text-2xl leading-none group-hover:scale-110 transition-transform">😓</span>
                                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider leading-none">Hard</span>
                            </Button>
                            <div className="w-px h-8 bg-slate-200 dark:bg-zinc-800 shrink-0" />
                            <Button variant="ghost" onClick={() => handleDifficulty("good")} className="flex-1 flex flex-col items-center justify-center gap-1 h-14 sm:h-16 rounded-full hover:bg-blue-50 dark:hover:bg-blue-500/10 text-slate-500 hover:text-blue-500 transition-colors group">
                                <span className="text-xl sm:text-2xl leading-none group-hover:scale-110 transition-transform">🤔</span>
                                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider leading-none">Good</span>
                            </Button>
                            <div className="w-px h-8 bg-slate-200 dark:bg-zinc-800 shrink-0" />
                            <Button variant="ghost" onClick={() => handleDifficulty("easy")} className="flex-1 flex flex-col items-center justify-center gap-1 h-14 sm:h-16 rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-500/10 text-slate-500 hover:text-emerald-500 transition-colors group">
                                <span className="text-xl sm:text-2xl leading-none group-hover:scale-110 transition-transform">😄</span>
                                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider leading-none">Easy</span>
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
                </div>
            </div>
            
        </div>
    );
}

export default FlashCard;



