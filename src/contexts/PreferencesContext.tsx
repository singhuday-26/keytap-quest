
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserPreferences, saveUserPreferences } from '@/services/preferencesService';
import { UserPreferences } from '@/types';
import { useToast } from '@/components/ui/use-toast';

// Default preferences
const defaultPreferences: UserPreferences = {
  theme: 'system',
  fontSize: 'medium',
  keyboardSounds: false,
  showLineNumbers: true,
  testDuration: 60,
  autoComplete: false,
  includeComments: true,
};

interface PreferencesContextType {
  preferences: UserPreferences;
  isLoading: boolean;
  updatePreferences: (newPreferences: Partial<UserPreferences>) => Promise<void>;
  resetPreferences: () => void;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(false);

  // Load preferences when user changes
  useEffect(() => {
    if (!user) {
      // Reset to defaults if not logged in
      setPreferences(defaultPreferences);
      return;
    }

    async function loadPreferences() {
      setIsLoading(true);
      try {
        const userPrefs = await getUserPreferences(user.id);
        if (userPrefs) {
          setPreferences(userPrefs);
        } else {
          // No preferences found, use defaults
          setPreferences(defaultPreferences);
        }
      } catch (error) {
        console.error('Failed to load preferences:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your preferences',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadPreferences();
  }, [user]);

  // Update preferences
  const updatePreferences = async (newPreferences: Partial<UserPreferences>) => {
    const updatedPreferences = { ...preferences, ...newPreferences };
    setPreferences(updatedPreferences);

    // Save to database if logged in
    if (user) {
      try {
        await saveUserPreferences(user.id, updatedPreferences);
        toast({
          title: 'Preferences saved',
          description: 'Your preferences have been updated',
        });
      } catch (error) {
        console.error('Failed to save preferences:', error);
        toast({
          title: 'Error',
          description: 'Failed to save your preferences',
          variant: 'destructive',
        });
      }
    }
  };

  // Reset to defaults
  const resetPreferences = () => {
    setPreferences(defaultPreferences);
    if (user) {
      saveUserPreferences(user.id, defaultPreferences).catch(console.error);
    }
  };

  return (
    <PreferencesContext.Provider
      value={{
        preferences,
        isLoading,
        updatePreferences,
        resetPreferences,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
}
