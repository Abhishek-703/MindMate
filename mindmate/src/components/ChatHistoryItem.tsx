

import React, { useRef } from 'react';
import { ChatSessionRow } from '../types';

interface ChatHistoryItemProps {
  session: ChatSessionRow;
  isSelected: boolean;
  onPress: (id: string) => void;
  onLongPress: (id: string) => void;
}

const ChatHistoryItem: React.FC<ChatHistoryItemProps> = ({ session, isSelected, onPress, onLongPress }) => {
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const longPressTriggered = useRef(false);
  
    const handlePressStart = (e: React.MouseEvent | React.TouchEvent) => {
      if (e.type === 'mousedown') {
          e.preventDefault();
      }
      longPressTriggered.current = false;
      timerRef.current = setTimeout(() => {
        onLongPress(session.id);
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
        onPress(session.id);
      }
    };

    const titleText = session.title || `Chat from ${new Date(session.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`;

    return (
        <div
            onClick={handleClick}
            onMouseDown={handlePressStart}
            onMouseUp={handlePressEnd}
            onMouseLeave={handlePressEnd}
            onTouchStart={handlePressStart}
            onTouchEnd={handlePressEnd}
            className={`w-full text-left p-4 flex items-center gap-4 transition-all duration-200 cursor-pointer select-none rounded-lg ${
                isSelected ? 'bg-[var(--brand-primary-glass)]' : 'hover:bg-zinc-500/5'
            }`}
             style={{ touchAction: 'pan-y' }}
        >
            {isSelected && (
                <div className="w-5 h-5 rounded-full border-2 bg-[var(--brand-primary)] border-[var(--brand-primary)] flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
            )}
            <div className="flex flex-col flex-grow overflow-hidden">
                <span className="font-medium truncate" title={titleText}>
                    {titleText}
                </span>
                <span className="text-xs text-white/60">
                    {new Date(session.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>
            <span className="text-white/50 text-lg leading-none">&rsaquo;</span>
        </div>
    );
};

export default ChatHistoryItem;