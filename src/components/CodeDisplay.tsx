
import React from "react";
import { CodeSnippet } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CodeDisplayProps {
  snippet: CodeSnippet;
  currentIndex: number;
  errors: number;
}

const CodeDisplay: React.FC<CodeDisplayProps> = ({ 
  snippet, 
  currentIndex,
  errors
}) => {
  const code = snippet.code;
  
  // Split the code into characters for highlighting
  const characters = code.split("");
  
  // Split the code into lines for line numbers
  const lines = code.split("\n");

  // Use description as title if title is not available
  const displayTitle = snippet.title || snippet.description || 'Code Snippet';

  return (
    <Card className="w-full mb-4 border border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-mono">{displayTitle}</CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant={snippet.difficulty === 'easy' ? 'default' : snippet.difficulty === 'medium' ? 'secondary' : 'destructive'}>
            {snippet.difficulty}
          </Badge>
          <Badge variant="outline">{snippet.language}</Badge>
          {snippet.category && (
            <Badge variant="outline" className="hidden md:inline-flex">
              {snippet.category}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-10 bg-muted/50 border-r text-center hidden sm:block">
            {lines.map((_, i) => (
              <div key={i} className="text-xs text-muted-foreground py-[0.25rem]">
                {i + 1}
              </div>
            ))}
          </div>
          <pre className="font-mono text-left overflow-x-auto p-4 pl-12 bg-muted rounded-md text-sm leading-relaxed">
            <code>
              {characters.map((char, index) => {
                let className = "";
                
                if (index < currentIndex) {
                  className = "text-green-500 bg-green-500/10";
                } else if (index === currentIndex) {
                  className = "bg-primary/20 relative";
                }
                
                // Handle space characters
                const displayChar = char === " " ? char : char;
                
                return (
                  <span key={index} className={className}>
                    {displayChar}
                    {index === currentIndex && (
                      <span className="absolute bottom-0 left-0 w-0.5 h-5 bg-primary animate-cursor-blink"></span>
                    )}
                  </span>
                );
              })}
            </code>
          </pre>
        </div>
      </CardContent>
    </Card>
  );
};

export default CodeDisplay;
