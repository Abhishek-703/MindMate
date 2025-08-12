
import React from 'react';
import { Mood, MoodsRow, View } from '../../types';

const moodEmojis: Record<Mood, string> = {
    [Mood.Great]: '😀',
    [Mood.Good]: '☺️',
    [Mood.Okay]: '😐',
    [Mood.Bad]: '🙁',
    [Mood.Awful]: '😭',
};

interface MoodCardProps {
    latestMood: MoodsRow | undefined;
    isLoading: boolean;
    onNavigate: (view: View) => void;
}

const MoodCard: React.FC<MoodCardProps> = ({ latestMood, isLoading, onNavigate }) => {
    return (
        <div className="glass-card rounded-2xl p-4 flex flex-col justify-between h-full min-h-[160px]">
            <div>
                <h2 className="font-serif font-bold text-base mb-2">How are you?</h2>
                {isLoading ? (
                    <p className="text-[var(--text-secondary)] text-xs">Loading...</p>
                ) : latestMood ? (
                    <div className="flex items-center gap-2">
                        <span className="text-3xl select-none" aria-hidden="true">{moodEmojis[latestMood.mood as Mood]}</span>
                        <div>
                            <p className="font-semibold">{latestMood.mood}</p>
                            <p className="text-xs text-[var(--text-secondary)]">
                                {new Date(latestMood.created_at!).toLocaleDateString('en-us', { month: 'short', day: 'numeric'})}
                            </p>
                        </div>
                    </div>
                ) : (
                    <p className="text-[var(--text-secondary)] text-xs">No moods logged yet.</p>
                )}
            </div>
            <button
                onClick={() => onNavigate('journey')}
                className="mt-3 w-full text-center pill-button rounded-full py-2 text-xs font-semibold"
            >
                {latestMood ? "Log Again" : "Log Mood"}
            </button>
        </div>
    );
};

export default MoodCard;