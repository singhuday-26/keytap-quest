
import { supabase } from "@/integrations/supabase/client";
import { CodeSnippet } from "@/types";

export async function fetchSnippetsByLanguage(language: string): Promise<CodeSnippet[]> {
  const { data, error } = await supabase
    .from('code_snippets')
    .select('*')
    .eq('language', language);
  
  if (error) {
    console.error("Error fetching snippets:", error);
    throw error;
  }
  
  return data || [];
}

export async function fetchRandomSnippet(language: string, difficulty?: string): Promise<CodeSnippet | null> {
  let query = supabase
    .from('code_snippets')
    .select('*')
    .eq('language', language);
  
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
  const { error } = await supabase
    .from('user_progress')
    .insert({
      user_id: userId,
      ...progress
    });
  
  if (error) {
    console.error("Error saving progress:", error);
    throw error;
  }
}

export async function getUserProgress(userId: string, limit = 10): Promise<any[]> {
  const { data, error } = await supabase
    .from('user_progress')
    .select(`
      *,
      code_snippets:snippet_id(title, language, difficulty)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) {
    console.error("Error fetching user progress:", error);
    throw error;
  }
  
  return data || [];
}
