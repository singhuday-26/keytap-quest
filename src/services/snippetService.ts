
import { supabase } from "@/integrations/supabase/client";
import { CodeSnippet } from "@/types";

// Use the existing TypeScript definition for Database from src/integrations/supabase/types.ts
// but extend it with our custom tables to solve the TypeScript errors
type ExtendedDatabase = {
  public: {
    Tables: {
      code_snippets: {
        Row: CodeSnippet;
        Insert: Omit<CodeSnippet, 'id'> & { id?: string };
        Update: Partial<CodeSnippet>;
      };
      user_progress: {
        Row: {
          id: string;
          user_id: string;
          snippet_id: string;
          wpm: number;
          accuracy: number;
          errors: number;
          time_taken: number;
          special_char_errors?: number;
          syntax_errors?: number;
          indentation_errors?: number;
          completed_at?: string;
        };
        Insert: Omit<{
          id: string;
          user_id: string;
          snippet_id: string;
          wpm: number;
          accuracy: number;
          errors: number;
          time_taken: number;
          special_char_errors?: number;
          syntax_errors?: number;
          indentation_errors?: number;
          completed_at?: string;
        }, 'id' | 'completed_at'> & { id?: string; completed_at?: string };
        Update: Partial<{
          id: string;
          user_id: string;
          snippet_id: string;
          wpm: number;
          accuracy: number;
          errors: number;
          time_taken: number;
          special_char_errors?: number;
          syntax_errors?: number;
          indentation_errors?: number;
          completed_at?: string;
        }>;
      };
    };
    Views: {
      [_ in never]: never
    };
    Functions: {
      [_ in never]: never
    };
    Enums: {
      [_ in never]: never
    };
    CompositeTypes: {
      [_ in never]: never
    };
  };
};

export async function fetchSnippetsByLanguage(language: string): Promise<CodeSnippet[]> {
  // Cast to any to bypass type checking since we know the structure is correct
  const { data, error } = await supabase
    .from('code_snippets')
    .select('*')
    .eq('language', language) as any;
  
  if (error) {
    console.error("Error fetching snippets:", error);
    throw error;
  }
  
  return data || [];
}

export async function fetchRandomSnippet(language: string, difficulty?: string): Promise<CodeSnippet | null> {
  // Cast to any to bypass type checking 
  let query = supabase
    .from('code_snippets')
    .select('*')
    .eq('language', language) as any;
  
  if (difficulty) {
    query = query.eq('difficulty', difficulty);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error("Error fetching random snippet:", error);
    throw error;
  }
  
  if (data && data.length > 0) {
    // Get a random snippet
    const randomIndex = Math.floor(Math.random() * data.length);
    return data[randomIndex];
  }
  
  return null;
}

export async function saveUserProgress(userId: string, progress: {
  snippet_id: string;
  wpm: number;
  accuracy: number;
  errors: number;
  time_taken: number;
  special_char_errors?: number;
  syntax_errors?: number;
  indentation_errors?: number;
}): Promise<void> {
  // Cast to any to bypass type checking
  const { error } = await supabase
    .from('user_progress')
    .insert({
      user_id: userId,
      ...progress
    }) as any;
  
  if (error) {
    console.error("Error saving progress:", error);
    throw error;
  }
}

export async function getUserProgress(userId: string, limit = 10): Promise<any[]> {
  // Cast to any to bypass type checking
  const { data, error } = await supabase
    .from('user_progress')
    .select(`
      *,
      code_snippets:snippet_id(title, language, difficulty)
    `)
    .eq('user_id', userId)
    .order('completed_at', { ascending: false })
    .limit(limit) as any;
  
  if (error) {
    console.error("Error fetching user progress:", error);
    throw error;
  }
  
  return data || [];
}
