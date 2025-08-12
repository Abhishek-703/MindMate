import React from 'react';
import type { ChatHistoryRow } from '../types';
import Spinner from './icons/Spinner';

interface ChatMessageItemProps {
  message: ChatHistoryRow & {
      isLoading?: boolean;
  };
}

const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  
  // Use a simple regex to find **bold** text and replace it with <strong> tags
  const formatText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        return part;
    });
  };

  const textWithLineBreaks = message.text.split('\n').map((str, index, array) => 
    index === array.length - 1 ? (
      <React.Fragment key={index}>{formatText(str)}</React.Fragment>
    ) : (
      <React.Fragment key={index}>{formatText(str)}<br /></React.Fragment>
    )
  );

  return (
    <div className={`flex flex-col items-end gap-3 ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`flex items-end gap-3 w-full ${isUser ? 'justify-end animate-chatSlideInRight' : 'justify-start animate-chatSlideInLeft'}`}>
            {!isUser && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full glass-card flex items-center justify-center text-[var(--text-primary)]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2a5 5 0 0 0-5 5c0 1.84.96 3.52 2.45 4.38A7.98 7.98 0 0 0 4 20a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1 7.98 7.98 0 0 0-5.45-8.62A5 5 0 0 0 17 7a5 5 0 0 0-5-5z" />
                    </svg>
                </div>
            )}
            <div
                className={`max-w-[85%] px-4 py-3 rounded-2xl transition-colors duration-300 ${
                isUser
                    ? 'glass-card bg-[var(--brand-primary-glass)] text-[var(--text-primary)] rounded-br-none'
                    : 'glass-card text-[var(--text-primary)] rounded-bl-none'
                }`}
            >
                {message.isLoading ? <Spinner /> : <p className="text-sm leading-relaxed break-word">{textWithLineBreaks}</p>}
            </div>
        </div>
    </div>
  );
};

export default ChatMessageItem;