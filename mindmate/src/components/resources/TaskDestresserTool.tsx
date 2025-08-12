
import React, { useState, useCallback, useEffect } from 'react';
import { breakDownTask } from '../../services/geminiService';
import Spinner from '../icons/Spinner';

interface TaskDestresserToolProps {
    scale: number;
    isScrolling: boolean;
}

const DestresserIcon = () => (
    <svg viewBox="0 0 100 100" className="w-24 h-24 text-[var(--text-secondary)] opacity-70 mx-auto mb-4">
        {/* Large block */}
        <rect x="10" y="30" width="40" height="40" rx="5" stroke="currentColor" strokeWidth="4" fill="none" />
        {/* Arrow */}
        <path d="M 55 50 L 70 50" stroke="currentColor" strokeWidth="4" fill="none" />
        <path d="M 65 45 L 70 50 L 65 55" stroke="currentColor" strokeWidth="4" fill="none" />
        {/* Small blocks */}
        <rect x="75" y="30" width="15" height="15" rx="2" fill="currentColor" />
        <rect x="75" y="55" width="15" height="15" rx="2" fill="currentColor" />
    </svg>
);

const TaskDestresserTool: React.FC<TaskDestresserToolProps> = ({ scale, isScrolling }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [task, setTask] = useState('');
    const [steps, setSteps] = useState<string[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isScrolling) {
            setIsFlipped(false);
        }
    }, [isScrolling]);

    const handleReset = useCallback(() => {
        setTask('');
        setSteps(null);
        setError('');
        setIsLoading(false);
        setIsFlipped(false);
    }, []);

    const handleSubmit = async () => {
        if (!task.trim()) {
            setError('Please enter a task.');
            return;
        }
        setError('');
        setIsLoading(true);
        setSteps(null);
        try {
            const result = await breakDownTask(task);
            if (result) {
                setSteps(result);
            } else {
                setError('Could not break down the task. Please try a different wording.');
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
                                <DestresserIcon />
                                <h3 className="text-2xl font-serif font-bold text-[var(--text-primary)]">Task De-stresser</h3>
                                <p className="text-[var(--text-secondary)] text-base max-w-xs">Feeling overwhelmed by a big task? Let's break it down into small, manageable steps to make it feel less intimidating.</p>
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
                            <h3 className="text-2xl font-serif font-bold text-[var(--text-primary)] mb-2">Task De-stresser</h3>
                            <p className="text-[var(--text-secondary)] text-base mb-6">Feeling overwhelmed? Let's break it down.</p>
                            
                            <div className="flex-grow flex flex-col justify-center">
                                {steps ? (
                                    <div className="animate-fadeIn text-left space-y-4">
                                        <h4 className="font-bold text-lg text-[var(--text-primary)]">Here's a plan:</h4>
                                        <ul className="space-y-3">
                                            {steps.map((step, index) => (
                                                <li key={index} className="flex items-start gap-3">
                                                    <div className="mt-1 w-5 h-5 rounded-full border-2 border-[var(--brand-primary)] flex-shrink-0" />
                                                    <span className="text-[var(--text-secondary)]">{step}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <button onClick={handleReset} className="primary-button w-full mt-4 py-3 font-bold rounded-full">
                                            De-stress Another Task
                                        </button>
                                    </div>
                                ) : isLoading ? (
                                    <div className="flex justify-center items-center h-full">
                                        <Spinner />
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <textarea
                                            value={task}
                                            onChange={e => setTask(e.target.value)}
                                            placeholder="What's a task that feels too big right now?"
                                            className="w-full bg-[var(--input-bg)] text-[var(--text-primary)] rounded-lg p-3 h-32 focus:ring-2 focus:ring-[var(--brand-primary)] focus:outline-none transition border border-[var(--card-border)] placeholder-[var(--text-secondary)]"
                                            rows={4}
                                        />
                                        {error && <p className="text-red-500 text-sm">{error}</p>}
                                        <button 
                                            onClick={handleSubmit}
                                            disabled={!task.trim() || isLoading}
                                            className="primary-button w-full py-3 font-bold rounded-full"
                                        >
                                            Break It Down
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

export default TaskDestresserTool;