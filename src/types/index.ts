export interface Story {
  id: string;
  title: string;
  content: string;
  date: string;
  category: StoryCategory;
  mood: Mood;
  tags: string[];
  wordCount: number;
  isFavorite: boolean;
  shareId?: string;
}

export interface UserProfile {
  name: string;
  joinDate: string;
  currentStreak: number;
  longestStreak: number;
  totalStories: number;
  totalWords: number;
  level: number;
  points: number;
  badges: Badge[];
  preferences: UserPreferences;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface UserPreferences {
  reminderTime: string;
  reminderEnabled: boolean;
  theme: 'light' | 'dark' | 'auto';
  shareByDefault: boolean;
}

export interface DailyPrompt {
  id: string;
  text: string;
  category: StoryCategory;
  difficulty: 'easy' | 'medium' | 'hard';
}

export type StoryCategory = 
  | 'childhood'
  | 'career'
  | 'relationships'
  | 'adventures'
  | 'achievements'
  | 'challenges'
  | 'family'
  | 'hobbies'
  | 'travel'
  | 'lessons'
  | 'memories'
  | 'dreams';

export type Mood = 
  | 'joyful'
  | 'grateful'
  | 'nostalgic'
  | 'proud'
  | 'reflective'
  | 'bittersweet'
  | 'hopeful'
  | 'peaceful';

export interface GameStats {
  currentStreak: number;
  longestStreak: number;
  totalStories: number;
  wordsThisWeek: number;
  storiesThisMonth: number;
  averageWordsPerStory: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  condition: string;
  icon: string;
  points: number;
  isUnlocked: boolean;
  progress?: number;
  maxProgress?: number;
}