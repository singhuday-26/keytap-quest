
import { useState, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchSnippetsByLanguage, fetchRandomSnippet } from '@/services/snippetService';
import { CodeSnippet } from '@/types';
import { useToast } from '@/components/ui/use-toast';

export function useSnippets(initialLanguage: string) {
  const [selectedLanguage, setSelectedLanguage] = useState(initialLanguage);
  const [currentSnippet, setCurrentSnippet] = useState<CodeSnippet | null>(null);
  const [availableDifficulties] = useState<string[]>(['easy', 'medium', 'hard']);
  const { toast } = useToast();

  // Fetch snippets for the selected language
  const { data: snippets, isLoading, error } = useQuery({
    queryKey: ['snippets', selectedLanguage],
    queryFn: () => fetchSnippetsByLanguage(selectedLanguage),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Load a random snippet
  const loadRandomSnippet = useCallback(async (difficulty?: string) => {
    try {
      const snippet = await fetchRandomSnippet(selectedLanguage, difficulty);
      if (snippet) {
        // Make sure the snippet has a title property
        if (!snippet.title && snippet.description) {
          snippet.title = snippet.description;
        } else if (!snippet.title) {
          snippet.title = 'Code Snippet';
        }
        
        setCurrentSnippet(snippet);
        return snippet;
      } else {
        toast({
          title: "No snippets available",
          description: `No code snippets found for ${selectedLanguage}${difficulty ? ` with ${difficulty} difficulty` : ''}. Generating a new one...`,
          variant: "default",
        });
        return null;
      }
    } catch (error) {
      console.error("Error loading snippet:", error);
      toast({
        title: "Error",
        description: "Failed to load code snippet. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  }, [selectedLanguage, toast]);

  // Change the selected language
  const changeLanguage = useCallback((language: string) => {
    setSelectedLanguage(language);
    setCurrentSnippet(null); // Reset current snippet when language changes
  }, []);

  return {
    selectedLanguage,
    changeLanguage,
    currentSnippet,
    availableDifficulties,
    loadRandomSnippet,
    isLoading,
    error,
    snippets
  };
}
