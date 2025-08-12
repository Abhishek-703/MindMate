
import React from 'react';
import { DailyFocus, View } from '../../types';
import Spinner from '../icons/Spinner';

interface FocusCardProps {
    focus: Omit<DailyFocus, 'date'> | null;
    isLoading: boolean;
    onNavigate: (view: View) => void;
    onNavigateToChat: (prompt?: string) => void;
}

const FocusCard: React.FC<FocusCardProps> = ({ focus, isLoading, onNavigate, onNavigateToChat }) => {
    
    const handleActionClick = () => {
        if (focus?.focusAction) {
            const { target, prompt } = focus.focusAction;
            if (target === 'chat') {
                onNavigateToChat(prompt);
            } else {
                onNavigate(target);
            }
        }
    };

    return (
        <div className="glass-card rounded-2xl p-6 flex flex-col justify-center min-h-[180px]">
            {isLoading ? (
                <div className="flex justify-center items-center h-full"><Spinner /></div>
            ) : focus ? (
                <div className="space-y-3 animate-fadeIn">
                    <h2 className="font-serif font-bold text-lg">{focus.focusTitle}</h2>
                    <p className="text-sm text-[var(--text-secondary)]">{focus.focusText}</p>
                    {focus.focusAction && (
                        <button
                            onClick={handleActionClick}
                            className="mt-2 text-left pill-button rounded-full py-2 px-4 text-sm font-semibold"
                        >
                            {focus.focusAction.text} &rarr;
                        </button>
                    )}
                </div>
            ) : (
                <div className="text-center text-sm text-[var(--text-secondary)]">
                    <p>Could not load today's focus. Please check back later.</p>
                </div>
            )}
        </div>
    );
};

export default FocusCard;