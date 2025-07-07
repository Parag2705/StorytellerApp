import React, { createContext, useContext, useEffect, useState } from 'react';
import { Story, UserProfile, Achievement } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { calculateStreak, checkAchievements, getPointsForStory, calculateLevel } from '../utils/gameLogic';
import { format } from 'date-fns';

interface AppContextType {
  stories: Story[];
  profile: UserProfile;
  addStory: (story: Omit<Story, 'id' | 'date' | 'wordCount'>) => void;
  updateStory: (id: string, updates: Partial<Story>) => void;
  deleteStory: (id: string) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  newAchievements: Achievement[];
  clearNewAchievements: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultProfile: UserProfile = {
  name: '',
  joinDate: format(new Date(), 'yyyy-MM-dd'),
  currentStreak: 0,
  longestStreak: 0,
  totalStories: 0,
  totalWords: 0,
  level: 1,
  points: 0,
  badges: [],
  preferences: {
    reminderTime: '19:00',
    reminderEnabled: true,
    theme: 'auto',
    shareByDefault: false,
  },
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stories, setStories] = useLocalStorage<Story[]>('storyteller-stories', []);
  const [profile, setProfile] = useLocalStorage<UserProfile>('storyteller-profile', defaultProfile);
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);

  const addStory = (storyData: Omit<Story, 'id' | 'date' | 'wordCount'>) => {
    const wordCount = storyData.content.split(/\s+/).filter(word => word.length > 0).length;
    const newStory: Story = {
      ...storyData,
      id: crypto.randomUUID(),
      date: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      wordCount,
    };

    const updatedStories = [...stories, newStory];
    setStories(updatedStories);

    // Calculate points and update profile
    const points = getPointsForStory(wordCount);
    const newTotalWords = profile.totalWords + wordCount;
    const currentStreak = calculateStreak(updatedStories);
    const newLevel = calculateLevel(profile.points + points);

    const updatedProfile = {
      ...profile,
      currentStreak,
      longestStreak: Math.max(profile.longestStreak, currentStreak),
      totalStories: updatedStories.length,
      totalWords: newTotalWords,
      points: profile.points + points,
      level: newLevel,
    };

    setProfile(updatedProfile);

    // Check for new achievements
    const achievements = checkAchievements(updatedStories, updatedProfile);
    if (achievements.length > 0) {
      const newBadges = achievements.map(a => ({
        id: a.id,
        name: a.name,
        description: a.description,
        icon: a.icon,
        unlockedAt: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        rarity: 'common' as const,
      }));

      setProfile(prev => ({
        ...prev,
        badges: [...prev.badges, ...newBadges],
        points: prev.points + achievements.reduce((sum, a) => sum + a.points, 0),
      }));

      setNewAchievements(achievements);
    }
  };

  const updateStory = (id: string, updates: Partial<Story>) => {
    setStories(prev => prev.map(story => 
      story.id === id ? { ...story, ...updates } : story
    ));
  };

  const deleteStory = (id: string) => {
    setStories(prev => prev.filter(story => story.id !== id));
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const clearNewAchievements = () => {
    setNewAchievements([]);
  };

  // Recalculate streak and stats on stories change
  useEffect(() => {
    if (stories.length > 0) {
      const currentStreak = calculateStreak(stories);
      const totalWords = stories.reduce((sum, story) => sum + story.wordCount, 0);
      
      setProfile(prev => ({
        ...prev,
        currentStreak,
        longestStreak: Math.max(prev.longestStreak, currentStreak),
        totalStories: stories.length,
        totalWords,
      }));
    }
  }, [stories.length]);

  return (
    <AppContext.Provider
      value={{
        stories,
        profile,
        addStory,
        updateStory,
        deleteStory,
        updateProfile,
        newAchievements,
        clearNewAchievements,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};