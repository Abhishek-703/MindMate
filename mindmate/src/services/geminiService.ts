import { Mood, type MoodsRow, type MoodInsight, type MoodReflection, type ChatHistoryRow, type MoodEnum, DailyFocus, WeeklyInsightReport } from '../types';

/**
 * A generic fetcher for our backend API proxy.
 * @param operation The name of the operation to be performed by the backend.
 * @param payload The data required for the operation.
 * @returns The JSON response from the backend.
 */
async function fetchFromApi(operation: string, payload: any) {
    try {
        const response = await fetch('/api/gemini', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ operation, payload }),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`API request failed with status ${response.status}: ${errorBody}`);
        }
        
        return await response.json();

    } catch (error) {
        console.error(`Error during API operation '${operation}':`, error);
        throw error;
    }
}

// --- Chat Functions ---

/**
 * Gets a streamed chat response from the backend.
 * @param history The full chat history.
 * @param message The new user message.
 * @returns A ReadableStream of the AI's response text.
 */
export async function getChatStream(history: ChatHistoryRow[], message: string): Promise<ReadableStream<Uint8Array>> {
    const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            operation: 'streamChat',
            payload: { history, message }
        }),
    });

    if (!response.ok || !response.body) {
        const errorBody = await response.text();
        console.error("Stream request failed:", errorBody);
        throw new Error('Failed to get chat stream.');
    }

    return response.body;
}

export async function parseMoodFromConversation(history: ChatHistoryRow[]): Promise<{ mood: MoodEnum; notes: string } | null> {
    try {
        return await fetchFromApi('parseMoodFromConversation', { history });
    } catch (error) {
        console.error("Final catch: Failed to parse mood from conversation.");
        return null;
    }
}

export async function generateChatTitle(history: ChatHistoryRow[]): Promise<string | null> {
    if (history.length < 2) return null;
    try {
        const result = await fetchFromApi('generateChatTitle', { history });
        return result.title;
    } catch (error) {
        console.error("Final catch: Failed to generate chat title.");
        return null;
    }
}


// --- Home Screen & Insights ---

export async function getHomeScreenData(userName: string, moods: MoodsRow[]): Promise<{
    dailyFocus: Omit<DailyFocus, 'date'>;
    dailyQuote: { quote: string; author: string };
    moodInsight: MoodInsight | null;
} | null> {
     const fallback = {
        dailyFocus: {
            greeting: `Good morning, ${userName.split(' ')[0]}!`,
            focusTitle: "A Moment for You",
            focusText: "Ready to check in with yourself? Taking a moment to pause is a great way to start.",
        },
        dailyQuote: {
            quote: "The best way to capture moments is to pay attention. This is how we cultivate mindfulness.",
            author: "Jon Kabat-Zinn"
        },
        moodInsight: null
    };

    try {
        return await fetchFromApi('getHomeScreenData', { userName, moods });
    } catch (error) {
        console.error("Final catch: Failed to fetch home screen data.");
        return fallback;
    }
}

export async function generateWeeklyInsightReport(history: ChatHistoryRow[], userName: string): Promise<{report: WeeklyInsightReport, imagePrompts: string[]} | null> {
    try {
        return await fetchFromApi('generateWeeklyInsightReport', { history, userName });
    } catch (error) {
        console.error("Final catch: Failed to generate weekly insight report.");
        return null;
    }
}

export async function generateArtisticImage(prompt: string): Promise<string | null> {
    try {
        const result = await fetchFromApi('generateArtisticImage', { prompt });
        return result.imageUrl;
    } catch (error) {
        console.error("Final catch: Failed to generate artistic image.");
        return null;
    }
}


// --- Mood & Resource Functions ---

export async function getMoodReflection(mood: MoodEnum, notes: string): Promise<MoodReflection | null> {
    const fallbackResponse: MoodReflection = {
        reflection: "Thank you for sharing how you feel. It's great that you're checking in with yourself."
    };
    try {
        const result = await fetchFromApi('getMoodReflection', { mood, notes });
        return result.reflection ? result : fallbackResponse;
    } catch (error) {
        console.error("Final catch: Failed to fetch mood reflection.");
        return fallbackResponse;
    }
}

export async function getPersonalizedTip(moods: MoodsRow[]): Promise<string | null> {
    if (moods.length === 0) return "Checking in with yourself is a great first step on any day.";
    try {
        const result = await fetchFromApi('getPersonalizedTip', { moods });
        return result.tip;
    } catch (error) {
        console.error("Final catch: Failed to get personalized tip.");
        return "Remember to be kind to yourself today. Every small step forward is progress.";
    }
}

export async function breakDownTask(task: string): Promise<string[] | null> {
    try {
        const result = await fetchFromApi('breakDownTask', { task });
        return result.steps;
    } catch (error) {
        console.error("Final catch: Failed to break down task.");
        return ["Take a deep breath.", "Identify the very first, smallest thing you can do.", "Do that one thing for just 5 minutes."];
    }
}

export async function reframeThought(thought: string): Promise<string[] | null> {
    try {
        const result = await fetchFromApi('reframeThought', { thought });
        return result.perspectives;
    } catch (error) {
        console.error("Final catch: Failed to reframe thought.");
        return ["This feeling is temporary.", "What is one small thing I can control in this situation?", "It's okay to not be okay."];
    }
}