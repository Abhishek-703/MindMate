import React from 'react';

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onGetStarted }) => {
  const title = "MindMate";

  return (
    <div className="min-h-screen bg-[#211A16] font-sans flex flex-col items-center justify-center text-center p-8 transition-colors duration-300">
      <div className="flex-grow flex flex-col items-center justify-center">
        {/* Animated App Name */}
        <h1 className="text-6xl font-serif font-medium tracking-tight text-white" aria-label={title} style={{ textShadow: '0 2px 5px rgba(0, 0, 0, 0.25)' }}>
          {title.split('').map((letter, index) => (
            <span
              key={index}
              className="animate-letter-appear"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              {letter}
            </span>
          ))}
        </h1>
      </div>

      <div 
        className="w-full max-w-sm animate-fadeInUp opacity-0"
        style={{ animationDelay: '0.8s' }}
      >
        <button
          onClick={onGetStarted}
          className="w-full primary-button font-bold py-4 px-12 rounded-full text-lg shadow-lg shadow-purple-900/10"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;