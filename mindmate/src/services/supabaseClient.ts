
import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types';

// IMPORTANT: Replace with your actual Supabase Project URL and Anon Key
const supabaseUrl = 'https://yuqdzviklgfzwqqtflga.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1cWR6dmlrbGdmendxcXRmbGdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxNTQ4NDksImV4cCI6MjA2OTczMDg0OX0.SXGEDbp7uImqjIGgJFzENoQSJ0MqXLdbElqO7BDQsDU'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)