
import React, { useState, useCallback, useEffect } from 'react';
import { reframeThought } from '../../services/geminiService';
import Spinner from '../icons/Spinner';

interface ThoughtReframerToolProps {
    scale: number;
    isScrolling: boolean;
}

const ReframerIcon = () => (
    <svg viewBox="0 0 100 100" className="w-24 h-24 text-[var(--text-secondary)] opacity-70 mx-auto mb-4">
        {/* Lightbulb glass */}
        <path d="M 50 15 C 35 15, 25 30, 25 45 C 25 60, 40 70, 50 80 C 60 70, 75 60, 75 45 C 75 30, 65 15, 50 15 Z" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {/* Lightbulb base */}
        <rect x="35" y="80" width="30" height="10" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="40" y1="90" x2="60" y2="90" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
        <line x1="45" y1="95" x2="55" y2="95" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
        {/* Filament */}
        <path d="M 40 65 C 45 55, 55 55, 60 65" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        {/* Rays of light */}
        <line x1="50" y1="10" x2="50" y2="0" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
        <line x1="25" y1="20" x2="20" y2="15" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
        <line x1="75" y1="20" x2="80" y2="15" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
        <line x1="15" y1="45" x2="5" y2="45" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
        <line x1="85" y1="45" x2="95" y2="45" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
    </svg>
);


const ThoughtReframerTool: React.FC<ThoughtReframerToolProps> = ({ scale, isScrolling }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [thought, setThought] = useState('');
    const [perspectives, setPerspectives] = useState<string[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isScrolling) {
            setIsFlipped(false);
        }
    }, [isScrolling]);

    const handleReset = useCallback(() => {
        setThought('');
        setPerspectives(null);
        setError('');
        setIsLoading(false);
        setIsFlipped(false);
    }, []);

    const handleSubmit = async () => {
        if (!thought.trim()) {
            setError('Please enter a thought.');
            return;
        }
        setError('');
        setIsLoading(true);
        setPerspectives(null);
        try {
            const result = await reframeThought(thought);
            if (result) {
                setPerspectives(result);
            } else {
                setError('Could not reframe the thought. Please try again.');
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const backgroundStyle: React.CSSProperties = {
        transform: `scaleY(${scale})`,
        transition: 'transform 150ms linear',
        transformOrigin: 'center'
    };
    
    return (
        <div className={`card-flipper h-[65vh] max-h-[550px] w-full ${isFlipped ? 'is-flipped' : ''}`}>
            <div className="card-inner">
                <div className="card-front">
                    <div className="relative w-full h-full">
                        <div
                            className="absolute inset-0 w-full h-full glass-card rounded-3xl bg-white/80 dark:bg-zinc-900/80"
                            style={backgroundStyle}
                        />
                         <div className="relative z-10 h-full p-6 md:p-8 flex flex-col text-center">
                            <div className="flex-shrink-0 mb-4">
                                <div className="pill-tag">
                                    PRACTICAL TOOL
                                </div>
                            </div>
                            <div className="flex-grow flex flex-col items-center justify-center space-y-4">
                                <ReframerIcon />
                                <h3 className="text-2xl font-serif font-bold text-[var(--text-primary)]">Thought Re-framer</h3>
                                <p className="text-[var(--text-secondary)] text-base max-w-xs">Stuck on a negative thought? Let's explore some gentle, alternative perspectives to help you find a different way of looking at things.</p>
                            </div>
                            <button onClick={() => setIsFlipped(true)} className="mt-4 pill-button w-full py-3 font-bold rounded-full">
                                Let's Start
                            </button>
                        </div>
                    </div>
                </div>
                <div className="card-back">
                    <div className="relative w-full h-full">
                         <div
                            className="absolute inset-0 w-full h-full glass-card rounded-3xl bg-white/80 dark:bg-zinc-900/80"
                            style={backgroundStyle}
                        />
                        <div className="relative z-10 h-full p-6 md:p-8 flex flex-col text-center">
                            <h3 className="text-2xl font-serif font-bold text-[var(--text-primary)] mb-2">Thought Re-framer</h3>
                            <p className="text-[var(--text-secondary)] text-base mb-6">Change your perspective, change your feeling.</p>
                            
                            <div className="flex-grow flex flex-col justify-center">
                                {perspectives ? (
                                    <div className="animate-fadeIn text-left space-y-4">
                                        <h4 className="font-bold text-lg text-[var(--text-primary)]">Alternative perspectives:</h4>
                                        <ul className="space-y-3">
                                            {perspectives.map((p, index) => (
                                                <li key={index} className="p-3 bg-[var(--input-bg)] rounded-lg text-[var(--text-secondary)] italic">
                                                    "{p}"
                                                </li>
                                            ))}
                                        </ul>
                                        <button onClick={handleReset} className="primary-button w-full mt-4 py-3 font-bold rounded-full">
                                            Reframe Another Thought
                                        </button>
                                    </div>
                                ) : isLoading ? (
                                    <div className="flex justify-center items-center h-full">
                                        <Spinner />
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <textarea
                                            value={thought}
                                            onChange={e => setThought(e.target.value)}
                                            placeholder="What's a negative thought on your mind?"
                                            className="w-full bg-[var(--input-bg)] text-[var(--text-primary)] rounded-lg p-3 h-32 focus:ring-2 focus:ring-[var(--brand-primary)] focus:outline-none transition border border-[var(--card-border)] placeholder-[var(--text-secondary)]"
                                            rows={4}
                                        />
                                        {error && <p className="text-red-500 text-sm">{error}</p>}
                                        <button 
                                            onClick={handleSubmit}
                                            disabled={!thought.trim() || isLoading}
                                            className="primary-button w-full py-3 font-bold rounded-full"
                                        >
                                            Find Another Angle
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ThoughtReframerTool;