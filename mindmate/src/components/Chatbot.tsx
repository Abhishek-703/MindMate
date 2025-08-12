import React, { useState, useEffect, useRef } from 'react';
import type { ChatHistoryRow } from '../types';
import ChatMessageItem from './ChatMessage';
import { getChatStream } from '../services/geminiService';
import { supabase } from '../services/supabaseClient';
import { User } from '@supabase/supabase-js';

interface ChatbotProps {
    initialPrompt: string | null;
    onPromptHandled: () => void;
    onScroll: (event: React.UIEvent<HTMLDivElement>) => void;
    sessionId: string | null;
    onSessionCreated: (newSessionId: string) => void;
}

// A message type specific to the component's state
type DisplayMessage = ChatHistoryRow & {
    isLoading?: boolean; // For the AI's response placeholder
};


const WelcomePrompt: React.FC = () => {
    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        const date = new Date();
        const formattedDate = date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'short',
            day: 'numeric'
        }).toUpperCase();
        setCurrentDate(formattedDate);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-full text-center text-[var(--text-secondary)] animate-fadeInUp">
            {/* Flower Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="w-20 h-20 text-[var(--text-secondary)] opacity-70 mb-8" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M32 42C32 42 28 46 26 40C24 34 28 32 28 32C28 32 24 28 26 22C28 16 32 20 32 20C32 20 36 16 38 22C40 28 36 32 36 32C36 32 40 34 38 40C36 46 32 42 32 42Z" />
                <path d="M32 42C32 42 34 48 30 54" />
            </svg>

            {/* Date */}
            <p className="text-xs font-semibold tracking-widest text-[var(--text-secondary)] mb-4">{currentDate}</p>

            {/* Main Prompt */}
            <h2 className="text-4xl font-serif text-[var(--text-primary)]">What's on your mind?</h2>
        </div>
    );
};


const Chatbot: React.FC<ChatbotProps> = ({ initialPrompt, onPromptHandled, onScroll, sessionId, onSessionCreated }) => {
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
    
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);
  
  useEffect(() => {
    const getUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUser(user);
    };
    getUser();
  }, []);

  useEffect(() => {
    const loadHistory = async () => {
        if (messages.some(m => m.isLoading)) return;

        if (sessionId && messages.length > 0 && messages.every(m => m.session_id === sessionId)) {
            return;
        }

        if (sessionId) {
            setIsLoading(true);
            if (currentUser) {
                const { data, error } = await supabase
                    .from('chat_history')
                    .select('*')
                    .eq('user_id', currentUser.id)
                    .eq('session_id', sessionId)
                    .order('created_at', { ascending: true });
                
                if (error) console.error('Error fetching chat history:', error.message);
                
                const history = data || [];
                setMessages(history);
            }
            setIsLoading(false);
        } else {
            setMessages([]);
        }
    };
    if (currentUser) {
        loadHistory();
    }
  }, [sessionId, currentUser]);


  useEffect(() => {
    if (initialPrompt) {
        setInput(initialPrompt);
        onPromptHandled();
    }
  }, [initialPrompt, onPromptHandled]);
  
  const addMessageToState = (message: Omit<DisplayMessage, 'id' | 'created_at'> & { id?: string }) => {
    const displayMsg: DisplayMessage = {
      ...message,
      id: message.id || self.crypto.randomUUID(),
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, displayMsg]);
    return displayMsg;
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !currentUser) return;
    
    const text = input.trim();
    setInput('');
    setIsLoading(true);

    let activeSessionId = sessionId;

    // Create a new session if one doesn't exist
    if (!activeSessionId) {
        try {
            const { data, error } = await supabase.from('chat_sessions').insert([{ user_id: currentUser.id }]).select().single();
            if (error || !data) throw error || new Error("Session creation failed");
            
            activeSessionId = data.id;
            onSessionCreated(activeSessionId);
        } catch (err) {
             const message = err instanceof Error ? err.message : "An unknown error occurred during session creation.";
             console.error(err);
             setInput(text);
             setIsLoading(false);
             return;
        }
    }

    // Add user message to state and DB
    const userMessage: Omit<ChatHistoryRow, 'id' | 'created_at'> = { sender: 'user', text, user_id: currentUser.id, session_id: activeSessionId };
    const userMessageInState = addMessageToState(userMessage);
    await supabase.from('chat_history').insert([userMessage]);
    
    // Add AI placeholder to state
    const aiPlaceholderId = self.crypto.randomUUID();
    addMessageToState({ id: aiPlaceholderId, sender: 'ai', text: '', isLoading: true, user_id: currentUser.id, session_id: activeSessionId });

    try {
      // The history sent to the API is the component's state, which is the single source of truth
      const historyForApi = [...messages, userMessageInState];
      const stream = await getChatStream(historyForApi, text);
      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let aiResponseText = '';

      // Stream the response
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const chunkText = decoder.decode(value, { stream: true });
        aiResponseText += chunkText;
        setMessages(prev => prev.map(m => m.id === aiPlaceholderId ? { ...m, text: aiResponseText, isLoading: true } : m));
      }
      
      // Finalize the AI message in state and DB
      setMessages(prev => prev.map(m => m.id === aiPlaceholderId ? { ...m, isLoading: false } : m));
      const aiMessage = { sender: 'ai' as const, text: aiResponseText, user_id: currentUser.id, session_id: activeSessionId };
      await supabase.from('chat_history').insert([aiMessage]);

    } catch (error) {
      console.error('API stream error:', error);
      const errorMessage = "I'm sorry, but I encountered an error. Please try again.";
      setMessages(prev => prev.map(m => m.id === aiPlaceholderId ? { ...m, text: errorMessage, isLoading: false } : m));
      const aiErrorMessage = { sender: 'ai' as const, text: errorMessage, user_id: currentUser.id, session_id: activeSessionId };
      await supabase.from('chat_history').insert([aiErrorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent overflow-hidden">
      <div 
        className="flex-grow px-6 pt-20 pb-6 overflow-y-auto no-scrollbar"
        onScroll={onScroll}
      >
         {isLoading && messages.length === 0 ? (
            <div className="flex justify-center items-center h-full"><p>Loading chat...</p></div>
         ) : messages.length === 0 ? (
            <WelcomePrompt />
        ) : (
            <div className="space-y-6">
              {messages.map((msg) => (
                <ChatMessageItem key={msg.id} message={msg} />
              ))}
              <div ref={messagesEndRef} />
            </div>
        )}
      </div>
      <div className="p-6 bg-transparent mt-auto">
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Send a message..."
            className="flex-grow bg-[var(--input-bg)] text-[var(--text-primary)] rounded-full py-4 px-6 focus:ring-2 focus:ring-[var(--brand-primary)] focus:outline-none transition disabled:opacity-50 border border-[var(--card-border)] placeholder-[var(--text-secondary)] backdrop-blur-sm"
            disabled={isLoading || !currentUser}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading || !currentUser}
            className="primary-button rounded-full w-14 h-14 transition-all duration-300 transform hover:scale-110 disabled:opacity-60 disabled:cursor-not-allowed flex-shrink-0 flex items-center justify-center"
            aria-label="Send message"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;