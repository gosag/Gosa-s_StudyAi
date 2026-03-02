export function StudyStack() {
  return (
    <svg
      width="300"
      height="240"
      viewBox="70 30 300 240"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="8" floodOpacity="0.15" />
        </filter>
      </defs>

      {/* Back Paper */}
      <rect
        x="110"
        y="70"
        width="240"
        height="180"
        rx="18"
        fill="#fcd34d"
        transform="rotate(-4 230 160)"
      />

      {/* Middle Paper */}
      <rect
        x="95"
        y="55"
        width="240"
        height="180"
        rx="18"
        fill="#93c5fd"
        transform="rotate(3 215 145)"
      />

      {/* Front Paper */}
      <rect
        x="80"
        y="40"
        width="240"
        height="180"
        rx="18"
        fill="#ffffff"
        stroke="#e5e7eb"
        strokeWidth="2"
        filter="url(#shadow)"
      />

      {/* Lines */}
      <line x1="100" y1="100" x2="300" y2="100" stroke="#e5e7eb" strokeWidth="2" />
      <line x1="100" y1="130" x2="300" y2="130" stroke="#e5e7eb" strokeWidth="2" />
      <line x1="100" y1="160" x2="300" y2="160" stroke="#e5e7eb" strokeWidth="2" />
      <line x1="100" y1="190" x2="300" y2="190" stroke="#e5e7eb" strokeWidth="2" />

      {/* Title Text */}
      <text
        x="100"
        y="80"
        fontSize="18"
        fontWeight="600"
        fill="#1f2937"
      >
        Last 10 Questions Asked
      </text>

      {/* Example Answer Text (On Line) */}
      <text
        x="100"
        y="95"
        fontSize="14"
        fill="#374151"
      >
        1. What is 2 + 2?
      </text>
      <text
        x="100"
        y="125"
        fontSize="14"
        fill="#374151"
      >
        1. What is 4 + 2?
      </text>
    </svg>
  );
}
