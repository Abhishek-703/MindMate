import React from 'react';
import { ChatIcon } from './icons/NavIcons';

interface FloatingChatButtonProps {
    onClick: () => void;
}

const FloatingChatButton: React.FC<FloatingChatButtonProps> = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="group absolute bottom-24 right-4 z-20 bg-[var(--brand-primary)] text-white rounded-full p-4 shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-100 dark:focus-visible:ring-offset-zinc-950 focus-visible:ring-black dark:focus-visible:ring-white animate-fadeInUp floating-button-hover"
            aria-label="Open chat"
        >
            <div className="transition-transform duration-300 ease-in-out group-hover:scale-125">
                <ChatIcon />
            </div>
        </button>
    );
};

export default FloatingChatButton;