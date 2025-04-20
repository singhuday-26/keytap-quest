
import { supabase } from "@/integrations/supabase/client";
import { UserPreferences } from "@/types";

export async function getUserPreferences(userId: string): Promise<UserPreferences | null> {
  const { data, error } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      // No preferences found for this user, return null
      return null;
    }
    console.error("Error fetching user preferences:", error);
    throw error;
  }
  
  // Convert from database schema to app types
  const preferences: UserPreferences = {
    theme: data.theme as 'light' | 'dark' | 'system',
    fontSize: 'medium', // Default
    keyboardSounds: data.keyboard_sounds,
    showLineNumbers: data.show_line_numbers,
    testDuration: 60, // Default
    autoComplete: false, // Default
    includeComments: true, // Default
  };
  
  // Map font size from number to string
  if (data.font_size <= 12) preferences.fontSize = 'small';
  else if (data.font_size >= 16) preferences.fontSize = 'large';
  else preferences.fontSize = 'medium';
  
  return preferences;
}

export async function saveUserPreferences(userId: string, preferences: UserPreferences): Promise<void> {
  // Convert from app types to database schema
  let fontSize = 14;
  if (preferences.fontSize === 'small') fontSize = 12;
  if (preferences.fontSize === 'large') fontSize = 16;
  
  const { error } = await supabase
    .from('user_preferences')
    .upsert({
      user_id: userId,
      theme: preferences.theme,
      font_size: fontSize,
      keyboard_sounds: preferences.keyboardSounds,
      show_line_numbers: preferences.showLineNumbers,
    }, {
      onConflict: 'user_id'
    });
  
  if (error) {
    console.error("Error saving user preferences:", error);
    throw error;
  }
}
