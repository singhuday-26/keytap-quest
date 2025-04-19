
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

  // Track special characters for advanced metrics
  const [specialCharStats, setSpecialCharStats] = useState({
    brackets: { correct: 0, incorrect: 0 },
    semicolons: { correct: 0, incorrect: 0 },
    parentheses: { correct: 0, incorrect: 0 },
    indentation: { correct: 0, incorrect: 0 },
  });

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [inputValue, setInputValue] = useState("");

  // Reset the state when snippet changes
  useEffect(() => {
    if (snippet) {
      handleReset();
    }
  }, [snippet]);

  // Focus the input when the component mounts or when reset
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [typingState.started, typingState.completed, snippet]);

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
        // Add new code-specific metrics
        specialCharCount: countSpecialChars(snippet.code),
        syntaxErrorCount: countSyntaxErrors(),
        indentationErrors: specialCharStats.indentation.incorrect,
      });
    }
  }, [typingState.completed]);

  // Count the number of special characters in the code
  const countSpecialChars = (text: string) => {
    const specialChars = text.match(/[{}[\]()<>:;]/g);
    return specialChars ? specialChars.length : 0;
  };

  // Simulate counting syntax errors (in a real implementation, this would use a parser)
  const countSyntaxErrors = () => {
    // This is a simplification - a real implementation would use a language parser
    const totalSpecialCharErrors = 
      specialCharStats.brackets.incorrect + 
      specialCharStats.semicolons.incorrect + 
      specialCharStats.parentheses.incorrect;
    
    return totalSpecialCharErrors;
  };

  // Track special character errors
  const updateSpecialCharStats = (charIndex: number, isCorrect: boolean) => {
    const char = snippet.code[charIndex];
    
    // Update stats based on character type
    if (/[{}[\]]/.test(char)) {
      // Brackets
      setSpecialCharStats(prev => ({
        ...prev,
        brackets: {
          correct: isCorrect ? prev.brackets.correct + 1 : prev.brackets.correct,
          incorrect: !isCorrect ? prev.brackets.incorrect + 1 : prev.brackets.incorrect,
        }
      }));
    } else if (char === ';') {
      // Semicolons
      setSpecialCharStats(prev => ({
        ...prev,
        semicolons: {
          correct: isCorrect ? prev.semicolons.correct + 1 : prev.semicolons.correct,
          incorrect: !isCorrect ? prev.semicolons.incorrect + 1 : prev.semicolons.incorrect,
        }
      }));
    } else if (/[()]/.test(char)) {
      // Parentheses
      setSpecialCharStats(prev => ({
        ...prev,
        parentheses: {
          correct: isCorrect ? prev.parentheses.correct + 1 : prev.parentheses.correct,
          incorrect: !isCorrect ? prev.parentheses.incorrect + 1 : prev.parentheses.incorrect,
        }
      }));
    }
  };

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
      
      // Replace selection with tab (two spaces)
      setInputValue(value.substring(0, start) + "  " + value.substring(end));
      
      // Set cursor position after the tab
      setTimeout(() => {
        if (target) {
          target.selectionStart = target.selectionEnd = start + 2;
        }
      }, 0);
      
      // Check if tab was used correctly (matching indentation in the original code)
      const currentLineStart = value.lastIndexOf('\n', start) + 1;
      const expectedIndent = snippet.code.substring(currentLineStart, start).match(/^\s*/)?.[0] || "";
      
      if (expectedIndent.length === 2) {
        // Tab was used correctly for indentation
        setSpecialCharStats(prev => ({
          ...prev,
          indentation: {
            correct: prev.indentation.correct + 1,
            incorrect: prev.indentation.incorrect
          }
        }));
      } else {
        // Tab was used incorrectly
        setSpecialCharStats(prev => ({
          ...prev,
          indentation: {
            correct: prev.indentation.correct,
            incorrect: prev.indentation.incorrect + 1
          }
        }));
      }
      
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
      const isCorrect = currentValue[i] === snippet.code[i];
      
      if (isCorrect) {
        correctCount++;
        // For special characters, update their specific stats
        if (/[{}[\]()<>:;]/.test(snippet.code[i])) {
          updateSpecialCharStats(i, true);
        }
      } else {
        errorCount++;
        // For special characters, update their specific stats
        if (/[{}[\]()<>:;]/.test(snippet.code[i])) {
          updateSpecialCharStats(i, false);
        }
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
    setSpecialCharStats({
      brackets: { correct: 0, incorrect: 0 },
      semicolons: { correct: 0, incorrect: 0 },
      parentheses: { correct: 0, incorrect: 0 },
      indentation: { correct: 0, incorrect: 0 },
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
          onFocus={(e) => {
            // Make sure cursor is at the right position
            if (typingState.currentIndex > 0) {
              e.target.selectionStart = e.target.selectionEnd = typingState.currentIndex;
            }
          }}
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
