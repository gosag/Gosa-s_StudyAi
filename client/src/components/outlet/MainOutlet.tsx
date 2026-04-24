import { Outlet, NavLink, useLocation } from "react-router-dom";
import { Home, Library, Layers, Settings, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

function MainOutLet() {
  const [currentStreak, setCurrentStreak] = useState<number | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const location = useLocation();

  useEffect(() => {
    async function fetchStreak() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/streak`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (!res.ok) {
          console.log("Something went wrong");
          if (res.status === 401 || res.status === 404) {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }
          return;
        }
        setCurrentStreak(Number(data.currentStreak));
      } catch (err) {
        console.log(err);
      }
    }
    fetchStreak();
  }, [location.pathname]);

  const theme: any = localStorage.getItem("theme");
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    if (theme) root.classList.add(theme);
  }, [theme]);

  // Close menu when route changes on mobile
  useEffect(() => {
    setShowMenu(false);
  }, [location.pathname]);

  const navItems = [
    { name: "Home", path: "/", icon: <Home className="w-5 h-5" /> },
    { name: "Library", path: "/library", icon: <Library className="w-5 h-5" /> },
    { name: "Flashcards", path: "/flashcards", icon: <Layers className="w-5 h-5" /> },
    { name: "Settings", path: "/settings", icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <>
      <style>{`
        @keyframes fire-flicker {
          0% { transform: scaleY(1) scaleX(1); filter: drop-shadow(0 0 3px rgba(255,120,0,0.4)); }
          30% { transform: scaleY(1.06) scaleX(0.98); filter: drop-shadow(0 0 6px rgba(255,140,0,0.6)); }
          60% { transform: scaleY(0.97) scaleX(1.02); filter: drop-shadow(0 0 4px rgba(255,100,0,0.5)); }
          100% { transform: scaleY(1) scaleX(1); filter: drop-shadow(0 0 3px rgba(255,120,0,0.4)); }
        }
        @keyframes fire-glow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.8; }
        }
        .fire-wrapper { position: relative; display: inline-flex; }
        .fire-core { animation: fire-flicker 2.8s infinite ease-in-out; transform-origin: bottom center; }
        .fire-glow { position: absolute; inset: 0; animation: fire-glow 3.5s infinite ease-in-out; transform-origin: bottom center; }
      `}</style>

      <div className="flex min-h-screen bg-gray-50/50 dark:bg-[#09090b] text-gray-900 dark:text-zinc-100 font-sans selection:bg-blue-500/30">
        
        {/* Mobile Header */}
        <div className="md:hidden fixed top-0 w-full z-40 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-gray-200 dark:border-zinc-800/60 px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-linear-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">Echo<span className="text-blue-600 dark:text-blue-400 bg-clip-text">Study</span></span>
          </div>
          <button 
            onClick={() => setShowMenu(true)}
            className="p-2 -mr-2 rounded-xl text-gray-600 hover:bg-gray-100 dark:text-zinc-300 dark:hover:bg-zinc-800/50 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Backdrop for Mobile */}
        {showMenu && (
          <div 
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden transition-opacity"
            onClick={() => setShowMenu(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed inset-y-0 left-0 z-50 w-72 md:w-64 flex flex-col 
          bg-white/80 dark:bg-zinc-950/80 backdrop-blur-2xl
          border-r border-gray-200 dark:border-zinc-800/60
          transform transition-transform duration-400 cubic-bezier(0.16, 1, 0.3, 1)
          shadow-2xl md:shadow-none
          ${showMenu ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0
        `}>
          {/* Logo Section */}
          <div className="h-16 md:h-20 flex items-center justify-between px-6 border-b border-gray-100 dark:border-zinc-800/50 shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-linear-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                Echo<span className="text-blue-600 dark:text-blue-400">Study</span>
              </span>
            </div>
            <button 
              onClick={() => setShowMenu(false)}
              className="md:hidden p-2 -mr-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:text-zinc-400 dark:hover:bg-zinc-800/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 overflow-y-auto overflow-x-hidden space-y-1.5 scrollbar-hide">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) => `
                  group flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200
                  ${isActive 
                    ? "bg-blue-50/80 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 shadow-xs ring-1 ring-blue-500/10" 
                    : "text-gray-600 dark:text-zinc-400 hover:bg-gray-100/80 dark:hover:bg-zinc-800/50 hover:text-gray-900 dark:hover:text-zinc-200"}
                `}
              >
                <div className="transition-transform duration-200 group-hover:scale-110">
                  {item.icon}
                </div>
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>

          {/* Streak Section */}
          <div className="p-4 mt-auto">
            <div className={`
              relative overflow-hidden rounded-2xl p-4 flex items-center gap-4 transition-all duration-300
              ${currentStreak === 0 
                ? "bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800" 
                : "bg-linear-to-br from-orange-50 to-amber-50/50 dark:from-orange-950/20 dark:to-orange-900/10 border border-orange-200/60 dark:border-orange-500/20 shadow-xs"}
            `}>
              <div className="fire-wrapper w-8 h-8 shrink-0 relative z-10">
                <svg viewBox="0 0 24 24" fill="currentColor" className={`${currentStreak === 0 ? "text-gray-300 dark:text-zinc-700 blur-sm" : "text-orange-400"} fire-glow blur-md`}>
                  <path d="M12.963 2.286a.75.75 0 00-1.071-.136 9.742 9.742 0 00-3.539 6.177A7.547 7.547 0 016.648 6.61a.75.75 0 00-1.152.082A9 9 0 1015.68 4.534a7.46 7.46 0 01-2.717-2.248z" />
                </svg>
                <svg viewBox="0 0 24 24" fill="currentColor" className={`fire-core relative ${currentStreak === 0 ? "text-gray-400 dark:text-zinc-600" : "text-linear-to-t from-orange-600 to-amber-400 dark:from-orange-500 dark:to-orange-300"}`}>
                  <path d="M12.963 2.286a.75.75 0 00-1.071-.136 9.742 9.742 0 00-3.539 6.177A7.547 7.547 0 016.648 6.61a.75.75 0 00-1.152.082A9 9 0 1015.68 4.534a7.46 7.46 0 01-2.717-2.248z" />
                </svg>
              </div>
              <div className="flex flex-col relative z-10">
                <span className={`text-xl font-bold tracking-tight leading-none ${currentStreak === 0 ? "text-gray-500 dark:text-zinc-400" : "text-orange-600 dark:text-orange-400"}`}>
                  {currentStreak || 0}
                </span>
                <span className={`text-xs font-medium tracking-wide mt-1 ${currentStreak === 0 ? "text-gray-400 dark:text-zinc-500" : "text-orange-800/80 dark:text-orange-300/80"}`}>
                  Day Streak!
                </span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 w-full min-w-0 md:pl-64 pt-16 md:pt-0 transition-all duration-300">
          <div className="h-full w-full mx-auto max-w-7xl p-4 md:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
}

export default MainOutLet;