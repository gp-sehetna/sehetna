import React from 'react';

const AppLoader: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`loading-container bg-transparent! max-h-10! ${className || ''}`}>
      <svg width="140" height="140" viewBox="0 0 140 140" className="loader ">
        <defs>
          {/* Purple gradient */}
          <radialGradient id="purpleGradient" cx="35%" cy="35%">
            <stop offset="0%" stopColor="#f5e6ff" />
            <stop offset="40%" stopColor="#e8d4ff" />
            <stop offset="100%" stopColor="#c9a3ff" />
          </radialGradient>
          
          {/* Orange/Red gradient */}
          <radialGradient id="orangeGradient" cx="35%" cy="35%">
            <stop offset="0%" stopColor="#ffb8a0" />
            <stop offset="40%" stopColor="#ff6b35" />
            <stop offset="100%" stopColor="#ff0000" />
          </radialGradient>

          {/* Glow filters */}
          <filter id="purpleGlow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          <filter id="orangeGlow">
            <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Purple blob - morphing on the left */}
        <path
          fill="url(#purpleGradient)"
          filter="url(#purpleGlow)"
          className="blob-purple"
        >
          <animate
            attributeName="d"
            dur="4s"
            repeatCount="indefinite"
            values="
              M40,70 Q30,50 40,30 T60,20 T80,30 Q90,50 80,70 T60,80 T40,70 Z;
              M45,75 Q28,52 38,32 T58,18 T78,28 Q92,48 82,68 T62,82 T45,75 Z;
              M42,72 Q32,48 42,28 T62,22 T82,32 Q88,52 78,72 T58,78 T42,72 Z;
              M40,70 Q30,50 40,30 T60,20 T80,30 Q90,50 80,70 T60,80 T40,70 Z
            "
          />
        </path>

        {/* Orange blob - morphing on the right */}
        <path
          fill="url(#orangeGradient)"
          filter="url(#orangeGlow)"
          className="blob-orange"
        >
          <animate
            attributeName="d"
            dur="4s"
            repeatCount="indefinite"
            values="
              M60,60 Q45,35 65,20 T95,25 T115,45 Q125,70 110,90 T85,105 T60,95 T60,60 Z;
              M62,58 Q48,38 68,22 T98,28 T118,48 Q122,68 108,88 T82,102 T62,92 T62,58 Z;
              M58,62 Q42,32 62,18 T92,22 T112,42 Q128,72 112,92 T88,108 T58,98 T58,62 Z;
              M60,60 Q45,35 65,20 T95,25 T115,45 Q125,70 110,90 T85,105 T60,95 T60,60 Z
            "
          />
        </path>
      </svg>

      <style jsx>{`
        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: full;
          background: #000;
        }

        .loader {
          filter: drop-shadow(0 0 25px rgba(255, 107, 53, 0.3));
        }

        .blob-purple {
          opacity: 0.95;
          animation: floatPurple 4s ease-in-out infinite;
        }

        .blob-orange {
          opacity: 1;
          animation: floatOrange 4s ease-in-out infinite;
        }

        @keyframes floatPurple {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(-3px, -5px) rotate(2deg);
          }
          50% {
            transform: translate(-5px, 3px) rotate(-1deg);
          }
          75% {
            transform: translate(-2px, 5px) rotate(1deg);
          }
        }

        @keyframes floatOrange {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(5px, 3px) rotate(-2deg);
          }
          50% {
            transform: translate(3px, -5px) rotate(1deg);
          }
          75% {
            transform: translate(2px, -3px) rotate(-1deg);
          }
        }
      `}</style>
    </div>
  );
};

export default AppLoader;
