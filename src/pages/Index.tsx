import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import CodeDisplay from "@/components/CodeDisplay";
import TypingInterface from "@/components/TypingInterface";
import PerformanceStats from "@/components/PerformanceStats";
import ResultsModal from "@/components/ResultsModal";
import { CodeSnippet, TypingStats } from "@/types";
import { fetchSnippetsByLanguage, fetchRandomSnippet, saveUserProgress } from "@/services/snippetService";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Code, BarChart, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [currentSnippet, setCurrentSnippet] = useState<CodeSnippet | null>(null);
  const [stats, setStats] = useState<TypingStats | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [errors, setErrors] = useState(0);
  const [resultsOpen, setResultsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [availableDifficulties, setAvailableDifficulties] = useState<string[]>([]);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    loadSnippets();
  }, [selectedLanguage]);

  const loadSnippets = async () => {
    try {
      setIsLoading(true);
      const snippets = await fetchSnippetsByLanguage(selectedLanguage);
      
      if (snippets.length > 0) {
        const difficulties = new Set(snippets.map(s => s.difficulty));
        setAvailableDifficulties(Array.from(difficulties));
        
        const snippet = await fetchRandomSnippet(selectedLanguage);
        if (snippet) {
          setCurrentSnippet(snippet);
          resetExercise();
        }
      } else {
        setCurrentSnippet(null);
        toast({
          title: "No snippets available",
          description: `No code snippets found for ${selectedLanguage}. Try another language.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error loading snippets:", error);
      toast({
        title: "Error",
        description: "Failed to load code snippets. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
  };

  const handleComplete = async (stats: TypingStats) => {
    setStats(stats);
    setIsTyping(false);
    setResultsOpen(true);
    
    if (user && currentSnippet) {
      try {
        await saveUserProgress(user.id, {
          snippet_id: currentSnippet.id,
          wpm: stats.wpm,
          accuracy: stats.accuracy,
          errors: stats.errors,
          time_taken: stats.time,
          special_char_errors: stats.specialCharCount,
          syntax_errors: stats.syntaxErrorCount,
          indentation_errors: stats.indentationErrors
        });
      } catch (error) {
        console.error("Error saving progress:", error);
      }
    }
  };

  const handleProgress = (index: number, errorCount: number) => {
    setCurrentIndex(index);
    setErrors(errorCount);
    setIsTyping(true);
  };

  const resetExercise = () => {
    setCurrentIndex(0);
    setErrors(0);
    setIsTyping(false);
    setStats(null);
  };

  const handleSelectDifficulty = async (difficulty: string) => {
    try {
      setIsLoading(true);
      const snippet = await fetchRandomSnippet(selectedLanguage, difficulty);
      
      if (snippet) {
        setCurrentSnippet(snippet);
        resetExercise();
      } else {
        toast({
          title: "No snippets available",
          description: `No code snippets found for ${selectedLanguage} with ${difficulty} difficulty.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching snippet:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header 
        selectedLanguage={selectedLanguage} 
        onLanguageChange={handleLanguageChange} 
      />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <Card className="my-8">
              <CardHeader>
                <CardTitle>Loading Snippets...</CardTitle>
              </CardHeader>
            </Card>
          ) : !currentSnippet ? (
            <Card className="my-8">
              <CardHeader>
                <CardTitle>No Snippets Available</CardTitle>
                <CardDescription>
                  No code snippets found for {selectedLanguage}. Try selecting another language.
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Practice Typing</h2>
                <div className="flex gap-2">
                  {user && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => navigate("/settings")}
                        className="gap-1"
                      >
                        <Settings className="h-4 w-4" />
                        <span className="hidden sm:inline">Settings</span>
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => navigate("/dashboard")}
                        className="gap-1"
                      >
                        <BarChart className="h-4 w-4" />
                        <span className="hidden sm:inline">Dashboard</span>
                      </Button>
                    </>
                  )}
                  {!user && (
                    <Button
                      variant="outline"
                      onClick={() => navigate("/auth")}
                      className="gap-1"
                    >
                      <ArrowRight className="h-4 w-4" />
                      <span>Sign In</span>
                    </Button>
                  )}
                </div>
              </div>
              
              <Tabs defaultValue={currentSnippet.difficulty} className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    <span className="font-medium">Difficulty</span>
                  </div>
                  <TabsList>
                    {availableDifficulties.map(difficulty => (
                      <TabsTrigger 
                        key={difficulty} 
                        value={difficulty}
                        onClick={() => handleSelectDifficulty(difficulty)}
                      >
                        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>
                
                {availableDifficulties.map(difficulty => (
                  <TabsContent key={difficulty} value={difficulty} className="mt-0">
                    <Card className="mb-6">
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2">
                          <Code className="h-5 w-5" />
                          Ready to practice {selectedLanguage} code typing
                        </CardTitle>
                        <CardDescription>
                          Type the code snippet exactly as shown. Watch for syntax, spacing, and indentation.
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </TabsContent>
                ))}
              </Tabs>
              
              <PerformanceStats 
                stats={stats}
                isActive={isTyping}
                currentPosition={currentIndex}
                totalLength={currentSnippet.code.length}
              />
              
              <CodeDisplay 
                snippet={currentSnippet}
                currentIndex={currentIndex}
                errors={errors}
              />
              
              <TypingInterface 
                snippet={currentSnippet}
                onComplete={handleComplete}
                onProgress={handleProgress}
              />
              
              <ResultsModal 
                isOpen={resultsOpen}
                onClose={() => setResultsOpen(false)}
                onReset={resetExercise}
                stats={stats || {
                  wpm: 0,
                  accuracy: 0,
                  errors: 0,
                  time: 0,
                  charactersTyped: 0,
                  correctCharacters: 0
                }}
              />
            </>
          )}
        </div>
      </main>
      
      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>KeyTap Quest - Improve your coding speed and accuracy</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
