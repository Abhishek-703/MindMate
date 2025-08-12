
import React, { useState, useEffect } from 'react';
import { Mood, MoodsRow, View, MoodReflection, MoodEnum, WeeklyInsightRow, WeeklyInsightReport } from '../types';
import MoodChart from './journey/MoodChart';
import { getMoodReflection } from '../services/geminiService';
import Spinner from './icons/Spinner';
import MoodHistoryScreen from './journey/MoodHistoryScreen';
import WeeklyInsightCard from './journey/WeeklyInsightCard';
import WeeklyInsightReportScreen from './journey/WeeklyInsightReportScreen';

const moodConfig: Record<Mood, { emoji: string; hoverClass: string }> = {
  [Mood.Great]: { emoji: '😀', hoverClass: 'hover:rotate-12' },
  [Mood.Good]: { emoji: '☺️', hoverClass: 'hover:rotate-12' },
  [Mood.Okay]: { emoji: '😐', hoverClass: '' },
  [Mood.Bad]: { emoji: '🙁', hoverClass: 'hover:-rotate-12' },
  [Mood.Awful]: { emoji: '😭', hoverClass: 'hover:-rotate-12' },
};

interface JourneyScreenProps {
    moods: MoodsRow[];
    isLoadingMoods: boolean;
    onLogMood: (mood: MoodEnum, notes: string) => Promise<MoodsRow | null>;
    onDeleteMoods: (ids: string[]) => Promise<boolean>;
    onNavigate: (view: View) => void;
    onNavigateToChat: (prompt?: string) => void;
    weeklyInsights: WeeklyInsightRow[];
    isLoadingInsights: boolean;
}

