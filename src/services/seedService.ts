
import { supabase } from "@/integrations/supabase/client";
import { codeSnippets } from "@/data/codeSnippets";
import { CodeSnippet } from "@/types";

// Cache the result to avoid redundant checks
let seedCheckPerformed = false;
let snippetCount = 0;

export async function seedSnippets(): Promise<{ count: number; error: string | null }> {
  try {
    // First, check if we already have snippets in the database
    if (!seedCheckPerformed) {
      const count = await checkSnippetCount();
      snippetCount = count;
      seedCheckPerformed = true;
      
      // If we already have snippets, return early
      if (count > 0) {
        return { count, error: null };
      }
    } else if (snippetCount > 0) {
      return { count: snippetCount, error: null };
    }
    
    // Prepare snippets for insertion
    const snippetsToInsert = codeSnippets.map(snippet => ({
      id: snippet.id,
      language: snippet.language,
      code: snippet.code,
      difficulty: snippet.difficulty,
      category: snippet.category || null,
      description: snippet.title // Using title as description
    }));
    
    // Insert snippets into the database
    const { error } = await supabase
      .from('code_snippets')
      .insert(snippetsToInsert);
    
    if (error) {
      console.error("Error seeding database:", error);
      throw error;
    }
    
    snippetCount = snippetsToInsert.length;
    return { count: snippetCount, error: null };
  } catch (error) {
    console.error("Error seeding snippets:", error);
    return { count: 0, error: error.message };
  }
}

export async function checkSnippetCount(): Promise<number> {
  if (seedCheckPerformed) {
    return snippetCount;
  }
  
  try {
    const { count, error } = await supabase
      .from('code_snippets')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      throw error;
    }
    
    snippetCount = count || 0;
    seedCheckPerformed = true;
    return snippetCount;
  } catch (error) {
    console.error("Error checking snippet count:", error);
    return 0;
  }
}
