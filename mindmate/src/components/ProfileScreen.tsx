

import React from 'react';
import { BackIcon } from './icons/NavIcons';
import { useTheme } from '../contexts/ThemeContext';
import { User } from '@supabase/supabase-js';

interface ProfileScreenProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  onNavigateToAccount: () => void;
  user: User;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ isOpen, onClose, onLogout, onNavigateToAccount, user }) => {
  const { theme, toggleTheme } = useTheme();

  const handleFeatureSoon = () => {
    alert('This feature is coming soon!');
  }
  
  const joinDate = new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const displayName = user.user_metadata.full_name || user.email;
  const avatarUrl = user.user_metadata.avatar_url;

  return (
    <div
      className={`absolute inset-0 backdrop-blur-2xl flex flex-col transition-transform duration-500 ease-in-out z-40 text-[var(--text-primary)] ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-title"
    >
      <header className="flex-shrink-0 h-16 flex items-center justify-between px-4 border-b border-[var(--profile-border)]">
        <button 
            onClick={onClose} 
            className="p-2 text-[var(--text-primary)] hover:opacity-80 transition-colors rounded-full"
            aria-label="Go back"
        >
          <BackIcon />
        </button>
        <h1 id="profile-title" className="text-lg font-serif font-bold text-black dark:text-white">Profile</h1>
        <div className="w-10 h-10"></div> {/* Spacer to perfectly center the title */}
      </header>
      
      <main className="flex-grow overflow-y-auto p-6 space-y-8">
        {/* Profile Section */}
        <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-zinc-200 dark:bg-white/10 flex items-center justify-center mb-4 border border-zinc-300 dark:border-white/20 overflow-hidden">
                {avatarUrl ? (
                    <img src={avatarUrl} alt="User avatar" className="w-full h-full object-cover" />
                ) : (
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[var(--text-primary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                )}
            </div>
            
            <h2 className="text-2xl font-serif font-bold text-black dark:text-white">
                {displayName}
            </h2>

            <p className="text-sm text-[var(--text-primary)] mt-1">Joined {joinDate}</p>
        </div>

        {/* Settings Section */}
        <div className="space-y-4">
            <h3 className="font-serif font-extrabold text-sm uppercase text-black dark:text-white tracking-widest px-2">Settings</h3>
            <div className="bg-[var(--profile-card-bg)] rounded-xl divide-y divide-[var(--profile-border)] border border-[var(--profile-border)]">
                <div className="p-4 flex justify-between items-center">
                    <span className="select-none font-medium">Theme</span>
                     <span className="text-sm text-white dark:text-[var(--text-primary)] capitalize">{theme}</span>
                </div>
                 <label htmlFor="theme-toggle-switch" className="p-4 flex justify-between items-center cursor-pointer">
                    <span className="select-none font-medium">Dark Mode</span>
                    <div className="relative">
                        <input 
                            id="theme-toggle-switch"
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={theme === 'dark'} 
                            onChange={toggleTheme}
                        />
                        <div className="w-11 h-6 bg-zinc-200 dark:bg-zinc-700 rounded-full peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--brand-primary)]"></div>
                    </div>
                </label>
                <button onClick={onNavigateToAccount} className="w-full text-left p-4 flex justify-between items-center hover:bg-zinc-500/5 transition-colors">
                    <span className="font-medium">Account</span>
                    <span className="text-white dark:text-[var(--text-primary)] text-lg leading-none">&rsaquo;</span>
                </button>
                <button onClick={handleFeatureSoon} className="w-full text-left p-4 flex justify-between items-center hover:bg-zinc-500/5 transition-colors">
                    <span className="font-medium">Notifications</span>
                    <span className="text-white dark:text-[var(--text-primary)] text-lg leading-none">&rsaquo;</span>
                </button>
            </div>
        </div>

        {/* Actions Section */}
        <div className="space-y-4">
            <h3 className="font-serif font-extrabold text-sm uppercase text-black dark:text-white tracking-widest px-2">Actions</h3>
            <div className="bg-[var(--profile-card-bg)] rounded-xl border border-[var(--profile-border)]">
                <button onClick={onLogout} className="w-full text-left p-4 flex justify-between items-center text-red-600 dark:text-red-500 hover:bg-red-500/10 transition-colors rounded-lg">
                    <span className="font-medium">Log Out</span>
                </button>
            </div>
        </div>
      </main>
    </div>
  );
};

export default ProfileScreen;