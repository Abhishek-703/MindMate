


import { supabase } from './supabaseClient';
import { generateWeeklyInsightReport } from './geminiService';
import type { WeeklyInsightRow, ChatHistoryRow } from '../types';

const INSIGHT_TRIGGER_DAYS = 3;
const INSIGHT_MIN_MESSAGES = 10;
const INSIGHT_WEEK_DAYS = 7;

/**
 * Gets the user's progress towards unlocking the next weekly insight.
 * @param userId The ID of the user.
 * @returns An object with the number of distinct days the user has chatted and the required number.
 */
export async function getInsightProgress(userId: string): Promise<{ distinctDays: number; requiredDays: number; isReady: boolean }> {
  const { data: latestInsight } = await supabase
    .from('weekly_insights')
    .select('created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
    
  const isReady = !!latestInsight; // If any insight exists, one is ready to be viewed.

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - INSIGHT_WEEK_DAYS);
  const oneWeekAgoISO = oneWeekAgo.toISOString();

  const { data, error } = await supabase.rpc('get_distinct_chat_days', {
    user_id_param: userId,
    since_param: oneWeekAgoISO
  });

  if (error) {
    console.error("Error fetching distinct chat days:", error.message);
    return { distinctDays: 0, requiredDays: INSIGHT_TRIGGER_DAYS, isReady };
  }

  return { distinctDays: Number(data) || 0, requiredDays: INSIGHT_TRIGGER_DAYS, isReady };
}

/**
 * Checks if a user is eligible for a new weekly insight and generates one if so.
 * @param userId The ID of the user.
 * @param userName The user's name.
 * @returns The new insight if one was generated, otherwise null.
 */
export async function checkAndGenerateWeeklyInsight(userId: string, userName: string): Promise<WeeklyInsightRow | null> {
    const today = new Date();
    const endDate = new Date(today);
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - INSIGHT_WEEK_DAYS);
    const startDateISO = startDate.toISOString();

    // 1. Check if a report for this week already exists
    const { data: existingInsights, error: checkError } = await supabase
        .from('weekly_insights')
        .select('id')
        .eq('user_id', userId)
        .gte('start_date', startDate.toISOString().split('T')[0])
        .limit(1);

    if (checkError) {
        console.error("Error checking for existing insights:", checkError.message);
        return null;
    }
    if (existingInsights && existingInsights.length > 0) {
        return null; // Report for this period already exists
    }

    // 2. Check trigger conditions efficiently using RPC first.
    const { data: rpcData, error: rpcError } = await supabase.rpc('get_distinct_chat_days', {
        user_id_param: userId,
        since_param: startDateISO
    });

    if (rpcError) {
        console.error("Error checking distinct days for insight:", rpcError.message);
        return null;
    }
    
    const distinctDays = Number(rpcData) || 0;
    if (distinctDays < INSIGHT_TRIGGER_DAYS) {
        return null; // Not enough active days, exit early.
    }

    // 3. Fetch history ONLY if day condition is met
    const { data: history, error: historyError } = await supabase
        .from('chat_history')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', startDateISO)
        .order('created_at', { ascending: true });


    if (historyError || !history) {
        console.error("Error fetching chat history for insight generation:", historyError?.message);
        return null;
    }
    
    const userMessages = history.filter(m => m.sender === 'user');
    if (userMessages.length < INSIGHT_MIN_MESSAGES) {
        return null; // Not enough total messages
    }
    
    // 4. Generate the report
    const reportData = await generateWeeklyInsightReport(history, userName);
    if (!reportData) {
        console.error("Failed to get a report structure from Gemini.");
        return null;
    }

    // 5. Store the new report in the database
    const newInsight = {
        user_id: userId,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        report_content: reportData.report,
        image_prompts: reportData.imagePrompts
    };

    const { data: insertedInsight, error: insertError } = await supabase
        .from('weekly_insights')
        .insert([newInsight])
        .select()
        .single();
    
    if (insertError) {
        console.error("Error saving new weekly insight:", insertError.message);
        return null;
    }

    return insertedInsight;
}