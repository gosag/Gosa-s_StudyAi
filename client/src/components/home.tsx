import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
function Home() {
    return (
        <Card className="w-87.5">
        <CardHeader>
          <CardTitle>Your AI Study Dashboard</CardTitle>
        </CardHeader>

        <CardContent>
          Summarize materials, generate quizzes, and review flashcards smarter.
        </CardContent>

        <CardFooter className="flex justify-end">
          <Button className="bg-gray-500 hover:bg-gray-600 w-full active:scale-105 transition-transform duration-200"></Button>
        </CardFooter>
      </Card>
    )}
export default Home;