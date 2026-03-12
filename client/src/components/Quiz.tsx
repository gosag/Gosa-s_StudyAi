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
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
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
        // Fallback to empty array if data.quizzes is undefined to prevent crash.
        setQuizzes(data.quizzes || []);
      } catch (error) {
        console.error(error);
      }
    }
    fetchQuizzes();
    setLoading(false);
  }, [id]);

  const currentQuiz = quizzes[currentQuizIndex];

  return (
    <div className="h-[100vh] overflow-hidden bg-gray-50/50 p-4 sm:p-6 flex flex-col items-center">
      <div className="w-full max-w-2xl shrink-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 sm:mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Go Back
        </Button>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={() => setCurrentQuizIndex(0)} className="gap-2 flex-1 sm:flex-none">
            <RotateCcw className="w-4 h-4" /> Restart
          </Button>
          <Button className="gap-2 flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700">
            <Sparkles className="w-4 h-4" /> Generate More
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : !currentQuiz ? (
        <div className="text-center text-gray-500 mt-12">No quizzes available.</div>
      ) : (
        <div className="w-full max-w-2xl flex flex-col gap-4 flex-1 min-h-0">
          <div className="flex justify-between items-center px-2 text-sm font-medium text-gray-500 shrink-0">
            <span>Question {currentQuizIndex + 1} of {quizzes.length}</span>
            <span>{showAnswer ? "Answer revealed" : "Thinking..."}</span>
          </div>

          <Card className="w-full flex-1 flex flex-col shadow-sm border-gray-200 min-h-0">
            <CardContent className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col">
              {!showAnswer ? (
                <div className="animate-in fade-in zoom-in-95 duration-200 my-auto">
                  <h2 className="text-xl sm:text-2xl font-semibold mb-8 text-gray-900 leading-relaxed">
                    {currentQuiz.question}
                  </h2>
                  <ul className="space-y-3">
                    {currentQuiz.options.map((option, optionIndex) => (
                      <li 
                        key={optionIndex}
                        className="p-4 rounded-lg bg-gray-50 border border-gray-100 text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        {option}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="animate-in fade-in zoom-in-95 duration-200 flex flex-col items-center justify-center text-center my-auto space-y-4">
                  <div className="p-4 bg-green-50 rounded-full">
                    <Sparkles className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Correct Answer</h3>
                  <p className="text-2xl font-semibold text-gray-900">{currentQuiz.correctAnswer}</p>
                </div>
              )}
            </CardContent>

            <CardFooter className="shrink-0 bg-gray-50/50 border-t p-4 sm:p-6 flex justify-between items-center rounded-b-xl">
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
                className="gap-2 min-w-[120px]"
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
        </div>
      )}
    </div>
  );
}

export default Quiz;