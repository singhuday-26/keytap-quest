
import { useState, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchSnippetsByLanguage, fetchRandomSnippet } from '@/services/snippetService';
import { CodeSnippet } from '@/types';
import { useToast } from '@/components/ui/use-toast';

export function useSnippets(initialLanguage: string) {
  const [selectedLanguage, setSelectedLanguage] = useState(initialLanguage);
  const [currentSnippet, setCurrentSnippet] = useState<CodeSnippet | null>(null);
  const [availableDifficulties, setAvailableDifficulties] = useState<string[]>([]);
  const { toast } = useToast();

  // Fetch snippets for the selected language - cached by react-query
  const { data: snippets, isLoading, error } = useQuery({
    queryKey: ['snippets', selectedLanguage],
    queryFn: () => fetchSnippetsByLanguage(selectedLanguage),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Process available difficulties whenever snippets change
  useEffect(() => {
    if (snippets && snippets.length > 0) {
      const difficulties = new Set(snippets.map(s => s.difficulty));
      setAvailableDifficulties(Array.from(difficulties));
    }
  }, [snippets]);

  // Load a random snippet
  const loadRandomSnippet = useCallback(async (difficulty?: string) => {
    try {
      const snippet = await fetchRandomSnippet(selectedLanguage, difficulty);
      if (snippet) {
        setCurrentSnippet(snippet);
        return snippet;
      } else {
        toast({
          title: "No snippets available",
          description: `No code snippets found for ${selectedLanguage}${difficulty ? ` with ${difficulty} difficulty` : ''}. Try another option.`,
          variant: "destructive",
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
