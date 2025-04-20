
import { supabase } from "@/integrations/supabase/client";
import { CodeSnippet } from "@/types";

// Cache for language snippets to reduce database calls
const snippetCache: Record<string, { snippets: CodeSnippet[], timestamp: number }> = {};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function fetchSnippetsByLanguage(language: string): Promise<CodeSnippet[]> {
  // Check cache first
  const now = Date.now();
  const cachedData = snippetCache[language];
  
  if (cachedData && (now - cachedData.timestamp < CACHE_TTL)) {
    return cachedData.snippets;
  }
  
  const { data, error } = await supabase
    .from('code_snippets')
    .select('*')
    .eq('language', language);
  
  if (error) {
    console.error("Error fetching snippets:", error);
    throw error;
  }
  
  // Update cache
  snippetCache[language] = {
    snippets: data || [],
    timestamp: now
  };
  
  return data || [];
}

export async function fetchRandomSnippet(language: string, difficulty?: string): Promise<CodeSnippet | null> {
  // Try to use cached data if available
  const now = Date.now();
  const cachedData = snippetCache[language];
  
  if (cachedData && (now - cachedData.timestamp < CACHE_TTL)) {
    const filteredSnippets = difficulty 
      ? cachedData.snippets.filter(s => s.difficulty === difficulty)
      : cachedData.snippets;
      
    if (filteredSnippets.length > 0) {
      return filteredSnippets[Math.floor(Math.random() * filteredSnippets.length)];
    }
  }
  
  // If not in cache or filtered cache is empty, fetch from database
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
    // Update cache with all snippets of this language
    if (!cachedData) {
      fetchSnippetsByLanguage(language).catch(console.error); // Update cache in background
    }
    
    // Get a random snippet
    return data[Math.floor(Math.random() * data.length)];
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
      code_snippets(title, language, difficulty)
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
