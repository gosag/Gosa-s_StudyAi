import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  RefreshCw, 
  RotateCcw, 
  Sparkles 
} from "lucide-react";
function Quiz() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [quizzesLoader,setQuizesLoader]=useState(false)
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [error,setError]=useState<string | null>(null)
  const [quizzes, setQuizzes] = useState<{
    question: string;
    options: string[];
    correctAnswer: string;
  }[]>([]);

  useEffect(() => {
    async function fetchQuizzes() {
      if (!id) return;
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:8000/api/quizzes/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        const data = await res.json();
        if(!res.ok){
          throw new Error(data.error?.message || data.error || "Failed to fetch quizzes. Please try again.");
        }
        // Fallback to empty array if data.quizzes is undefined to prevent crash.
        setQuizzes(data.quizzes || []);
        setError(null) // Clear any previous errors on successful fetch
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to fetch quizzes. Please try again.")
        setTimeout(()=>{setError(null)},4000)
      }
    }
    fetchQuizzes();
    setLoading(false);
  }, [id]);

  const currentQuiz = quizzes[currentQuizIndex];
  const generateMore=async()=>{
    try{
      setQuizesLoader(true)
      const token=localStorage.getItem("token")
      const res=await fetch(`http://localhost:8000/api/quizzes/regenerate/${id}`,{
        method:"POST",
        headers:{
          "Authorization":`Bearer ${token}`
        }
      })
      const data=await res.json()
      if(!res.ok){
        throw new Error(data.error?.message || data.error || "Something went wrong generating new quizzes. Please try again.")
      }
      setQuizzes(prev=>[...prev,...data.quizzes])
      setQuizesLoader(false);
      setError(null)
    }
    catch(error){
      console.log(error)
      setQuizesLoader(false)
      setError("Failed to generate new quizzes. Please try again.")
      setTimeout(()=>{setError(null)},4000)
    }
  }
  return (
    <div className="h-dvh overflow-y-auto bg-gray-50/50 p-4 sm:p-2 flex flex-col items-center">
      <div className="w-full max-w-2xl shrink-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 sm:mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Go Back
        </Button>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={() => { setCurrentQuizIndex(0); setShowAnswer(false)}} className="gap-2 flex-1 sm:flex-none">
            <RotateCcw className="w-4 h-4" /> Restart
          </Button>
          {quizzes.length > 0 &&(
          <Button disabled={quizzesLoader} className="gap-2 flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700" onClick={generateMore}>
            {quizzesLoader ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            Generate More
          </Button>)}
        </div>
      </div>
  
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : !currentQuiz ? (
        <div className="text-center text-gray-500 mt-12">Wait, quizzes are coming...</div>
      ) : (
        <div className="w-full max-w-2xl flex flex-col gap-4 flex-1 min-h-0">
          <div className="flex justify-between items-center px-2 text-sm font-medium text-gray-500 shrink-0">
            <span>Question {currentQuizIndex + 1} of {quizzes.length}</span>
            <span>{showAnswer ? "Answer revealed" : "Thinking..."}</span>
          </div>

          <Card className="w-full pb-4 flex-1 flex flex-col shadow-sm border-gray-200 min-h-0">
            <CardContent className="flex-1 h-full px-4 py-2  flex flex-col">
              {!showAnswer ? (
                <div className="animate-in fade-in zoom-in-95 duration-200 my-auto">
                  <h2 className="text-xl sm:text-md font-semibold mb-2 text-gray-900 leading-relaxed">
                    {currentQuiz.question}
                  </h2>
                  <ul className="space-y-3">
                    {currentQuiz.options.map((option, optionIndex) => (
                      <li 
                        key={optionIndex}
                        className="p-3 rounded-lg bg-gray-50 border border-gray-100 text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        {option}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="animate-in fade-in zoom-in-95 duration-200 min-h-75 flex flex-col items-center justify-center text-center my-auto space-y-4">
                  <div className="p-4 bg-green-50 rounded-full">
                    <Sparkles className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Correct Answer</h3>
                  <p className="text-2xl font-semibold text-gray-900">{currentQuiz.correctAnswer}</p>
                </div>
              )}
            </CardContent>

            <CardFooter className="shrink-0 bg-gray-50/50 border-t py-0 flex flex-col gap-3 sm:flex-row  justify-between items-center rounded-b-xl">
              <Button 
                variant="outline"
                disabled={currentQuizIndex === 0}
                onClick={() => {
                  setCurrentQuizIndex(prev => Math.max(0, prev - 1));
                  setShowAnswer(false);
                }}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              <Button 
                variant="secondary"
                onClick={() => setShowAnswer(prev => !prev)}
                className="gap-2 min-w-30"
              >
                <RefreshCw className={`w-4 h-4 ${showAnswer ? 'rotate-180 transition-transform' : ''}`} />
                {showAnswer ? "Hide Answer" : "Flip"}
              </Button>

              <Button 
                disabled={currentQuizIndex >= quizzes.length - 1}
                onClick={() => {
                  setCurrentQuizIndex(prev => Math.min(quizzes.length - 1, prev + 1));
                  setShowAnswer(false);
                }}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>
    
          {error && <div className="text-sm text-red-500 text-center">{error}</div>}
       
        </div>
      )}
    </div>
  );
}

export default Quiz;