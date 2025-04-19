
export type LanguageOption = {
  id: string;
  name: string;
  value: string;
};

export type CodeSnippet = {
  id: string;
  code: string;
  language: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  source?: string;
  // Adding new fields for categorization
  category?: 'algorithms' | 'data-structures' | 'design-patterns' | 'frameworks' | 'interview';
  concepts?: string[];
  author?: string;
};

export type TypingStats = {
  wpm: number;
  accuracy: number;
  errors: number;
  time: number;
  charactersTyped: number;
  correctCharacters: number;
  // Adding new metrics for code-specific insights
  specialCharCount?: number;
  syntaxErrorCount?: number;
  indentationErrors?: number;
};

export type TypingState = {
  started: boolean;
  completed: boolean;
  startTime: number | null;
  endTime: number | null;
  currentIndex: number;
  currentLineIndex: number;
  errors: number;
  correctChars: number;
  totalChars: number;
};

// New types for the enhanced features
export type UserPreferences = {
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  keyboardSounds: boolean;
  showLineNumbers: boolean;
  testDuration: 15 | 30 | 60 | 120 | 300; // in seconds
  autoComplete: boolean;
  includeComments: boolean;
};

export type UserProgress = {
  languages: Record<string, LanguageProgress>;
  lastPracticed: Date;
  streak: number;
  totalPracticeTime: number; // in seconds
  completedSnippets: number;
};

export type LanguageProgress = {
  averageWpm: number;
  averageAccuracy: number;
  practiceCount: number;
  lastPracticed: Date;
  bestWpm: number;
  commonErrors: string[];
};
