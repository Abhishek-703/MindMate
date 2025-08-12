
import React, { useRef, useEffect } from 'react';
import type { View } from '../types';
import { HomeIcon, ChatIcon, MoodIcon, ResourcesIcon } from './icons/NavIcons';

interface BottomNavProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

interface NavButtonProps {
    label: string;
    viewName: View;
    isActive: boolean;
    onClick: () => void;
    children: React.ReactNode;
}

const NavButton: React.FC<NavButtonProps> = ({ label, viewName, isActive, onClick, children }) => {
    const iconRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isActive && iconRef.current) {
            const iconElement = iconRef.current;
            // Add class to trigger animation
            iconElement.classList.add('animate-nav-icon-select');
            // Remove class after animation completes to allow re-triggering
            const timer = setTimeout(() => {
                iconElement.classList.remove('animate-nav-icon-select');
            }, 400); // Must match animation duration
            return () => clearTimeout(timer);
        }
    }, [isActive]);
    
    // Pass the isActive prop down to the icon child component
    const iconWithActiveState = React.isValidElement(children)
      ? React.cloneElement(children as React.ReactElement<{ isActive: boolean }>, { isActive })
      : children;

    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center justify-center w-full h-full pt-2 pb-1 gap-1 text-xs transition-colors duration-200 focus:outline-none rounded-md ${
                isActive ? 'text-[var(--text-primary)] font-bold' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
            aria-label={`Go to ${label}`}
            aria-current={isActive ? 'page' : undefined}
        >
            <div ref={iconRef}>{iconWithActiveState}</div>
            <span>{label}</span>
        </button>
    );
};


const BottomNav: React.FC<BottomNavProps> = ({ currentView, setCurrentView }) => {
  return (
    <footer 
        className="h-20 bg-white/60 dark:bg-zinc-900/60 flex-shrink-0 shadow-[0_-8px_32px_rgba(0,0,0,0.07)] dark:shadow-[0_-8px_32px_rgba(0,0,0,0.3)]"
        style={{ backdropFilter: 'blur(64px)', WebkitBackdropFilter: 'blur(64px)' } as React.CSSProperties}
    >
      <nav className="h-full">
        <div className="flex justify-around items-center h-full max-w-lg mx-auto">
            <NavButton
                label="Home"
                viewName="home"
                isActive={currentView === 'home'}
                onClick={() => setCurrentView('home')}
            >
                <HomeIcon />
            </NavButton>
            <NavButton
                label="Chat"
                viewName="chat"
                isActive={currentView === 'chat'}
                onClick={() => setCurrentView('chat')}
            >
                <ChatIcon />
            </NavButton>
            <NavButton
                label="Journey"
                viewName="journey"
                isActive={currentView === 'journey'}
                onClick={() => setCurrentView('journey')}
            >
                <MoodIcon />
            </NavButton>
            <NavButton
                label="Resources"
                viewName="resources"
                isActive={currentView === 'resources'}
                onClick={() => setCurrentView('resources')}
            >
                <ResourcesIcon />
            </NavButton>
        </div>
      </nav>
    </footer>
  );
};

export default BottomNav;