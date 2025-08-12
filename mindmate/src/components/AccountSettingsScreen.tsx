

import React, { useState, useRef } from 'react';
import { BackIcon } from './icons/NavIcons';
import { User } from '@supabase/supabase-js';
import * as authService from '../services/authService';
import { useToast } from '../contexts/ToastContext';
import Spinner from './icons/Spinner';

interface AccountSettingsScreenProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

const AccountSettingsScreen: React.FC<AccountSettingsScreenProps> = ({ isOpen, onClose, user }) => {
    const [name, setName] = useState(user.user_metadata.full_name || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');
    const { showToast } = useToast();
    const avatarFileRef = useRef<HTMLInputElement>(null);
    
    const hasNameChanged = name.trim() !== '' && name !== (user.user_metadata.full_name || '');
    const isPasswordValid = password.length === 0 || (password.length >= 6 && password === confirmPassword);
    const canSubmit = !isLoading && (hasNameChanged || (password.length > 0 && isPasswordValid));

    const avatarUrl = user.user_metadata.avatar_url;

    const handleAvatarClick = () => {
        avatarFileRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || event.target.files.length === 0) {
            return;
        }
        const file = event.target.files[0];
        setIsUploading(true);
        setError('');
        try {
            await authService.uploadAvatar(user.id, file);
            showToast('Profile picture updated!', { type: 'success' });
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to upload avatar.';
            setError(message);
        } finally {
            setIsUploading(false);
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!isPasswordValid) {
            setError('Passwords do not match or are less than 6 characters.');
            return;
        }
        
        setIsLoading(true);

        try {
            const updateData: { full_name?: string, password?: string } = {};
            if (hasNameChanged) {
                updateData.full_name = name.trim();
            }
            if (password.length >= 6) {
                updateData.password = password;
            }

            if (Object.keys(updateData).length > 0) {
                await authService.updateUser(updateData);
                showToast('Your account has been updated successfully.', { type: 'success' });
                setPassword('');
                setConfirmPassword('');
            }
        } catch(err) {
            const message = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(message);
            showToast(message, { type: 'error' });
        } finally {
            setIsLoading(false);
        }
    }


  return (
    <div
      className={`absolute inset-0 backdrop-blur-2xl flex flex-col transition-transform duration-500 ease-in-out z-50 text-[var(--text-primary)] ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="account-title"
    >
      <header className="flex-shrink-0 h-16 flex items-center justify-between px-4 border-b border-[var(--profile-border)]">
        <button 
            onClick={onClose} 
            className="p-2 text-[var(--text-primary)] hover:opacity-80 transition-colors rounded-full"
            aria-label="Go back"
        >
          <BackIcon />
        </button>
        <h1 id="account-title" className="text-lg font-serif font-bold">Account Settings</h1>
        <div className="w-10 h-10"></div>
      </header>
      
      <div className="flex-grow overflow-y-auto p-6">
        <div className="flex flex-col items-center space-y-4 mb-8">
            <input 
                type="file" 
                ref={avatarFileRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/png, image/jpeg, image/webp"
                disabled={isUploading}
            />
            <button
                onClick={handleAvatarClick}
                disabled={isUploading}
                className="relative w-24 h-24 rounded-full bg-zinc-200 dark:bg-white/10 flex items-center justify-center border border-zinc-300 dark:border-white/20 overflow-hidden group"
                aria-label="Change profile picture"
            >
                {avatarUrl ? (
                     <img src={avatarUrl} alt="User avatar" className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" />
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[var(--text-primary)] group-hover:opacity-50 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </div>
                {isUploading && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                        <Spinner />
                    </div>
                )}
            </button>
            <button
                onClick={handleAvatarClick}
                disabled={isUploading}
                className="text-sm font-semibold text-[var(--brand-primary)] hover:underline"
            >
                {isUploading ? 'Uploading...' : 'Change Photo'}
            </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <div className="space-y-6 flex-grow">
            {error && <p className="text-red-500 dark:text-red-400 text-sm p-3 bg-red-500/10 rounded-lg">{error}</p>}
            
            <div>
                <label htmlFor="display-name" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Display Name</label>
                <input
                id="display-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your new display name"
                className="w-full text-left bg-[var(--input-bg)] placeholder-[var(--text-secondary)] border border-[var(--card-border)] rounded-xl py-3 px-4 text-base focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition-all duration-300"
                disabled={isLoading}
                />
                <p className="text-xs text-[var(--text-secondary)] mt-2 px-1">This is how your name will appear in MindMate.</p>
            </div>

            <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">New Password (optional)</label>
                <input
                id="new-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Leave blank to keep current password"
                className="w-full text-left bg-[var(--input-bg)] placeholder-[var(--text-secondary)] border border-[var(--card-border)] rounded-xl py-3 px-4 text-base focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition-all duration-300"
                disabled={isLoading}
                />
                {password.length > 0 && password.length < 6 && (
                    <p className="text-xs text-red-500 mt-1">Password must be at least 6 characters long.</p>
                )}
            </div>
            
            {password.length > 0 && (
                <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Confirm New Password</label>
                <input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your new password"
                    className="w-full text-left bg-[var(--input-bg)] placeholder-[var(--text-secondary)] border border-[var(--card-border)] rounded-xl py-3 px-4 text-base focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition-all duration-300"
                    disabled={isLoading}
                />
                {confirmPassword.length > 0 && password !== confirmPassword && (
                        <p className="text-xs text-red-500 mt-1">Passwords do not match.</p>
                    )}
                </div>
            )}
            </div>
            
            <div className="flex-shrink-0 mt-8">
                <button
                    type="submit"
                    disabled={!canSubmit}
                    className="w-full primary-button font-bold py-3 px-12 rounded-full text-base disabled:opacity-50"
                >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default AccountSettingsScreen;