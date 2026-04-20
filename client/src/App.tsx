import SignUp from "./components/signUp"
import Login from "./components/login"
import MainOutLet from "./components/outlet/MainOutlet"
import { Routes, Route, Navigate } from "react-router-dom"
import Home from "./components/home"
import Library from "./components/library"
import MaterialContinue from "./components/material"
import Quiz from "./components/Quiz"
import FlashCard from "./components/flashCard"
import Settings from "./components/setting"
import LandingPage from "./components/landingPage"
import PassReset from "./components/passReset"
function App() {
  const isAuthenticated = !!localStorage.getItem("token");
  return (
    <Routes>
      {!isAuthenticated ? (
        <>
          <Route path="/" element={<LandingPage />} />
          <Route path="login" element={<Login />} />
          <Route path="signUp" element={<SignUp />} />
          <Route path="pass-reset" element={<PassReset />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      ) : (
        <Route path="/" element={<MainOutLet />}>
          <Route index element={<Home />} />
          <Route path="library" element={<Library />} />
          <Route path="flashcards" element={<FlashCard />} />
          <Route path="settings" element={<Settings />} />
          <Route path="library/:id" element={<MaterialContinue />} />
          <Route path="library/:id/flashcards" element={<Quiz />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      )}
    </Routes>
  )
}

export default App