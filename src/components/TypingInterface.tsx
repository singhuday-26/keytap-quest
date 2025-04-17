
import React, { useState, useEffect, useRef, KeyboardEvent } from "react";
import { CodeSnippet, TypingStats, TypingState } from "@/types";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PlayCircle, RefreshCw } from "lucide-react";

interface TypingInterfaceProps {
  snippet: CodeSnippet;
  onComplete: (stats: TypingStats) => void;
  onProgress: (currentIndex: number, errors: number) => void;
}

const TypingInterface: React.FC<TypingInterfaceProps> = ({
  snippet,
  onComplete,
  onProgress,
}) => {
  const [typingState, setTypingState] = useState<TypingState>({
    started: false,
    completed: false,
    startTime: null,
    endTime: null,
    currentIndex: 0,
    currentLineIndex: 0,
    errors: 0,
    correctChars: 0,
    totalChars: snippet.code.length,
  });

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [inputValue, setInputValue] = useState("");

  // Focus the input when the component mounts or when reset
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [typingState.started, typingState.completed]);

  // Calculate and return typing stats when completed
  useEffect(() => {
    if (typingState.completed && typingState.startTime && typingState.endTime) {
      const timeInSeconds = (typingState.endTime - typingState.startTime) / 1000;
      const minutes = timeInSeconds / 60;
      
      // Standard WPM calculation (5 chars = 1 word)
      const wpm = Math.round((typingState.correctChars / 5) / minutes);
      
      // Accuracy calculation
      const accuracy = Math.round(
        (typingState.correctChars / typingState.totalChars) * 100
      );
      
      onComplete({
        wpm,
        accuracy,
        errors: typingState.errors,
        time: Math.round(timeInSeconds),
        charactersTyped: typingState.totalChars,
        correctCharacters: typingState.correctChars,
      });
    }
  }, [typingState.completed]);

  // Handle key press events
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Prevent tab from changing focus
    if (e.key === "Tab") {
      e.preventDefault();
      
      // Insert tab at cursor position
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const value = target.value;
      
      // Replace selection with tab
      setInputValue(value.substring(0, start) + "  " + value.substring(end));
      
      // Set cursor position after the tab
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      }, 0);
      
      return;
    }
    
    // Block arrow keys, home, end
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) {
      e.preventDefault();
      return;
    }
  };

  // Handle typing input
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const currentValue = e.target.value;
    setInputValue(currentValue);
    
    // Start the timer on first key press
    if (!typingState.started && currentValue.length > 0) {
      setTypingState((prev) => ({
        ...prev,
        started: true,
        startTime: Date.now(),
      }));
    }
    
    // Compare typed text with the original code
    let correctCount = 0;
    let errorCount = 0;
    let i = 0;
    
    while (i < currentValue.length && i < snippet.code.length) {
      if (currentValue[i] === snippet.code[i]) {
        correctCount++;
      } else {
        errorCount++;
      }
      i++;
    }
    
    // Update typing state
    setTypingState((prev) => ({
      ...prev,
      currentIndex: currentValue.length,
      errors: errorCount,
      correctChars: correctCount,
    }));
    
    // Update parent component with progress
    onProgress(currentValue.length, errorCount);
    
    // Check if typing is complete
    if (currentValue.length === snippet.code.length) {
      setTypingState((prev) => ({
        ...prev,
        completed: true,
        endTime: Date.now(),
      }));
    }
  };

  // Reset the typing interface
  const handleReset = () => {
    setInputValue("");
    setTypingState({
      started: false,
      completed: false,
      startTime: null,
      endTime: null,
      currentIndex: 0,
      currentLineIndex: 0,
      errors: 0,
      correctChars: 0,
      totalChars: snippet.code.length,
    });
  };

  return (
    <div className="w-full">
      <div className="mb-4 relative">
        <Textarea
          ref={inputRef}
          value={inputValue}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          className="font-mono h-40 text-sm leading-relaxed resize-none bg-muted/50"
          placeholder="Start typing to begin the exercise..."
          disabled={typingState.completed}
        />
        {!typingState.started && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-md">
            <Button 
              size="lg" 
              onClick={() => inputRef.current?.focus()}
              className="gap-2"
            >
              <PlayCircle className="h-5 w-5" />
              Start Typing
            </Button>
          </div>
        )}
      </div>
      <div className="flex justify-end">
        <Button 
          variant="outline" 
          onClick={handleReset}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Reset
        </Button>
      </div>
    </div>
  );
};

export default TypingInterface;
