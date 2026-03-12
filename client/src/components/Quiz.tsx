import { useParams } from "react-router-dom";
function Quiz() {
const { id } = useParams();
console.log("Material ID for Quiz:", id); // Debugging log
  return (
    <div>
      <h1>Quiz</h1>
      <p>This is the quiz component.</p>
    </div>
  );
}

export default Quiz;