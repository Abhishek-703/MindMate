

import React, { useEffect, useRef } from 'react';

interface AnimatedIntroScreenProps {
  phase: 'tangle' | 'untangle';
  onContinue?: () => void; // For tangle phase
  onAnimationEnd?: () => void; // For untangle phase
}

const TanglePhase: React.FC<{ onContinue: () => void }> = ({ onContinue }) => {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength();
      pathRef.current.style.strokeDasharray = `${length}`;
      pathRef.current.style.strokeDashoffset = `${length}`;
      pathRef.current.classList.add('animate-draw-scribble');
    }
  }, []);

  return (
    <div className="flex-grow flex flex-col items-center justify-center w-full max-w-md">
      <div className="h-40 flex items-center justify-center">
        <h2 className="text-2xl font-serif text-white/90 animate-fadeInUp" style={{ animationDelay: '200ms' }}>
          Feeling tangled up inside?
        </h2>
      </div>
      
      <div className="w-full h-52">
        <svg viewBox="0 0 300 200" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          <defs>
              <linearGradient id="tangleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{stopColor: '#fca5a5', stopOpacity: 1}} />
                  <stop offset="100%" style={{stopColor: '#a78bfa', stopOpacity: 1}} />
              </linearGradient>
          </defs>
          <path
            ref={pathRef}
            d="M20 100 Q 60 20, 100 100 T 180 100 Q 220 20, 260 100 L 280 80 Q 240 180, 200 80 T 120 80 Q 80 180, 40 80 L 20 100"
            stroke="url(#tangleGradient)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      
      <div className="w-full max-w-sm h-24 flex items-center animate-fadeInUp" style={{ animationDelay: '2200ms' }}>
         <button
          onClick={onContinue}
          className="w-full primary-button font-bold py-4 px-12 rounded-full text-lg shadow-lg"
        >
          Continue
        </button>
      </div>
    </div>
  );
};


const UntanglePhase: React.FC<{ onAnimationEnd: () => void }> = ({ onAnimationEnd }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onAnimationEnd();
    }, 4000); // Wait for 4 seconds before moving to the next screen

    return () => clearTimeout(timer);
  }, [onAnimationEnd]);

  const path1 = "M -20 150 Q 80 100, 180 150 T 340 150";
  const path2 = "M -20 150 Q 80 200, 180 150 T 340 150";

  return (
    <div className="flex-grow flex flex-col items-center justify-center w-full max-w-md">
      <div className="h-40 flex items-end justify-center">
        <h2 className="text-2xl font-serif text-white/90 animate-fadeInUp">
          Mindfulness is a gentle, flowing stream.
        </h2>
      </div>
      
      <div className="w-full h-52">
        <svg viewBox="-20 0 360 300" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          <defs>
              <linearGradient id="ribbonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{stopColor: 'var(--brand-primary)', stopOpacity: 1}} />
                  <stop offset="100%" style={{stopColor: '#A78BFA', stopOpacity: 1}} />
              </linearGradient>
          </defs>
          <path
            stroke="url(#ribbonGradient)"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          >
            <animate
              attributeName="d"
              dur="4s"
              repeatCount="indefinite"
              values={`${path1}; ${path2}; ${path1};`}
              calcMode="spline"
              keyTimes="0; 0.5; 1"
              keySplines="0.42 0 0.58 1; 0.42 0 0.58 1"
            />
          </path>
        </svg>
      </div>
      <div className="w-full max-w-sm h-24 flex items-center" />
    </div>
  );
};


const AnimatedIntroScreen: React.FC<AnimatedIntroScreenProps> = ({ phase, onContinue, onAnimationEnd }) => {
  if (phase === 'tangle') {
    if (!onContinue) {
        console.error("onContinue prop is required for the 'tangle' phase.");
        return null;
    }
    return (
        <div className="min-h-screen bg-zinc-900 font-sans flex flex-col items-center justify-center text-center p-8 overflow-hidden animate-fadeIn">
            <TanglePhase onContinue={onContinue} />
        </div>
    );
  }

  if (phase === 'untangle') {
    if (!onAnimationEnd) {
        console.error("onAnimationEnd prop is required for the 'untangle' phase.");
        return null;
    }
    return (
        <div className="min-h-screen bg-zinc-900 font-sans flex flex-col items-center justify-center text-center p-8 overflow-hidden animate-fadeIn">
            <UntanglePhase onAnimationEnd={onAnimationEnd} />
        </div>
    );
  }
  
  return null;
};

export default AnimatedIntroScreen;