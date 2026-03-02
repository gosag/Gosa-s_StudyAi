import SignUp from "./components/signUp"
import Login from "./components/login"
import MainOutLet from "./components/outlet/MainOutlet"
import { Routes, Route } from "react-router-dom"
import { Button } from "./components/ui/button"
import { Card, CardContent, CardFooter } from "./components/ui/card"
import { CardHeader } from "./components/ui/card"
import { CardTitle } from "./components/ui/card"
function App() {
  return (
    <Routes>
      <Route path="/" element={<MainOutLet/>}>
        <Route index element={<Card className="w-87.5">
        <CardHeader>
          <CardTitle>EchoLearn</CardTitle>
        </CardHeader>

        <CardContent>
          This is your first shadcn Card component.
        </CardContent>

        <CardFooter className="flex justify-end">
          <Button className="bg-blue-500">Start Studying</Button>
        </CardFooter>
      </Card>}/>
        <Route path="library" element={<Card className="w-87.5">
        <CardHeader>
          <CardTitle>EchoLearn</CardTitle>
        </CardHeader>

        <CardContent>
          This is your first shadcn Card component.
        </CardContent>

        <CardFooter className="flex justify-end">
          <Button>Start Studying</Button>
        </CardFooter>
      </Card>}/>
        <Route path="flashcards" element={<h1>flashcards</h1>}/>
        <Route path="settings" element={<>settings</>}/>
        <Route path="signUp" element={<SignUp/>}/>
        <Route path="login" element={<Login />} />
      </Route>
    </Routes>
  )
}

export default App