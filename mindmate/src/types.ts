

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type View = 'home' | 'chat' | 'journey' | 'resources';
export type AuthView = 'welcome' | 'intro-tangle' | 'intro-untangle' | 'signup' | 'login' | 'verify-otp' | 'forgot-password' | 'reset-password';

export type MoodEnum = 'Awful' | 'Bad' | 'Okay' | 'Good' | 'Great';

export enum Mood {
  Awful = 'Awful',
  Bad = 'Bad',
  Okay = 'Okay',
  Good = 'Good',
  Great = 'Great',
}

export interface DailyQuote {
  quote: string;
  author: string;
  date: string; // YYYY-MM-DD
}

export interface MoodInsight {
  title: string;
  insight: string;
}

export interface CachedMoodInsight {
  insight: MoodInsight;
  moodCount: number;
  date: string; // YYYY-MM-DD
}

export interface MoodReflection {
    reflection: string;
    suggestion?: {
        text: string;
        target: 'chat' | 'resources';
        prompt?: string;
    };
}

export interface DailyFocus {
    greeting: string;
    focusTitle: string;
    focusText: string;
    focusAction?: {
        text: string;
        target: 'chat' | 'resources';
        prompt?: string;
    };
    date: string; // YYYY-MM-DD
}

export interface WeeklyInsightReport {
  opening: string;
  keyThemes: {
      theme: string;
      summary: string;
  }[];
  emotionalLandscape: string;
  observations: {
      strength: string;
      pattern: string;
  };
  suggestions: {
      text: string;
      target: 'chat' | 'resources';
      prompt?: string;
  }[];
}


// --- Supabase Main Type ---
export type Database = {
  public: {
    Tables: {
      chat_history: {
        Row: {
          created_at: string
          id: string
          sender: "user" | "ai"
          session_id: string
          text: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          sender: "user" | "ai"
          session_id: string
          text: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          sender?: "user" | "ai"
          session_id?: string
          text?: string
          user_id?: string
        }
      }
      chat_sessions: {
        Row: {
          created_at: string
          id: string
          title: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string | null
          user_id?: string
        }
      }
      moods: {
        Row: {
          created_at: string
          id: string
          mood: "Awful" | "Bad" | "Okay" | "Good" | "Great"
          notes: string | null
          user_id: string
          session_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          mood: "Awful" | "Bad" | "Okay" | "Good" | "Great"
          notes?: string | null
          user_id: string
          session_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          mood?: "Awful" | "Bad" | "Okay" | "Good" | "Great"
          notes?: string | null
          user_id?: string
          session_id?: string | null
        }
      }
      weekly_insights: {
        Row: {
          created_at: string
          id: string
          user_id: string
          start_date: string
          end_date: string
          report_content: Json
          image_prompts: string[] | null
        }
        Insert: {
          created_at?: string
          id?: string
          user_id: string
          start_date: string
          end_date: string
          report_content: Json
          image_prompts?: string[] | null
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string
          start_date?: string
          end_date?: string
          report_content?: Json
          image_prompts?: string[] | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_distinct_chat_days: {
        Args: {
          since_param: string
          user_id_param: string
        }
        Returns: number
      }
    }
    Enums: {
      mood: "Awful" | "Bad" | "Okay" | "Good" | "Great"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}


// --- Helper Types from Database ---
export type ChatHistoryRow = Database['public']['Tables']['chat_history']['Row']

export type ChatSessionRow = Database['public']['Tables']['chat_sessions']['Row']

export type MoodsRow = Database['public']['Tables']['moods']['Row']

export type WeeklyInsightRow = Database['public']['Tables']['weekly_insights']['Row']