

import React from 'react';
import { ProfileIcon, HistoryIcon } from './icons/NavIcons';
import type { View } from '../types';
import { User } from '@supabase/supabase-js';

interface TopBarProps {
  user: User | null;
  onProfileClick: () => void;
  onHistoryClick: () => void;
  isTitleVisible: boolean;
  currentView: View;
  insightProgress: { distinctDays: number; requiredDays: number, isReady: boolean };
}

const InsightProgressIndicator: React.FC<{ progress: { isReady: boolean } }> = ({ progress }) => {
  return (
    <div className="relative w-10 h-10 flex items-center justify-center">
      <HistoryIcon />
      {progress.isReady && (
        <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-yellow-400 rounded-full border-2 border-[var(--bg-cool-start)] animate-pulse" />
      )}
    </div>
  );
};


const TopBar: React.FC<TopBarProps> = ({ user, onProfileClick, onHistoryClick, isTitleVisible, currentView, insightProgress }) => {
  const avatarUrl = user?.user_metadata?.avatar_url;

  return (
    <header className="absolute top-0 left-0 right-0 z-20 flex-shrink-0 h-16 flex items-center justify-between px-4">
      <div className="w-10">
        {currentView === 'chat' && (
            <button 
                onClick={onHistoryClick} 
                className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors rounded-full"
                aria-label="Open Chat History"
            >
                <InsightProgressIndicator progress={insightProgress} />
            </button>
        )}
      </div>
      <h1 className={`text-lg font-serif font-bold text-[var(--text-primary)] transition-opacity duration-300 ease-in-out ${isTitleVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>MindMate</h1>
      <button 
        onClick={onProfileClick} 
        className={`w-10 h-10 flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all duration-300 ease-in-out rounded-full ${isTitleVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        aria-label="Open Profile"
        disabled={!isTitleVisible}
      >
        {avatarUrl ? (
            <img src={avatarUrl} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
        ) : (
            <ProfileIcon />
        )}
      </button>
    </header>
  );
};

export default TopBar;