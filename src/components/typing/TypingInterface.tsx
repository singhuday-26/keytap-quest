
import React, { useRef, KeyboardEvent, useEffect } from "react";
import { CodeSnippet, TypingStats } from "@/types";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PlayCircle, RefreshCw } from "lucide-react";
import { useTypingState } from "@/hooks/useTypingState";
import { updateIndentationStats } from "@/components/typing/TypingStats";

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
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  const {
    typingState,
    specialCharStats,
    inputValue,
    setSpecialCharStats,
    handleInput,
    handleReset
  } = useTypingState(snippet, onComplete, onProgress);

  // Focus the input when the component mounts or when reset
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [typingState.started, typingState.completed, snippet]);

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
      const newValue = value.substring(0, start) + "  " + value.substring(end);
      
      // Set cursor position after the tab
      setTimeout(() => {
        if (target) {
          target.selectionStart = target.selectionEnd = start + 2;
        }
      }, 0);
      
      // Check if tab was used correctly (matching indentation in the original code)
      const currentLineStart = value.lastIndexOf('\n', start) + 1;
      const expectedIndent = snippet.code.substring(currentLineStart, start).match(/^\s*/)?.[0] || "";
      
      setSpecialCharStats(prev => 
        updateIndentationStats(expectedIndent, "  ", prev)
      );
      
      // Update input value
      handleInput(newValue);
      
      return;
    }
    
    // Block arrow keys, home, end
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) {
      e.preventDefault();
      return;
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4 relative">
        <Textarea
          ref={inputRef}
          value={inputValue}
          onChange={(e) => handleInput(e.target.value)}
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
