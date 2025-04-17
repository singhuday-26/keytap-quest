
import React from "react";
import ThemeToggle from "./ThemeToggle";
import LanguageSelector from "./LanguageSelector";
import { Keyboard } from "lucide-react";

interface HeaderProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
}

const Header: React.FC<HeaderProps> = ({ selectedLanguage, onLanguageChange }) => {
  return (
    <header className="container mx-auto py-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Keyboard className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-bold">KeyTap Quest</h1>
      </div>
      <div className="flex items-center gap-4">
        <LanguageSelector 
          selectedLanguage={selectedLanguage}
          onLanguageChange={onLanguageChange}
        />
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
