import { supabase } from './supabaseClient';
import type { MoodEnum, MoodsRow } from '../types';

/**
 * Logs a new mood entry for a user.
 * @param mood The mood to log.
 * @param notes Any associated notes.
 * @param userId The ID of the user.
 * @param sessionId The optional ID of the chat session that triggered this log.
 * @returns The newly created mood row, or null on error.
 */
export async function logMood(mood: MoodEnum, notes: string, userId: string, sessionId?: string): Promise<MoodsRow | null> {
  const newEntry = {
    mood,
    // Ensure notes are stored as null if the string is empty
    notes: notes.trim() === '' ? null : notes.trim(),
    user_id: userId,
    session_id: sessionId || null
  };

  try {
    const { data, error } = await supabase
      .from('moods')
      .insert([newEntry])
      .select()
      .single();

    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Error logging mood:", message);
    return null;
  }
}

/**
 * Updates an existing mood entry.
 * @param moodId The ID of the mood entry to update.
 * @param mood The new mood value.
 * @param notes The new notes.
 * @returns The updated mood row, or null on error.
 */
export async function updateMood(moodId: string, mood: MoodEnum, notes: string): Promise<MoodsRow | null> {
    const updatedEntry = {
        mood,
        notes: notes.trim() === '' ? null : notes.trim(),
    };

    try {
        const { data, error } = await supabase
            .from('moods')
            .update(updatedEntry)
            .eq('id', moodId)
            .select()
            .single();

        if (error) {
            throw error;
        }

        return data;
    } catch (error) {
        const message = error instanceof Error ? error.message : "An unknown error occurred";
        console.error("Error updating mood:", message);
        return null;
    }
}