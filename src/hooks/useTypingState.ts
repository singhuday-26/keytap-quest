
import { useState, useEffect } from 'react';
import { CodeSnippet, TypingStats, TypingState } from '@/types';
import { SpecialCharStats, updateSpecialCharStats, countSyntaxErrors, countSpecialChars } from '@/components/typing/TypingStats';

export function useTypingState(snippet: CodeSnippet, onComplete: (stats: TypingStats) => void, onProgress: (currentIndex: number, errors: number) => void) {
  // Typing state
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

  // Special character stats
  const [specialCharStats, setSpecialCharStats] = useState<SpecialCharStats>({
    brackets: { correct: 0, incorrect: 0 },
    semicolons: { correct: 0, incorrect: 0 },
    parentheses: { correct: 0, incorrect: 0 },
    indentation: { correct: 0, incorrect: 0 },
  });

  // Input value
  const [inputValue, setInputValue] = useState("");

  // Reset the state when snippet changes
  useEffect(() => {
    if (snippet) {
      handleReset();
    }
  }, [snippet]);

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
        specialCharCount: countSpecialChars(snippet.code),
        syntaxErrorCount: countSyntaxErrors(specialCharStats),
        indentationErrors: specialCharStats.indentation.incorrect,
      });
    }
  }, [typingState.completed, typingState.startTime, typingState.endTime, typingState.correctChars, typingState.totalChars, typingState.errors, onComplete, snippet.code, specialCharStats]);

  // Update typing progress
  const handleInput = (currentValue: string) => {
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
          setSpecialCharStats(prev => 
            updateSpecialCharStats(snippet.code[i], i, true, prev)
          );
        }
      } else {
        errorCount++;
        // For special characters, update their specific stats
        if (/[{}[\]()<>:;]/.test(snippet.code[i])) {
          setSpecialCharStats(prev => 
            updateSpecialCharStats(snippet.code[i], i, false, prev)
          );
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

  return {
    typingState,
    specialCharStats,
    inputValue,
    setSpecialCharStats,
    handleInput,
    handleReset
  };
}
