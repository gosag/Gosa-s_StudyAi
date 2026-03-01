import SignUp from "./components/signUp"
import Login from "./components/login"
import MainOutLet from "./components/outlet/MainOutlet"
import Sidebar from "./components/sideBar"
import { Routes, Route } from "react-router-dom"
function App() {
  return (
    <Routes>
      <Route path="/" element={<MainOutLet />}>
        <Route index element={<Sidebar/>} />
        <Route path="signUp" element={<SignUp/>}/>
        <Route path="login" element={<Login />} />
      </Route>
    </Routes>
  )
}

export default App