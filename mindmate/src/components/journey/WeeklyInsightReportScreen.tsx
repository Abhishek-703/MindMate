

import React, { useState, useEffect } from 'react';
import { WeeklyInsightRow, View, WeeklyInsightReport } from '../../types';
import { generateArtisticImage } from '../../services/geminiService';
import { BackIcon } from '../icons/NavIcons';
import Spinner from '../icons/Spinner';

interface WeeklyInsightReportScreenProps {
  report: WeeklyInsightRow;
  onBack: () => void;
  onNavigate: (view: View) => void;
  onNavigateToChat: (prompt?: string) => void;
}

const ArtisticImage: React.FC<{ prompt: string }> = ({ prompt }) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        generateArtisticImage(prompt).then(url => {
            setImageUrl(url);
            setIsLoading(false);
        });
    }, [prompt]);

    if (isLoading) {
        return (
            <div className="w-full aspect-[3/4] glass-card rounded-2xl flex items-center justify-center">
                <Spinner />
            </div>
        );
    }
    
    if (!imageUrl) return null;

    return (
        <div className="w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-lg border border-[var(--card-border)]">
             <img src={imageUrl} alt="Artistic representation of the report theme" className="w-full h-full object-cover animate-fadeIn" />
        </div>
    );
};

const WeeklyInsightReportScreen: React.FC<WeeklyInsightReportScreenProps> = ({ report, onBack, onNavigate, onNavigateToChat }) => {
    const report_content = report.report_content as unknown as WeeklyInsightReport;
    const image_prompts = report.image_prompts;

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    };

    const startDate = new Date(report.start_date);
    startDate.setDate(startDate.getDate() + 1);

    return (
        <div className="flex flex-col h-full animate-slideInFromRight">
            <header className="flex-shrink-0 h-16 flex items-center justify-between px-4 pt-20">
                <button
                    onClick={onBack}
                    className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors rounded-full"
                    aria-label="Go back to journey screen"
                >
                    <BackIcon />
                </button>
                <h1 className="text-lg font-serif font-bold truncate px-2">Your Weekly Insight</h1>
                <div className="w-10 h-10" />
            </header>
            
            <main className="flex-grow overflow-y-auto no-scrollbar p-6 space-y-8">
                <div className="text-center">
                    <p className="text-sm font-semibold text-[var(--text-secondary)] tracking-wider">
                        {`${formatDate(report.start_date)} - ${formatDate(report.end_date)}`}
                    </p>
                    <h2 className="text-3xl font-serif font-bold text-[var(--text-primary)] mt-2">A Look at Your Week</h2>
                </div>

                <p className="text-lg text-[var(--text-secondary)] italic leading-relaxed text-center">
                    {report_content.opening}
                </p>

                {image_prompts?.[0] && <ArtisticImage prompt={image_prompts[0]} />}

                <div>
                    <h3 className="text-2xl font-serif font-bold text-[var(--text-primary)] mb-4">Key Themes</h3>
                    <div className="space-y-4">
                        {report_content.keyThemes.map((item, index) => (
                            <div key={index} className="glass-card p-4 rounded-xl">
                                <h4 className="font-bold text-[var(--text-primary)]">{item.theme}</h4>
                                <p className="text-sm text-[var(--text-secondary)] mt-1">{item.summary}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                     <h3 className="text-2xl font-serif font-bold text-[var(--text-primary)] mb-4">Emotional Landscape</h3>
                     <p className="text-[var(--text-secondary)] leading-relaxed">{report_content.emotionalLandscape}</p>
                </div>
                
                {image_prompts?.[1] && <ArtisticImage prompt={image_prompts[1]} />}

                <div>
                     <h3 className="text-2xl font-serif font-bold text-[var(--text-primary)] mb-4">MindMate's Observations</h3>
                     <div className="space-y-4">
                        <div className="glass-card p-4 rounded-xl">
                            <h4 className="font-bold text-green-600 dark:text-green-400">Your Strength 💪</h4>
                            <p className="text-sm text-[var(--text-secondary)] mt-1">{report_content.observations.strength}</p>
                        </div>
                        <div className="glass-card p-4 rounded-xl">
                            <h4 className="font-bold text-purple-600 dark:text-purple-400">A Pattern I Noticed 🧠</h4>
                            <p className="text-sm text-[var(--text-secondary)] mt-1">{report_content.observations.pattern}</p>
                        </div>
                     </div>
                </div>

                <div>
                     <h3 className="text-2xl font-serif font-bold text-[var(--text-primary)] mb-4">For the Week Ahead</h3>
                     <div className="space-y-3">
                        {report_content.suggestions.map((s, index) => (
                             <button
                                key={index}
                                onClick={() => {
                                    if (s.target === 'chat') {
                                        onNavigateToChat(s.prompt);
                                    } else {
                                        onNavigate(s.target);
                                    }
                                }}
                                className="w-full text-left pill-button p-4 rounded-xl flex justify-between items-center"
                            >
                                <span>{s.text}</span>
                                <span>&rarr;</span>
                            </button>
                        ))}
                     </div>
                </div>

                <div className="h-8" />
            </main>
        </div>
    );
};

export default WeeklyInsightReportScreen;