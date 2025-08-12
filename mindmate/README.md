# MindMate: Mental Wellness Companion

MindMate is a responsive web application designed as a mental wellness companion. It features an AI-powered chatbot (MindMate) for support and guidance, along with a comprehensive mood tracking system.

## Features

- **AI Chatbot:** A supportive chatbot powered by Google's Gemini API to offer advice, listen, and guide users through mental wellness exercises.
- **Weekly Insight Reports:** After consistent interaction, users receive a personalized weekly report that analyzes chat themes, mood patterns, and offers tailored suggestions, complete with AI-generated artistic imagery.
- **Automatic Mood Logging:** The chatbot intelligently analyzes conversations to automatically log the user's mood, providing a seamless tracking experience.
- **Manual Mood Tracking:** Users can manually log their mood, add notes, and view their emotional history over time on their "Journey" screen.
- **Data Visualization:** A beautiful chart visualizes the user's mood history, helping them identify patterns and trends.
- **AI-Powered Insights:** The app analyzes mood history to provide gentle, encouraging insights into the user's well-being.
- **Curated Resources:** A dedicated section offers tips and interactive prompts for mindfulness, stress management, and cognitive reframing.
- **Secure Authentication:** Full user authentication system including sign-up, login, password reset, profile picture uploads, and Google social login.

---

## Supabase Backend Setup

For the application to function, it **requires** a Supabase project to be set up correctly. Follow these steps carefully.

### 1. Create a Supabase Project

- Go to [supabase.com](https://supabase.com) and create a new project.
- Once the project is created, navigate to the **SQL Editor**.

### 2. Run the Schema SQL

- In the SQL Editor, run each of the following scripts one by one to set up your database and storage.

#### Script 1: Create Tables and Functions

This script creates the tables (`chat_sessions`, `chat_history`, `moods`, `weekly_insights`) and a required database function.

```sql
-- Create the chat_sessions table to store conversation metadata
CREATE TABLE public.chat_sessions (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  user_id uuid NOT NULL,
  title text,
  CONSTRAINT chat_sessions_pkey PRIMARY KEY (id),
  CONSTRAINT chat_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE
);
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;

-- Create the chat_history table to store individual messages
CREATE TABLE public.chat_history (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  session_id uuid NOT NULL,
  user_id uuid NOT NULL,
  sender text NOT NULL,
  text text NOT NULL,
  CONSTRAINT chat_history_pkey PRIMARY KEY (id),
  CONSTRAINT chat_history_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.chat_sessions (id) ON DELETE CASCADE,
  CONSTRAINT chat_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE
);
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;

-- Create the moods table to store user mood entries
CREATE TABLE public.moods (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  user_id uuid NOT NULL,
  mood text NOT NULL,
  notes text,
  session_id uuid,
  CONSTRAINT moods_pkey PRIMARY KEY (id),
  CONSTRAINT moods_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.chat_sessions (id) ON DELETE SET NULL,
  CONSTRAINT moods_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE
);
ALTER TABLE public.moods ENABLE ROW LEVEL SECURITY;

-- Create the weekly_insights table to store generated reports
CREATE TABLE public.weekly_insights (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  user_id uuid NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  report_content jsonb NOT NULL,
  image_prompts jsonb,
  CONSTRAINT weekly_insights_pkey PRIMARY KEY (id),
  CONSTRAINT weekly_insights_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);
ALTER TABLE public.weekly_insights ENABLE ROW LEVEL SECURITY;

-- Create the database function to efficiently count distinct chat days
CREATE OR REPLACE FUNCTION public.get_distinct_chat_days(since_param timestamptz, user_id_param uuid)
RETURNS integer AS $$
BEGIN
  RETURN (
    SELECT COUNT(DISTINCT(created_at::date))
    FROM public.chat_history
    WHERE user_id = user_id_param AND sender = 'user' AND created_at >= since_param
  );
END;
$$ LANGUAGE plpgsql;
```

#### Script 2: Create Storage Bucket

This script creates the `avatars` bucket needed for profile pictures.

```sql
-- Create a bucket "avatars" with public access
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);
```

#### Script 3: Set Up Row Level Security (RLS) Policies

RLS is **mandatory** for security. It ensures users can only access their own data.

```sql
-- RLS Policies for chat_sessions
CREATE POLICY "Enable ALL access for own sessions"
ON public.chat_sessions FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for chat_history
CREATE POLICY "Enable ALL access for own chat history"
ON public.chat_history FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for moods
CREATE POLICY "Enable ALL access for own mood entries"
ON public.moods FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for weekly_insights
CREATE POLICY "Enable ALL access for own weekly insights"
ON public.weekly_insights FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for storage.objects (avatars)
CREATE POLICY "Enable public read access for all files in avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Enable insert for own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars' AND auth.uid() = (storage.foldername(name))[1]::uuid);

CREATE POLICY "Enable update for own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (auth.uid() = (storage.foldername(name))[1]::uuid);

CREATE POLICY "Enable delete for own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (auth.uid() = (storage.foldername(name))[1]::uuid);
```

### 3. Get API Credentials

1.  Navigate to **Project Settings** (the gear icon).
2.  Go to the **API** section.
3.  You will find your **Project URL** and your `anon` **public** key.
4.  Copy these two values into the `services/supabaseClient.ts` file in the application code.

```typescript
// services/supabaseClient.ts

import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types';

// Replace with your actual Supabase Project URL and Anon Key
const supabaseUrl = 'YOUR_SUPABASE_PROJECT_URL'
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
```

Your backend is now fully configured for the MindMate application.