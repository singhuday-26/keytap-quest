
export type CodeSnippet = {
  id: string;
  language: string;
  code: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category?: string;
  description?: string;
  created_at?: string;
  title?: string;
};

export type UserProgress = {
  id: string;
  user_id: string;
  snippet_id: string;
  wpm: number;
  accuracy: number;
  errors: number;
  time_taken: number;
  special_char_errors?: number;
  syntax_errors?: number;
  indentation_errors?: number;
  created_at?: string;
};

export type UserPreference = {
  id: string;
  user_id: string;
  theme: string;
  font_size: number;
  keyboard_sounds: boolean;
  show_line_numbers: boolean;
  created_at?: string;
};

export type Database = {
  public: {
    Tables: {
      code_snippets: {
        Row: CodeSnippet;
        Insert: Omit<CodeSnippet, 'id' | 'created_at'> & { id?: string };
        Update: Partial<Omit<CodeSnippet, 'id'>>;
      };
      user_progress: {
        Row: UserProgress;
        Insert: Omit<UserProgress, 'id' | 'created_at'> & { id?: string };
        Update: Partial<Omit<UserProgress, 'id'>>;
      };
      user_preferences: {
        Row: UserPreference;
        Insert: Omit<UserPreference, 'id' | 'created_at'> & { id?: string };
        Update: Partial<Omit<UserPreference, 'id'>>;
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
};
