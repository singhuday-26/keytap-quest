
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/supabase';

// Get env variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a single instance of the supabase client with proper typing
export const supabase = createClient<Database>(
  supabaseUrl, 
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    // Reduce realtime subscription rate to prevent unnecessary network requests
    realtime: {
      params: {
        eventsPerSecond: 1,
      },
    },
    global: {
      // Don't fetch headers on each request, reduce request size
      headers: { 'X-Client-Info': 'keytap-quest' },
    },
  }
);
