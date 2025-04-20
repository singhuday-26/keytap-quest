
// Utility functions for tracking typing statistics
export interface SpecialCharStats {
  brackets: { correct: number; incorrect: number };
  semicolons: { correct: number; incorrect: number };
  parentheses: { correct: number; incorrect: number };
  indentation: { correct: number; incorrect: number };
}

// Count the number of special characters in the code
export const countSpecialChars = (text: string): number => {
  const specialChars = text.match(/[{}[\]()<>:;]/g);
  return specialChars ? specialChars.length : 0;
};

// Count syntax errors based on special character stats
export const countSyntaxErrors = (stats: SpecialCharStats): number => {
  return (
    stats.brackets.incorrect + 
    stats.semicolons.incorrect + 
    stats.parentheses.incorrect
  );
};

// Track special character errors
export const updateSpecialCharStats = (
  char: string, 
  charIndex: number, 
  isCorrect: boolean,
  prevStats: SpecialCharStats
): SpecialCharStats => {
  const stats = { ...prevStats };
  
  if (/[{}[\]]/.test(char)) {
    // Brackets
    stats.brackets = {
      correct: isCorrect ? stats.brackets.correct + 1 : stats.brackets.correct,
      incorrect: !isCorrect ? stats.brackets.incorrect + 1 : stats.brackets.incorrect,
    };
  } else if (char === ';') {
    // Semicolons
    stats.semicolons = {
      correct: isCorrect ? stats.semicolons.correct + 1 : stats.semicolons.correct,
      incorrect: !isCorrect ? stats.semicolons.incorrect + 1 : stats.semicolons.incorrect,
    };
  } else if (/[()]/.test(char)) {
    // Parentheses
    stats.parentheses = {
      correct: isCorrect ? stats.parentheses.correct + 1 : stats.parentheses.correct,
      incorrect: !isCorrect ? stats.parentheses.incorrect + 1 : stats.parentheses.incorrect,
    };
  }
  
  return stats;
};

// Update indentation stats
export const updateIndentationStats = (
  expectedIndent: string, 
  actualIndent: string,
  prevStats: SpecialCharStats
): SpecialCharStats => {
  const stats = { ...prevStats };
  
  if (expectedIndent === actualIndent) {
    stats.indentation = {
      correct: stats.indentation.correct + 1,
      incorrect: stats.indentation.incorrect
    };
  } else {
    stats.indentation = {
      correct: stats.indentation.correct,
      incorrect: stats.indentation.incorrect + 1
    };
  }
  
  return stats;
};
