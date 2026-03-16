import { Outlet ,NavLink, useLocation} from "react-router-dom";
import { Home, Library, Layers, Settings } from "lucide-react";
import {useEffect ,useState} from "react"
function MainOutLet(){
  const [currentStreak,setCurrentStreak]=useState<number | null>(null)
  const location = useLocation();
  
  useEffect(()=>{
    document.title="EchoLearn - Your Path to Mastery"
    async function fetchStreak(){
      try{
        const token=localStorage.getItem("token");
        const res=await fetch(`${import.meta.env.VITE_API_URL}/api/streak`,{
          method:"GET",
          headers:{
            "Authorization":`Bearer ${token}`
          }
        })
        const data= await res.json()
        if(!res.ok){
          console.log(`${ "Something went wrong "} `)
        }
        const cStreak=Number(data.currentStreak)
        setCurrentStreak(cStreak)
      }catch(err){
        console.log(err)
      }
    }
    fetchStreak()
  }, [location.pathname])
  const theme:any =localStorage.getItem("theme")
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, []);
    return(
<>

<div className="flex min-h-screen bg-white dark:bg-zinc-950 text-gray-900 dark:text-zinc-100">
    <aside className="sticky top-0 h-screen w-16 md:w-60 bg-white dark:bg-zinc-950 shadow-[4px_0_24px_rgba(0,0,0,0.05)] dark:shadow-none dark:border-r dark:border-zinc-800 flex flex-col transition-all duration-300 shrink-0 z-50">

      {/* 🔥 Realistic Fire Animation Styles */}
      <style>{`
  @keyframes fire-flicker {
    0% {
      transform: scaleY(1) scaleX(1);
      filter: drop-shadow(0 0 3px rgba(255,120,0,0.4));
    }
    30% {
      transform: scaleY(1.06) scaleX(0.98);
      filter: drop-shadow(0 0 6px rgba(255,140,0,0.6));
    }
    60% {
      transform: scaleY(0.97) scaleX(1.02);
      filter: drop-shadow(0 0 4px rgba(255,100,0,0.5));
    }
    100% {
      transform: scaleY(1) scaleX(1);
      filter: drop-shadow(0 0 3px rgba(255,120,0,0.4));
    }
  }

  @keyframes fire-glow {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 0.8; }
  }

  .fire-wrapper {
    position: relative;
    display: inline-flex;
  }

  .fire-core {
    animation: fire-flicker 2.8s infinite ease-in-out;
    transform-origin: bottom center;
  }

  .fire-glow {
    position: absolute;
    inset: 0;
    animation: fire-glow 3.5s infinite ease-in-out;
    transform-origin: bottom center;
  }
`}</style>

      {/* Logo */}
      <div className="flex items-center justify-center md:justify-start gap-3 px-2 md:px-4 py-6 border-b dark:border-zinc-800">
        <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shrink-0">
          <span className="text-white font-bold text-lg">E</span>
        </div>
        <span className="hidden md:block text-lg font-bold text-gray-800 dark:text-zinc-100 tracking-wide truncate">
          Echo<span className="text-blue-600 dark:text-blue-400"> Study</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 md:px-4 py-6 overflow-y-auto overflow-x-hidden">
        <ul className="space-y-2">

          <li>
            <NavLink
              to="/"
              title="Home"
              className={({ isActive }) =>
                `flex items-center justify-center md:justify-start gap-3 px-2 md:px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive 
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400" 
                  : "text-gray-700 dark:text-zinc-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400"}`
              }
            >
              <Home className="h-5 w-5 shrink-0" />
              <span className="hidden md:block">Home</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/library"
              title="Library"
              className={({ isActive }) =>
                `flex items-center justify-center md:justify-start gap-3 px-2 md:px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive 
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400" 
                  : "text-gray-700 dark:text-zinc-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400"}`
              }
            >
              <Library className="h-5 w-5 shrink-0" />
              <span className="hidden md:block">Library</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/flashcards"
              title="Flashcards"
              className={({ isActive }) =>
                `flex items-center justify-center md:justify-start gap-3 px-2 md:px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive 
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400" 
                  : "text-gray-700 dark:text-zinc-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400"}`
              }
            >
              <Layers className="h-5 w-5 shrink-0" />
              <span className="hidden md:block">Flashcards</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/settings"
              title="Settings"
              className={({ isActive }) =>
                `flex items-center justify-center md:justify-start gap-3 px-2 md:px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive 
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400" 
                  : "text-gray-700 dark:text-zinc-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400"}`
              }
            >
              <Settings className="h-5 w-5 shrink-0" />
              <span className="hidden md:block">Settings</span>
            </NavLink>
          </li>

        </ul>
      </nav>

      {/* 🔥 Streak Section */}
      <div className="px-2 md:px-4 pb-6 mt-auto shrink-0">
        <div
          className="bg-linear-to-br from-orange-50 to-orange-100 dark:from-orange-950/40 dark:to-orange-900/20 border border-orange-200 dark:border-orange-900/50 shadow-md rounded-xl p-2 md:p-3 flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-3"
          title="5 Day Study Streak!"
        >
          <div className="fire-wrapper w-6 h-6 md:w-7 md:h-7 shrink-0">

            {/* Glow */}
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className={`${currentStreak===0?" text-gray-400 blur-sm":"text-orange-400"} fire-glow  blur-sm`}
            >
              <path d="M12.963 2.286a.75.75 0 00-1.071-.136 9.742 9.742 0 00-3.539 6.177A7.547 7.547 0 016.648 6.61a.75.75 0 00-1.152.082A9 9 0 1015.68 4.534a7.46 7.46 0 01-2.717-2.248z" />
            </svg>

            {/* Main Flame */}
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className={`fire-core relative ${currentStreak===0?"text-gray-400":" text-orange-500"}`}
            >
              <path d="M12.963 2.286a.75.75 0 00-1.071-.136 9.742 9.742 0 00-3.539 6.177A7.547 7.547 0 016.648 6.61a.75.75 0 00-1.152.082A9 9 0 1015.68 4.534a7.46 7.46 0 01-2.717-2.248z" />
            </svg>
          </div>

          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <span className="text-orange-600 font-extrabold text-sm md:text-base leading-none">
              {currentStreak}
            </span>
            <span className="hidden md:block text-orange-800 text-xs font-semibold tracking-wide">
              Day Streak!
            </span>
          </div>
        </div>
      </div>

    </aside>
    <main className="flex-1 w-full min-w-0">
      <Outlet/>
    </main>
</div>
</>
    )
}
export default MainOutLet;