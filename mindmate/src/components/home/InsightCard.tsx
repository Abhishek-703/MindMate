
import React from 'react';
import { MoodInsight } from '../../types';
import Spinner from '../icons/Spinner';

interface InsightCardProps {
    insight: MoodInsight | null;
    isLoading: boolean;
}

const InsightCard: React.FC<InsightCardProps> = ({ insight, isLoading }) => {
    return (
        <div className="glass-card rounded-2xl p-6 flex flex-col justify-center min-h-[160px]">
            <h2 className="font-serif font-bold text-lg mb-4 text-center">Your Progress Insight ✨</h2>
            {isLoading ? (
                <div className="flex justify-center items-center h-20">
                    <Spinner />
                </div>
            ) : insight ? (
                <div className="space-y-2 text-center animate-fadeIn">
                    <h3 className="font-semibold text-lg text-[var(--text-primary)]">
                        {insight.title}
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)]">
                        {insight.insight}
                    </p>
                </div>
            ) : (
                <div className="text-center text-sm text-[var(--text-secondary)]">
                    <p>Keep logging your mood to unlock a new insight!</p>
                </div>
            )}
        </div>
    );
};

export default InsightCard;