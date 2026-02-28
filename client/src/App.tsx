import SignUp from "./components/signUp/signUp"
import Login from "./components/Login/login"
import MainOutLet from "./components/outlet/MainOutlet"
import { Routes, Route } from "react-router-dom"

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainOutLet />}>
        <Route index element={<SignUp/>} />
        <Route path="login" element={<Login />} />
      </Route>
    </Routes>
  )
}

export default App