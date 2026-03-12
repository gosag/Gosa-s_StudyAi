import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function Quiz() {
  const { id } = useParams();
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
  }, [id]);

  return (
    <div>
      {quizzes?.length > 0 ? (
        quizzes.map((quiz, index) => (
          <div key={index}>
            <h2>{quiz.question}</h2>
            <ul>
              {quiz.options?.map((option, optionIndex) => (
                <li key={optionIndex}>{option}</li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p>Wait for quizzes...</p>
      )}
    </div>
  );
}

export default Quiz;