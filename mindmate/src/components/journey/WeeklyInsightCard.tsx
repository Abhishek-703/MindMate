
import React from 'react';
import { WeeklyInsightRow } from '../../types';

interface WeeklyInsightCardProps {
  insight: WeeklyInsightRow;
  onView: () => void;
}

const WeeklyInsightCard: React.FC<WeeklyInsightCardProps> = ({ insight, onView }) => {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  const startDate = new Date(insight.start_date);
  // Add a day to startDate to make it inclusive for formatting.
  startDate.setDate(startDate.getDate() + 1);

  return (
    <button
      onClick={onView}
      className="w-full text-left p-4 flex items-center gap-4 bg-[var(--input-bg)] hover:bg-zinc-500/10 transition-colors rounded-xl border border-[var(--card-border)] animate-fadeInUp"
    >
      <div className="p-2 bg-[var(--brand-primary-glass)] rounded-full text-[var(--brand-primary)]">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </div>
      <div className="flex-grow">
        <p className="font-bold text-[var(--text-primary)]">Your Weekly Insight</p>
        <p className="text-xs text-[var(--text-secondary)]">
          {`${formatDate(insight.start_date)} - ${formatDate(insight.end_date)}`}
        </p>
      </div>
      <span className="text-[var(--text-secondary)] text-lg leading-none">&rsaquo;</span>
    </button>
  );
};

export default WeeklyInsightCard;