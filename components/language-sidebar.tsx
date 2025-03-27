"use client"
import { cn } from "@/lib/utils"
import { languageOptions } from "@/lib/language-options"

interface LanguageSidebarProps {
  selectedLanguage: any
  onLanguageChange: (language: any) => void
}

export default function LanguageSidebar({ selectedLanguage, onLanguageChange }: LanguageSidebarProps) {
  return (
    <div className="w-14 border-r bg-muted/20 flex flex-col">
      {languageOptions.map((language) => (
        <button
          key={language.id}
          className={cn(
            "w-full aspect-square flex items-center justify-center hover:bg-muted/50 transition-colors",
            selectedLanguage.id === language.id && "bg-primary text-primary-foreground",
          )}
          onClick={() => onLanguageChange(language)}
          title={language.name}
        >
          <div className="w-8 h-8 flex items-center justify-center">{language.icon}</div>
        </button>
      ))}
    </div>
  )
}