const JourneyScreen: React.FC<JourneyScreenProps> = ({ moods, isLoadingMoods, onLogMood, onDeleteMoods, onNavigate, onNavigateToChat, weeklyInsights, isLoadingInsights }) => {
  const [selectedMood, setSelectedMood] = useState<MoodEnum | null>(null);
  const [notes, setNotes] = useState('');
  const [justAddedId, setJustAddedId] = useState<string | null>(null);
  const [reflection, setReflection] = useState<MoodReflection | null>(null);
  const [isLogging, setIsLogging] = useState(false);
  const [isGeneratingReflection, setIsGeneratingReflection] = useState(false);
  const [showHistoryScreen, setShowHistoryScreen] = useState(false);
  const [viewingReport, setViewingReport] = useState<WeeklyInsightRow | null>(null);


  const handleLogMood = async () => {
    if (selectedMood && !isLogging) {
      setIsLogging(true);
      const newMood = await onLogMood(selectedMood, notes);
      
      if (newMood) {
        setJustAddedId(newMood.id);
      }

      setIsGeneratingReflection(true);
      const newReflection = await getMoodReflection(selectedMood, notes);
      setReflection(newReflection);
      setIsGeneratingReflection(false);
      setIsLogging(false);
    }
  };
  
  const handleResetLogger = () => {
    setSelectedMood(null);
    setNotes('');
    setReflection(null);
    setIsGeneratingReflection(false);
  };

  const moodOptions = Object.values(Mood);
  
  if (viewingReport) {
    return (
        <WeeklyInsightReportScreen
            report={viewingReport}
            onBack={() => setViewingReport(null)}
            onNavigate={onNavigate}
            onNavigateToChat={onNavigateToChat}
        />
    )
  }

  if (showHistoryScreen) {
    return (
        <MoodHistoryScreen 
            moods={moods}
            onDeleteMoods={onDeleteMoods}
            isLoading={isLoadingMoods}
            justAddedId={justAddedId}
            onBack={() => setShowHistoryScreen(false)}
        />
    )
  }

  return (
    <div className="flex flex-col gap-6 px-6 pt-20 pb-6 animate-fadeIn">
      <div className="glass-card rounded-2xl p-6 min-h-[340px] flex flex-col justify-center transition-all duration-300">
        {reflection || isGeneratingReflection ? (
          <div className="text-center animate-fadeIn flex flex-col justify-between h-full">
            <div>
              <h3 className="font-serif font-bold text-lg mb-4">MindMate's Reflection ✨</h3>
              {isGeneratingReflection ? (
                  <div className="flex justify-center items-center h-28"><Spinner /></div>
              ) : (
                  <div className="h-28 flex items-center justify-center">
                    <p className="text-[var(--text-secondary)] italic">"{reflection?.reflection}"</p>
                  </div>
              )}
            </div>
            <div className="flex flex-col gap-2 mt-4">
              {reflection?.suggestion && (
                <button
                  onClick={() => {
                    if (reflection.suggestion?.target === 'chat') {
                        onNavigateToChat(reflection.suggestion.prompt);
                    } else if (reflection.suggestion?.target === 'resources') {
                        onNavigate('resources');
                    }
                  }}
                  className="w-full primary-button font-bold py-3 px-4 rounded-full"
                >
                  {reflection.suggestion.text}
                </button>
              )}
              <button onClick={handleResetLogger} className="w-full pill-button font-bold py-3 px-4 rounded-full">
                  Log Another Mood
              </button>
            </div>
          </div>
        ) : (
          <div className="animate-fadeIn">
            <div className="flex justify-around items-center gap-2 mb-6 py-4">
              {moodOptions.map(mood => (
                <button
                  key={mood}
                  onClick={() => setSelectedMood(mood)}
                  className={`flex flex-col items-center gap-2 transition-all duration-300 transform focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--brand-primary)] rounded-lg p-1 ${
                    selectedMood === mood
                      ? 'animate-bob scale-110 text-[var(--text-primary)]'
                      : `scale-90 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:scale-100 ${moodConfig[mood].hoverClass}`
                  }`}
                  aria-label={`Select mood: ${mood}`}
                  aria-pressed={selectedMood === mood}
                >
                  <span className="text-4xl select-none" aria-hidden="true">{moodConfig[mood].emoji}</span>
                  <span className="text-xs font-semibold">{mood}</span>
                </button>
              ))}
            </div>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Add a note... (optional)"
              className="w-full bg-[var(--input-bg)] text-[var(--text-primary)] rounded-lg p-3 mb-4 focus:ring-2 focus:ring-[var(--brand-primary)] focus:outline-none transition border border-[var(--card-border)] placeholder-[var(--text-secondary)]"
              rows={3}
            />
            <button
              onClick={handleLogMood}
              disabled={!selectedMood || isLogging || isGeneratingReflection}
              className="w-full primary-button font-bold py-3 px-4 rounded-full"
            >
              {isLogging ? 'Logging...' : 'Log Mood'}
            </button>
          </div>
        )}
      </div>

      <div className="glass-card rounded-2xl p-6 flex flex-col">
        <h3 className="text-xl font-serif font-bold text-[var(--text-primary)] mb-4">Your Weekly Insights ✨</h3>
         {isLoadingInsights ? (
            <div className="flex items-center justify-center text-[var(--text-secondary)] py-10">
                <p>Looking for insights...</p>
            </div>
        ) : weeklyInsights.length > 0 ? (
            <div className="space-y-3">
                {weeklyInsights.map(insight => (
                    <WeeklyInsightCard key={insight.id} insight={insight} onView={() => setViewingReport(insight)} />
                ))}
            </div>
        ) : (
            <div className="text-center text-[var(--text-secondary)] py-10">
                <p className="text-sm">Your first weekly insight is being prepared!</p>
                <p className="text-xs mt-1">Keep chatting with MindMate to unlock it.</p>
            </div>
        )}
      </div>

      <div className="glass-card rounded-2xl p-6 flex flex-col">
        <h3 className="text-xl font-serif font-bold text-[var(--text-primary)] mb-4">Your Mood History</h3>
        {isLoadingMoods ? (
          <div className="flex items-center justify-center text-[var(--text-secondary)] py-16">
            <p>Loading history...</p>
          </div>
        ) : moods.length > 0 ? (
          <>
            <div className="h-64 mb-6">
                <MoodChart data={moods} />
            </div>
            <button
              onClick={() => setShowHistoryScreen(true)}
              className="w-full text-center pill-button rounded-full py-3 text-sm font-semibold"
            >
              View Full History
            </button>
          </>
        ) : (
          <div className="flex items-center justify-center text-[var(--text-secondary)] py-16">
            <p>Your mood history will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JourneyScreen;