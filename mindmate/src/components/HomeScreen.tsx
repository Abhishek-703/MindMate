
import React, { useState, useEffect } from 'react';
import { View, MoodsRow, MoodInsight, DailyFocus } from '../types';
import { User } from '@supabase/supabase-js';
import { getHomeScreenData } from '../services/geminiService';
import FocusCard from './home/FocusCard';
import MoodCard from './home/MoodCard';
import QuoteCard from './home/QuoteCard';
import InsightCard from './home/InsightCard';
import ResourcesCard from './home/ResourcesCard';
import ConversationStartersCard from './home/ConversationStartersCard';

interface HomeScreenProps {
    moods: MoodsRow[];
    isLoadingMoods: boolean;
    onNavigate: (view: View) => void;
    onNavigateToChat: (prompt?: string) => void;
    user: User;
}

interface HomeScreenData {
    dailyFocus: Omit<DailyFocus, 'date'>;
    dailyQuote: { quote: string; author: string };
    moodInsight: MoodInsight | null;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ moods, isLoadingMoods, onNavigate, onNavigateToChat, user }) => {
    const [homeData, setHomeData] = useState<HomeScreenData | null>(null);
    const [isLoadingData, setIsLoadingData] = useState(true);

    useEffect(() => {
        const fetchHomeData = async () => {
            if (isLoadingMoods) return;
            
            setIsLoadingData(true);
            const today = new Date().toISOString().split('T')[0];
            const userName = user.user_metadata.full_name || 'friend';

            try {
                const storedDataJSON = localStorage.getItem('homeScreenData');
                if (storedDataJSON) {
                    const cachedData = JSON.parse(storedDataJSON);
                    // Only check the date for caching. This ensures the data is fetched only once per day.
                    if (cachedData.date === today) {
                        setHomeData(cachedData.data);
                        setIsLoadingData(false);
                        return;
                    }
                }

                // Fetch new data if cache is old or doesn't exist
                const newData = await getHomeScreenData(userName, moods);
                if (newData) {
                    setHomeData(newData);
                    // Cache the new data along with the current date.
                    localStorage.setItem('homeScreenData', JSON.stringify({ data: newData, date: today }));
                }
            } catch (error) {
                console.error("Failed to fetch or set home screen data", error);
            } finally {
                setIsLoadingData(false);
            }
        };

        fetchHomeData();
    }, [moods, isLoadingMoods, user.user_metadata.full_name]);
    
    const timeOfDay = new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening';
    const name = user.user_metadata.full_name?.split(' ')[0] || 'friend';

    return (
        <div className="flex flex-col gap-4 text-[var(--text-primary)] px-4 pt-20 pb-6">
            <header className="px-2">
                <h1 className="text-3xl font-serif font-bold">
                    {`Good ${timeOfDay}, ${name}!`}
                </h1>
            </header>

            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                    <QuoteCard
                        quote={homeData?.dailyQuote ?? null}
                        isLoading={isLoadingData}
                    />
                </div>

                <div className="col-span-2">
                    <FocusCard 
                        focus={homeData?.dailyFocus ?? null} 
                        isLoading={isLoadingData}
                        onNavigate={onNavigate}
                        onNavigateToChat={onNavigateToChat}
                    />
                </div>

                <div className="col-span-2">
                    <ConversationStartersCard onNavigateToChat={onNavigateToChat} />
                </div>

                <div className="col-span-1">
                    <MoodCard
                        latestMood={moods[0]}
                        isLoading={isLoadingMoods}
                        onNavigate={onNavigate}
                    />
                </div>

                <div className="col-span-1">
                    <ResourcesCard onNavigate={onNavigate} />
                </div>

                { homeData?.moodInsight && (
                    <div className="col-span-2">
                        <InsightCard
                            insight={homeData.moodInsight}
                            isLoading={isLoadingData}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomeScreen;