
import { LanguageOption } from "@/types";

export const languageOptions: LanguageOption[] = [
  { id: "js", name: "JavaScript", value: "javascript", category: "scripting" },
  { id: "ts", name: "TypeScript", value: "typescript", category: "scripting" },
  { id: "py", name: "Python", value: "python", category: "scripting" },
  { id: "java", name: "Java", value: "java", category: "compiled" },
  { id: "cpp", name: "C++", value: "cpp", category: "compiled" },
  { id: "rust", name: "Rust", value: "rust", category: "compiled" },
  { id: "go", name: "Go", value: "go", category: "compiled" },
  { id: "csharp", name: "C#", value: "csharp", category: "compiled" },
  { id: "ruby", name: "Ruby", value: "ruby", category: "scripting" },
  { id: "php", name: "PHP", value: "php", category: "scripting" },
  { id: "swift", name: "Swift", value: "swift", category: "compiled" },
  { id: "kotlin", name: "Kotlin", value: "kotlin", category: "compiled" },
  { id: "sql", name: "SQL", value: "sql", category: "data" },
  { id: "html", name: "HTML", value: "html", category: "markup" },
  { id: "css", name: "CSS", value: "css", category: "markup" },
];

// Group languages by category
export const getLanguagesByCategory = () => {
  const categories: Record<string, LanguageOption[]> = {};
  
  languageOptions.forEach(lang => {
    if (!categories[lang.category]) {
      categories[lang.category] = [];
    }
    categories[lang.category].push(lang);
  });
  
  return categories;
};

