

import React from 'react';
import Spinner from '../icons/Spinner';

interface QuoteCardProps {
    quote: { quote: string; author: string; } | null;
    isLoading: boolean;
}

const QuoteCard: React.FC<QuoteCardProps> = ({ quote, isLoading }) => {
    return (
        <div className="glass-card rounded-2xl p-6 flex flex-col justify-center min-h-[160px]">
            <h2 className="font-serif font-bold text-lg mb-2 text-center">Mindful Moment</h2>
            {isLoading ? (
                <div className="flex justify-center items-center flex-grow">
                    <Spinner />
                </div>
            ) : (
                <div className="space-y-3 text-center flex-grow flex flex-col justify-center">
                    <blockquote className="font-serif text-lg italic text-[var(--text-secondary)]">
                        "{quote?.quote}"
                    </blockquote>
                    <p className="text-right text-sm text-[var(--text-secondary)]/80">- {quote?.author}</p>
                </div>
            )}
        </div>
    );
};

export default QuoteCard;