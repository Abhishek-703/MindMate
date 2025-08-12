


import React, { useState, useEffect } from 'react';
import { getPersonalizedTip } from '../../services/geminiService';
import { MoodsRow } from '../../types';
import Spinner from '../icons/Spinner';

interface ForYouCardProps {
    moods: MoodsRow[];
    scale: number;
}

interface CachedTip {
    tip: string;
    date: string;
    moodCount: number;
}

const ForYouIcon = () => (
    <svg width="100" height="100" viewBox="0 0 100 100" className="w-24 h-24 text-[var(--text-secondary)] opacity-70 mx-auto mb-4">
        <path d="M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z" fill="currentColor" opacity="0.3" transform="rotate(20 50 50)" />
        <path d="M50 15 L55 45 L85 50 L55 55 L50 85 L45 55 L15 50 L45 45 Z" fill="currentColor" transform="rotate(-15 50 50)" />
    </svg>
);


const ForYouCard: React.FC<ForYouCardProps> = ({ moods, scale }) => {
    const [tip, setTip] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTip = async () => {
            setIsLoading(true);
            const today = new Date().toISOString().split('T')[0];
            
            try {
                const storedTipJSON = localStorage.getItem('forYouTip');
                if (storedTipJSON) {
                    const storedTip: CachedTip = JSON.parse(storedTipJSON);
                    if (storedTip.date === today && storedTip.moodCount === moods.length) {
                        setTip(storedTip.tip);
                        setIsLoading(false);
                        return;
                    }
                }
                
                const newTip = await getPersonalizedTip(moods);
                if (newTip) {
                    const tipToCache: CachedTip = { tip: newTip, date: today, moodCount: moods.length };
                    localStorage.setItem('forYouTip', JSON.stringify(tipToCache));
                    setTip(newTip);
                }
            } catch (error) {
                console.error("Failed to fetch or set personalized tip", error);
                setTip("Remember to take a moment for yourself today. You deserve it.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchTip();
    }, [moods]);

    return (
        <div className="relative h-[65vh] max-h-[550px] w-full snap-center">
            <div
                className="absolute inset-0 w-full h-full glass-card rounded-3xl bg-white/80 dark:bg-zinc-900/80"
                style={{
                    transform: `scaleY(${scale})`,
                    transition: 'transform 150ms linear',
                    transformOrigin: 'center'
                }}
            />
            <div className="relative z-10 h-full p-6 md:p-8 flex flex-col text-center">
                <div className="flex-shrink-0 mb-4">
                    <div className="pill-tag">
                        INSPIRED BY YOU
                    </div>
                </div>
                <div className="flex-grow flex flex-col items-center justify-center">
                    <ForYouIcon />
                    <h3 className="text-2xl font-serif font-bold text-[var(--text-primary)]">Your Mindful Moment ✨</h3>
                    {isLoading ? (
                        <div className="flex justify-center items-center h-24">
                            <Spinner />
                        </div>
                    ) : (
                        <p className="mt-4 text-lg text-[var(--text-secondary)] italic max-w-sm">
                            "{tip}"
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForYouCard;