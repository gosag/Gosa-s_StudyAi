import SignUp from "./components/signUp"
import Login from "./components/login"
import MainOutLet from "./components/outlet/MainOutlet"
import { Routes, Route } from "react-router-dom"
import Home from "./components/home"
import Library from "./components/library"
import MaterialContinue from "./components/material"
import Quiz from "./components/Quiz"
import FlashCard from "./components/flashCard"
function App() {
  return (
    <Routes>
      <Route path="/" element={<MainOutLet/>}>
        <Route index element={<Home/>}/>
        <Route path="library" element={<Library/>}/>
        <Route path="flashcards" element={<FlashCard/>}/>
        <Route path="settings" element={<>settings</>}/>
        <Route path="signUp" element={<SignUp/>}/>
        <Route path="login" element={<Login />} />
        <Route path="library/:id" element={<MaterialContinue/>}/>
        <Route path="library/:id/flashcards" element={<Quiz/>}/>
      </Route>
    </Routes>
  )
}

export default App