
import React from "react";
import ThemeToggle from "./ThemeToggle";
import LanguageSelector from "./LanguageSelector";
import { Keyboard, Code, CircleUser } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
}

const Header: React.FC<HeaderProps> = ({ selectedLanguage, onLanguageChange }) => {
  return (
    <header className="container mx-auto py-4 flex justify-between items-center border-b">
      <div className="flex items-center gap-2">
        <Code className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-bold">TypeCode</h1>
        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full hidden sm:inline-block">
          Beta
        </span>
      </div>
      <div className="flex items-center gap-4">
        <LanguageSelector 
          selectedLanguage={selectedLanguage}
          onLanguageChange={onLanguageChange} 
        />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="icon" className="rounded-full" aria-label="User profile">
            <CircleUser className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
