
import React from 'react';

interface ConversationStartersCardProps {
    onNavigateToChat: (prompt: string) => void;
}

const prompts: { short: string; full: string }[] = [
    { short: "I'm feeling anxious...", full: "I'm feeling anxious about something." },
    { short: "Practice mindfulness", full: "How can I practice mindfulness today?" },
    { short: "Celebrate a win", full: "I want to celebrate a small win." },
];

const ConversationStartersCard: React.FC<ConversationStartersCardProps> = ({ onNavigateToChat }) => {
    return (
        <div className="glass-card rounded-2xl p-6 flex flex-col">
            <div>
                <h2 className="font-serif font-bold text-lg mb-1">Talk It Out</h2>
                <p className="text-[var(--text-secondary)] text-sm mb-4">Not sure where to start? Try a prompt.</p>
            </div>
            <div className="flex flex-row gap-3 overflow-x-auto no-scrollbar pb-2 -mx-6 px-6">
                {prompts.map((prompt, index) => (
                    <button
                        key={index}
                        onClick={() => onNavigateToChat(prompt.full)}
                        className="flex-shrink-0 text-center text-sm pill-button rounded-full py-2 px-4 transition-colors duration-200"
                    >
                        {prompt.short}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ConversationStartersCard;