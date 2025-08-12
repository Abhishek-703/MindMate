
import React, { useRef } from 'react';
import { Mood, MoodsRow } from '../../types';

interface MoodHistoryItemProps {
  entry: MoodsRow;
  isSelected: boolean;
  onPress: (id: string) => void;
  onLongPress: (id: string) => void;
  justAddedId: string | null;
}

const moodConfig: Record<Mood, { emoji: string }> = {
  [Mood.Great]: { emoji: '😀' },
  [Mood.Good]: { emoji: '☺️' },
  [Mood.Okay]: { emoji: '😐' },
  [Mood.Bad]: { emoji: '🙁' },
  [Mood.Awful]: { emoji: '😭' },
};

const MoodHistoryItem: React.FC<MoodHistoryItemProps> = ({ entry, isSelected, onPress, onLongPress, justAddedId }) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressTriggered = useRef(false);

  const handlePressStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (e.type === 'mousedown') {
        e.preventDefault();
    }
    longPressTriggered.current = false;
    timerRef.current = setTimeout(() => {
      onLongPress(entry.id);
      longPressTriggered.current = true;
    }, 500);
  };

  const handlePressEnd = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  const handleClick = () => {
    if (!longPressTriggered.current) {
      onPress(entry.id);
    }
  };

  return (
    <li
      onClick={handleClick}
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      onMouseLeave={handlePressEnd}
      onTouchStart={handlePressStart}
      onTouchEnd={handlePressEnd}
      className={`glass-card p-4 rounded-xl flex items-center gap-4 transition-all duration-200 cursor-pointer select-none ${
        isSelected ? 'bg-[var(--brand-primary-glass)] ring-2 ring-[var(--brand-primary)]' : 'hover:bg-zinc-500/5'
      } ${entry.id === justAddedId ? 'animate-fadeInUp' : ''}`}
      style={{ touchAction: 'pan-y' }}
    >
      {isSelected && (
        <div className="w-5 h-5 rounded-full border-2 bg-[var(--brand-primary)] border-[var(--brand-primary)] flex items-center justify-center flex-shrink-0">
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
      <div className="flex-shrink-0">
        <span className="text-2xl" aria-hidden="true">
          {moodConfig[entry.mood as Mood].emoji}
        </span>
      </div>
      <div className="flex-grow">
        <div className="flex justify-between items-center">
          <p className="font-bold text-[var(--text-primary)]">{entry.mood}</p>
          <p className="text-xs text-[var(--text-secondary)]">
            {new Date(entry.created_at!).toLocaleDateString()}
          </p>
        </div>
        <p className="text-[var(--text-secondary)] mt-1 text-sm">
          {entry.notes || 'No notes'}
        </p>
      </div>
    </li>
  );
};

export default MoodHistoryItem;