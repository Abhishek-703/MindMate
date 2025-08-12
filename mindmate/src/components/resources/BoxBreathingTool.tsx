
import React, { useState, useEffect } from 'react';

interface BoxBreathingToolProps {
  scale: number;
  isScrolling: boolean;
}

const BreathingIcon = () => (
    <svg viewBox="0 0 100 100" className="w-24 h-24 text-[var(--text-secondary)] opacity-70 mx-auto mb-4">
        <rect x="20" y="20" width="60" height="60" rx="5" stroke="currentColor" strokeWidth="4" fill="none" />
        {/* Top arrow */}
        <path d="M40 20 L50 10 L60 20" stroke="currentColor" strokeWidth="4" fill="none" />
        {/* Right arrow */}
        <path d="M80 40 L90 50 L80 60" stroke="currentColor" strokeWidth="4" fill="none" />
        {/* Bottom arrow */}
        <path d="M60 80 L50 90 L40 80" stroke="currentColor" strokeWidth="4" fill="none" />
        {/* Left arrow */}
        <path d="M20 60 L10 50 L20 40" stroke="currentColor" strokeWidth="4" fill="none" />
    </svg>
);

const BoxBreathingTool: React.FC<BoxBreathingToolProps> = ({ scale, isScrolling }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [phase, setPhase] = useState('inhale');
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    if (isScrolling) {
      setIsFlipped(false);
    }
  }, [isScrolling]);

  useEffect(() => {
    if (!isFlipped) {
      setPhase('inhale');
      setAnimationClass('');
      return;
    };
    
    setAnimationClass('animate-breathe-in');
    
    const sequence = ['inhale', 'hold1', 'exhale', 'hold2'];
    let currentIndex = 0;

    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % sequence.length;
      const nextPhase = sequence[currentIndex];
      setPhase(nextPhase);

      if (nextPhase === 'inhale') {
        setAnimationClass('animate-breathe-in');
      } else if (nextPhase === 'exhale') {
        setAnimationClass('animate-breathe-out');
      }
    }, 4000); // 4 seconds per phase

    return () => clearInterval(interval);
  }, [isFlipped]);

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale': return 'Inhale...';
      case 'hold1': return 'Hold';
      case 'exhale': return 'Exhale...';
      case 'hold2': return 'Hold';
      default: return '';
    }
  };
  
  const backgroundStyle: React.CSSProperties = {
      transform: `scaleY(${scale})`,
      transition: 'transform 150ms linear',
      transformOrigin: 'center'
  };

  return (
    <div className={`card-flipper h-[65vh] max-h-[550px] w-full ${isFlipped ? 'is-flipped' : ''}`}>
        <div className="card-inner">
            <div className="card-front">
                <div className="relative w-full h-full">
                    <div 
                        className="absolute inset-0 w-full h-full glass-card rounded-3xl bg-white/80 dark:bg-zinc-900/80"
                        style={backgroundStyle}
                    />
                    <div className="relative z-10 h-full p-6 md:p-8 flex flex-col text-center">
                        <div className="flex-shrink-0 mb-4">
                            <div className="pill-tag">
                                PRACTICAL TOOL
                            </div>
                        </div>
                        <div className="flex-grow flex flex-col items-center justify-center space-y-4">
                            <BreathingIcon />
                            <h3 className="text-2xl font-serif font-bold text-[var(--text-primary)]">Mindful Breathing</h3>
                            <p className="text-[var(--text-secondary)] text-base max-w-xs">A simple 4-second breathing exercise to calm your mind and body. Find a comfortable spot and let's begin.</p>
                        </div>
                        <button onClick={() => setIsFlipped(true)} className="mt-auto pill-button w-full py-3 font-bold rounded-full">
                            Let's Start
                        </button>
                    </div>
                </div>
            </div>
            <div className="card-back">
                 <div className="relative w-full h-full">
                    <div 
                        className="absolute inset-0 w-full h-full glass-card rounded-3xl bg-white/80 dark:bg-zinc-900/80"
                        style={backgroundStyle}
                    />
                    <div className="relative z-10 h-full p-6 md:p-8 flex flex-col text-center">
                        <div className="flex-grow flex flex-col items-center justify-center space-y-8">
                            <h3 className="text-2xl font-serif font-bold text-[var(--text-primary)]">Mindful Breathing</h3>
                            <div className="relative w-48 h-48 flex items-center justify-center">
                                <div 
                                    className={`absolute w-full h-full rounded-full bg-[var(--brand-primary)] opacity-70 ${animationClass}`}
                                    style={{ animationDuration: '4s', animationTimingFunction: 'ease-in-out', animationFillMode: 'forwards' }}
                                />
                                <p className="z-10 text-3xl font-serif font-bold text-white transition-opacity duration-500">
                                    {getPhaseText()}
                                </p>
                            </div>
                            <p className="text-[var(--text-secondary)] text-base max-w-xs">
                                Follow the animation and text prompts to guide your breath. Match your breath to each 4-second phase.
                            </p>
                        </div>
                    </div>
                 </div>
            </div>
        </div>
    </div>
  );
};

export default BoxBreathingTool;