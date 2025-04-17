
import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import CodeDisplay from "@/components/CodeDisplay";
import TypingInterface from "@/components/TypingInterface";
import PerformanceStats from "@/components/PerformanceStats";
import ResultsModal from "@/components/ResultsModal";
import { CodeSnippet, TypingStats } from "@/types";
import { getSnippetsByLanguage } from "@/data/codeSnippets";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Code } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [currentSnippet, setCurrentSnippet] = useState<CodeSnippet | null>(null);
  const [stats, setStats] = useState<TypingStats | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [errors, setErrors] = useState(0);
  const [resultsOpen, setResultsOpen] = useState(false);
  
  // Initialize with snippets for the selected language
  useEffect(() => {
    const snippets = getSnippetsByLanguage(selectedLanguage);
    if (snippets.length > 0) {
      setCurrentSnippet(snippets[0]);
      resetExercise();
    }
  }, [selectedLanguage]);

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
  };

  const handleComplete = (stats: TypingStats) => {
    setStats(stats);
    setIsTyping(false);
    setResultsOpen(true);
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

  // Find available snippet difficulty levels
  const getAvailableDifficulties = () => {
    const snippets = getSnippetsByLanguage(selectedLanguage);
    const difficulties = new Set(snippets.map(s => s.difficulty));
    return Array.from(difficulties);
  };

  // Select a snippet by difficulty
  const handleSelectDifficulty = (difficulty: string) => {
    const snippets = getSnippetsByLanguage(selectedLanguage).filter(s => s.difficulty === difficulty);
    if (snippets.length > 0) {
      const randomIndex = Math.floor(Math.random() * snippets.length);
      setCurrentSnippet(snippets[randomIndex]);
      resetExercise();
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
          {!currentSnippet ? (
            <Card className="my-8">
              <CardHeader>
                <CardTitle>Loading Snippets...</CardTitle>
              </CardHeader>
            </Card>
          ) : (
            <>
              <Tabs defaultValue={currentSnippet.difficulty} className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">Practice Typing</h2>
                  <TabsList>
                    {getAvailableDifficulties().map(difficulty => (
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
                
                {getAvailableDifficulties().map(difficulty => (
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
