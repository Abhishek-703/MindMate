


import React, { useState, useEffect } from 'react';
import { BackIcon, HistoryIcon } from './icons/NavIcons';
import { User } from '@supabase/supabase-js';
import type { ChatSessionRow } from '../types';
import { supabase } from '../services/supabaseClient';
import ChatHistoryItem from './ChatHistoryItem';

interface ChatHistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSession: (sessionId: string) => void;
  onNewChat: () => void;
  user: User;
}

const ChatHistoryPanel: React.FC<ChatHistoryPanelProps> = ({ isOpen, onClose, onSelectSession, onNewChat, user }) => {
  const [sessions, setSessions] = useState<ChatSessionRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchSessions = async () => {
      if (isOpen && user) {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('chat_sessions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Error fetching chat sessions:", error.message);
        } else if (data) {
          setSessions(data);
        }
        setIsLoading(false);
      }
    };
    if (!isSelectionMode) {
      fetchSessions();
    }
  }, [isOpen, user, isSelectionMode]);

  const handleItemPress = (id: string) => {
    if (isSelectionMode) {
      const newSelectedIds = new Set(selectedIds);
      if (newSelectedIds.has(id)) {
        newSelectedIds.delete(id);
      } else {
        newSelectedIds.add(id);
      }
      setSelectedIds(newSelectedIds);
    } else {
      onSelectSession(id);
    }
  };

  const handleItemLongPress = (id: string) => {
    if (!isSelectionMode) {
      setIsSelectionMode(true);
      setSelectedIds(new Set([id]));
    }
  };

  const handleCancelSelection = () => {
    setIsSelectionMode(false);
    setSelectedIds(new Set());
  };

  const handleNew = () => {
    onNewChat();
    onClose();
  };
  
  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return;

    if (window.confirm(`Are you sure you want to delete ${selectedIds.size} chat session(s)? This will permanently remove all associated messages.`)) {
      setIsDeleting(true);
      const idsToDelete = Array.from(selectedIds);

      // With ON DELETE CASCADE defined in the database schema, we only need to delete the sessions.
      // The database will automatically remove all associated messages in the 'chat_history' table.
      const { data: deletedSessions, error: sessionsError } = await supabase
          .from('chat_sessions')
          .delete()
          .in('id', idsToDelete)
          .select();
          
      if (sessionsError) {
        alert('An error occurred while deleting the chat sessions. Please try again.');
        console.error('Error deleting chat_sessions:', sessionsError.message);
      } else if (deletedSessions && deletedSessions.length > 0) {
        // Deletion was successful, update the UI state.
        setSessions(prev => prev.filter(s => !idsToDelete.includes(s.id)));
      } else {
        // This case means no error occurred, but no rows were deleted.
        // This is a strong indicator that an RLS policy prevented the deletion.
        console.warn('Delete for chat_sessions completed, but no rows were deleted. Check RLS policies.');
        alert('Could not delete the selected sessions. You may not have permission or they may have been deleted already.');
      }
      
      setIsDeleting(false);
      handleCancelSelection();
    }
  };

  return (
    <div
      className={`absolute inset-0 backdrop-blur-2xl text-white flex flex-col transition-transform duration-500 ease-in-out z-40 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="history-title"
    >
      <header className="flex-shrink-0 h-16 flex items-center justify-between px-4 border-b border-[var(--profile-border)]">
        {isSelectionMode ? (
          <button onClick={handleCancelSelection} className="p-2 text-white/80 hover:text-white transition-colors rounded-full font-semibold text-sm">
            Cancel
          </button>
        ) : (
          <div className="w-10 h-10"></div>
        )}
        <h1 id="history-title" className="text-lg font-serif font-bold text-black dark:text-white">
          {isSelectionMode ? `${selectedIds.size} Selected` : 'Chat History'}
        </h1>
        {isSelectionMode ? (
            <div className="w-10 h-10" />
        ) : (
             <button onClick={onClose} className="p-2 text-white/80 hover:text-white transition-colors rounded-full" aria-label="Close history">
                <BackIcon className="rotate-180" />
            </button>
        )}
      </header>
      
      <main className="flex-grow overflow-y-auto p-6 space-y-4">
        {!isSelectionMode && (
             <button 
                onClick={handleNew}
                className="w-full text-left p-4 flex items-center gap-4 bg-[var(--profile-card-bg)] hover:bg-zinc-500/10 transition-colors rounded-xl border border-[var(--profile-border)]"
            >
                <HistoryIcon />
                <span className="font-bold">Start a New Chat</span>
            </button>
        )}

        <div className="bg-[var(--profile-card-bg)] rounded-xl divide-y divide-[var(--profile-border)] border border-[var(--profile-border)]">
            {isLoading ? (
                <div className="p-4 text-center text-white/70">Loading history...</div>
            ) : sessions.length > 0 ? (
                sessions.map(session => (
                    <ChatHistoryItem
                        key={session.id}
                        session={session}
                        isSelected={selectedIds.has(session.id)}
                        onPress={handleItemPress}
                        onLongPress={handleItemLongPress}
                    />
                ))
            ) : (
                <div className="p-4 text-center text-white/70">No chat history found.</div>
            )}
        </div>
      </main>

      {isSelectionMode && (
        <footer className="flex-shrink-0 p-4 border-t border-[var(--card-border)] animate-fadeInUp">
          <button
            onClick={handleDeleteSelected}
            disabled={selectedIds.size === 0 || isDeleting}
            className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-full disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : `Delete (${selectedIds.size})`}
          </button>
        </footer>
      )}
    </div>
  );
};

export default ChatHistoryPanel;