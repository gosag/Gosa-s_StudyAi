import { Outlet ,NavLink} from "react-router-dom";

function MainOutLet(){
    return(
<div className="flex">
    <div>
    <aside className="h-screen w-16 md:w-60 bg-white shadow-[4px_0_24px_rgba(0,0,0,0.05)] flex flex-col transition-all duration-300 shrink-0 z-50">

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
      <div className="flex items-center justify-center md:justify-start gap-3 px-2 md:px-4 py-6 border-b">
        <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shrink-0">
          <span className="text-white font-bold text-lg">E</span>
        </div>
        <span className="hidden md:block text-lg font-bold text-gray-800 tracking-wide truncate">
          Echo<span className="text-blue-600">Learn</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 md:px-4 py-6 overflow-y-auto overflow-x-hidden">
        <ul className="space-y-2">

          {[
            { to: "/", label: "Home", icon: (
              <path d="M10 2 2 7v11h5v-6h6v6h5V7l-8-5z"/>
            )},
            { to: "/library", label: "Library", icon: (
              <path d="M2 4a2 2 0 012-2h5v14H4a2 2 0 01-2-2V4zm9-2h5a2 2 0 012 2v10a2 2 0 01-2 2h-5V2z"/>
            )},
            { to: "/flashcards", label: "Flashcards", icon: (
              <>
                <rect x="5" y="4" width="14" height="10" rx="2" opacity="0.4"/>
                <rect x="3" y="8" width="14" height="10" rx="2"/>
                <rect x="6" y="11" width="8" height="1.5" rx="1"/>
                <rect x="6" y="14" width="6" height="1.5" rx="1"/>
              </>
            )},
            { to: "/settings", label: "Settings", icon: (
              <path fillRule="evenodd" clipRule="evenodd"
                d="M11.983 1.94a1 1 0 00-1.966 0l-.2 1.19a5.978 5.978 0 00-1.56.9l-1.11-.45a1 1 0 00-1.3.58l-.38 1.12a1 1 0 00.48 1.24l1.05.6a5.978 5.978 0 000 1.8l-1.05.6a1 1 0 00-.48 1.24l.38 1.12a1 1 0 001.3.58l1.11-.45c.48.36 1 .66 1.56.9l.2 1.19a1 1 0 001.966 0l.2-1.19a5.978 5.978 0 001.56-.9l1.11.45a1 1 0 001.3-.58l.38-1.12a1 1 0 00-.48-1.24l-1.05-.6a5.978 5.978 0 000-1.8l1.05-.6a1 1 0 00.48-1.24l-.38-1.12a1 1 0 00-1.3-.58l-1.11.45a5.978 5.978 0 00-1.56-.9l-.2-1.19zM10 13a3 3 0 100-6 3 3 0 000 6z"/>
            )}
          ].map(({ to, label, icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                title={label}
                className={({ isActive }) =>
                  `flex items-center justify-center md:justify-start gap-3 px-2 md:px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${isActive 
                    ? "bg-blue-50 text-blue-600" 
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"}`
                }
              >
                <svg className="h-5 w-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  {icon}
                </svg>
                <span className="hidden md:block">{label}</span>
              </NavLink>
            </li>
          ))}

        </ul>
      </nav>

      {/* 🔥 Streak Section */}
      <div className="px-2 md:px-4 pb-6 mt-auto shrink-0">
        <div
          className="bg-linear-to-br from-orange-50 to-orange-100 border border-orange-200 shadow-md rounded-xl p-2 md:p-3 flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-3"
          title="5 Day Study Streak!"
        >
          <div className="fire-wrapper w-6 h-6 md:w-7 md:h-7 shrink-0">

            {/* Glow */}
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="fire-glow text-orange-400 blur-sm"
            >
              <path d="M12.963 2.286a.75.75 0 00-1.071-.136 9.742 9.742 0 00-3.539 6.177A7.547 7.547 0 016.648 6.61a.75.75 0 00-1.152.082A9 9 0 1015.68 4.534a7.46 7.46 0 01-2.717-2.248z" />
            </svg>

            {/* Main Flame */}
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="fire-core text-orange-500 relative"
            >
              <path d="M12.963 2.286a.75.75 0 00-1.071-.136 9.742 9.742 0 00-3.539 6.177A7.547 7.547 0 016.648 6.61a.75.75 0 00-1.152.082A9 9 0 1015.68 4.534a7.46 7.46 0 01-2.717-2.248z" />
            </svg>
          </div>

          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <span className="text-orange-600 font-extrabold text-sm md:text-base leading-none">
              5
            </span>
            <span className="hidden md:block text-orange-800 text-xs font-semibold tracking-wide">
              Day Streak!
            </span>
          </div>
        </div>
      </div>

    </aside>
  </div>
  <main>
     <Outlet/>
  </main>
        </div>
    )
}
export default MainOutLet;