
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
};

export type TypingStats = {
  wpm: number;
  accuracy: number;
  errors: number;
  time: number;
  charactersTyped: number;
  correctCharacters: number;
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
