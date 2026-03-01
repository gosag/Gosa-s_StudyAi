import SignUp from "./components/signUp"
import Login from "./components/login"
import MainOutLet from "./components/outlet/MainOutlet"
import { Routes, Route } from "react-router-dom"
function App() {
  return (
    <Routes>
      <Route path="/" element={<MainOutLet/>}>
        <Route index element={<h1>Home</h1>}/>
        <Route path="library" element={<h1>Library</h1>}/>
        <Route path="flashcards" element={<h1>flashcards</h1>}/>
        <Route path="settings" element={<>settings</>}/>
        <Route path="signUp" element={<SignUp/>}/>
        <Route path="login" element={<Login />} />
      </Route>
    </Routes>
  )
}

export default App