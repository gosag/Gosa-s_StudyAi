import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
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
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (<div>
                <Card className="max-w-lg mx-auto mt-8">
                <CardContent>
                  {!showAnswer?(
                   <div>
                      <h2>{currentQuiz?.question}</h2>
                      <ul>
                        {currentQuiz?.options.map((option, optionIndex) => (
                          <li key={optionIndex}>{option}</li>
                        ))}
                      </ul>
                  </div>):(
                  <div>
                    <p>Correct Answer: {currentQuiz?.correctAnswer}</p>
                  </div>
                )}
                    
                </CardContent>
                <CardFooter>
                  {currentQuizIndex > 0 && (
                    <Button onClick={() => {setCurrentQuizIndex(prev=>Math.max(0, prev-1)); setShowAnswer(false)}}>
                      Last
                    </Button>
                  )}
                  <Button onClick={()=>setShowAnswer(prev => !prev)}>Flip</Button>
                  {currentQuizIndex < quizzes.length - 1 && (
                    <Button onClick={() => {setCurrentQuizIndex(prev => Math.min(quizzes.length - 1, prev + 1)); setShowAnswer(false)}}>
                      Next
                    </Button>
                  )}
                </CardFooter>
              </Card>
              <Button onClick={() => setCurrentQuizIndex(0)}>Restart Quiz</Button>
              <Button onClick={() => navigate(-1)}>Go Back</Button>
           </div>
          )}
    </div>
  );
}

export default Quiz;