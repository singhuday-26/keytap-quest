
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
  
  // Transform data to match CodeSnippet type if needed
  const snippets = data?.map(item => ({
    ...item,
    title: item.description || 'Code Snippet', // Use description as title
  })) || [];
  
  // Update cache
  snippetCache[language] = {
    snippets: snippets,
    timestamp: now
  };
  
  return snippets;
}

export async function fetchRandomSnippet(language: string, difficulty?: string): Promise<CodeSnippet | null> {
  try {
    // First try to get an existing random snippet
    let query = supabase
      .from('code_snippets')
      .select('*')
      .eq('language', language);
    
    if (difficulty) {
      query = query.eq('difficulty', difficulty);
    }
    
    let { data: existingSnippets, error } = await query
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (error) throw error;
    
    // If we have snippets, return a random one
    if (existingSnippets && existingSnippets.length > 0) {
      const randomSnippet = existingSnippets[Math.floor(Math.random() * existingSnippets.length)];
      // Add title property if not present
      return {
        ...randomSnippet,
        title: randomSnippet.description || 'Code Snippet'
      };
    }
    
    // If no snippets found, generate a new one
    const response = await supabase.functions.invoke('generate-snippet', {
      body: { language, difficulty },
    });

    if (response.error) {
      console.error("Error invoking generate-snippet function:", response.error);
      throw response.error;
    }
    
    // Add title property if not present
    return {
      ...response.data,
      title: response.data.description || 'Generated Code Snippet'
    };
  } catch (error) {
    console.error("Error fetching/generating random snippet:", error);
    return null;
  }
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
      code_snippets(id, language, difficulty, description)
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
