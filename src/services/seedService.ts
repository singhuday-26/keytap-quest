
import { supabase } from "@/integrations/supabase/client";
import { codeSnippets } from "@/data/codeSnippets";
import { CodeSnippet } from "@/types";

export async function seedSnippets(): Promise<{ count: number; error: string | null }> {
  try {
    // First, check if we already have snippets in the database
    const { count, error: countError } = await supabase
      .from('code_snippets')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      throw countError;
    }
    
    // If we already have snippets, return early
    if (count && count > 0) {
      return { count, error: null };
    }
    
    // Prepare snippets for insertion
    const snippetsToInsert = codeSnippets.map(snippet => ({
      id: snippet.id,
      language: snippet.language,
      title: snippet.title,
      code: snippet.code,
      difficulty: snippet.difficulty,
      category: snippet.category || null,
      description: snippet.title // Using title as description for now
    }));
    
    // Insert snippets into the database
    const { error } = await supabase
      .from('code_snippets')
      .insert(snippetsToInsert);
    
    if (error) {
      throw error;
    }
    
    return { count: snippetsToInsert.length, error: null };
  } catch (error) {
    console.error("Error seeding snippets:", error);
    return { count: 0, error: error.message };
  }
}

export async function checkSnippetCount(): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('code_snippets')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      throw error;
    }
    
    return count || 0;
  } catch (error) {
    console.error("Error checking snippet count:", error);
    return 0;
  }
}
