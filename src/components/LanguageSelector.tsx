
import React from "react";
import { languageOptions } from "@/data/languages";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onLanguageChange,
}) => {
  return (
    <div className="w-[180px]">
      <Select value={selectedLanguage} onValueChange={onLanguageChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select Language" />
        </SelectTrigger>
        <SelectContent>
          {languageOptions.map((language) => (
            <SelectItem key={language.id} value={language.value}>
              {language.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;
