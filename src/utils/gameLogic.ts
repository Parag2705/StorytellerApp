import { Story, UserProfile, Achievement, Badge } from '../types';
import { format, isToday, differenceInDays, startOfDay } from 'date-fns';

export const calculateLevel = (points: number): number => {
  return Math.floor(Math.sqrt(points / 100)) + 1;
};

export const pointsForNextLevel = (currentLevel: number): number => {
  return (currentLevel * currentLevel) * 100;
};

export const getPointsForStory = (wordCount: number): number => {
  const basePoints = 10;
  const wordBonus = Math.floor(wordCount / 50) * 5; // 5 points per 50 words
  const maxWordBonus = 50; // Cap at 50 bonus points
  return basePoints + Math.min(wordBonus, maxWordBonus);
};

export const calculateStreak = (stories: Story[]): number => {
  if (stories.length === 0) return 0;
  
  const sortedStories = stories.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  let streak = 0;
  let currentDate = new Date();
  
  // Check if there's a story today
  const todayStory = sortedStories.find(story => 
    isToday(new Date(story.date))
  );
  
  if (!todayStory) {
    // Check if there's a story yesterday
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStory = sortedStories.find(story => 
      format(new Date(story.date), 'yyyy-MM-dd') === format(yesterday, 'yyyy-MM-dd')
    );
    
    if (!yesterdayStory) return 0;
    currentDate = yesterday;
  }
  
  // Count consecutive days
  for (let i = 0; i < sortedStories.length; i++) {
    const storyDate = startOfDay(new Date(sortedStories[i].date));
    const targetDate = startOfDay(currentDate);
    
    if (format(storyDate, 'yyyy-MM-dd') === format(targetDate, 'yyyy-MM-dd')) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else if (differenceInDays(targetDate, storyDate) > 0) {
      break;
    }
  }
  
  return streak;
};

export const checkAchievements = (
  stories: Story[], 
  profile: UserProfile
): Achievement[] => {
  const newAchievements: Achievement[] = [];
  
  const achievements: Achievement[] = [
    {
      id: 'first-story',
      name: 'First Chapter',
      description: 'Write your very first story',
      condition: 'stories >= 1',
      icon: '📝',
      points: 50,
      isUnlocked: stories.length >= 1,
    },
    {
      id: 'week-warrior',
      name: 'Week Warrior',
      description: 'Maintain a 7-day writing streak',
      condition: 'streak >= 7',
      icon: '🔥',
      points: 100,
      isUnlocked: profile.currentStreak >= 7,
    },
    {
      id: 'month-master',
      name: 'Month Master',
      description: 'Maintain a 30-day writing streak',
      condition: 'streak >= 30',
      icon: '👑',
      points: 500,
      isUnlocked: profile.currentStreak >= 30,
    },
    {
      id: 'wordsmith',
      name: 'Wordsmith',
      description: 'Write a story with 500+ words',
      condition: 'single story >= 500 words',
      icon: '✍️',
      points: 75,
      isUnlocked: stories.some(story => story.wordCount >= 500),
    },
    {
      id: 'novelist',
      name: 'Novelist',
      description: 'Write 10,000 total words',
      condition: 'total words >= 10000',
      icon: '📚',
      points: 200,
      isUnlocked: profile.totalWords >= 10000,
    },
    {
      id: 'memory-keeper',
      name: 'Memory Keeper',
      description: 'Write 50 stories',
      condition: 'stories >= 50',
      icon: '💭',
      points: 300,
      isUnlocked: stories.length >= 50,
    },
    {
      id: 'storyteller',
      name: 'Master Storyteller',
      description: 'Write 100 stories',
      condition: 'stories >= 100',
      icon: '🎭',
      points: 1000,
      isUnlocked: stories.length >= 100,
    },
    {
      id: 'diverse-tales',
      name: 'Diverse Tales',
      description: 'Write stories in 5 different categories',
      condition: 'categories >= 5',
      icon: '🌈',
      points: 150,
      isUnlocked: new Set(stories.map(s => s.category)).size >= 5,
    },
  ];
  
  // Check for newly unlocked achievements
  const currentBadgeIds = profile.badges.map(b => b.id);
  
  return achievements.filter(achievement => 
    achievement.isUnlocked && !currentBadgeIds.includes(achievement.id)
  );
};

export const getRandomPrompt = (category?: string): string => {
  const prompts = {
    childhood: [
      "What was your favorite hiding spot as a child?",
      "Describe a childhood friend who made a lasting impact on you.",
      "What was the most trouble you ever got into as a kid?",
      "Tell about a family tradition from your childhood.",
      "What was your favorite toy and why?",
    ],
    career: [
      "Describe your first job and what you learned from it.",
      "Tell about a mentor who shaped your career.",
      "What was your biggest professional challenge?",
      "Describe a moment when you felt proud of your work.",
      "What career advice would you give your younger self?",
    ],
    relationships: [
      "How did you meet your best friend?",
      "Describe a moment when someone showed you unexpected kindness.",
      "Tell about a relationship that changed your perspective on life.",
      "What's the best advice about relationships you've ever received?",
      "Describe a time when you had to forgive someone.",
    ],
    adventures: [
      "Tell about the most spontaneous thing you've ever done.",
      "Describe a time when you stepped out of your comfort zone.",
      "What's the most beautiful place you've ever visited?",
      "Tell about an adventure that didn't go as planned.",
      "Describe a moment when you felt truly alive.",
    ],
    family: [
      "What's a family story that gets told at every gathering?",
      "Describe a tradition your family has.",
      "Tell about a lesson you learned from a family member.",
      "What's something unique about your family?",
      "Describe a family member who influenced you greatly.",
    ],
  };
  
  const allPrompts = Object.values(prompts).flat();
  const categoryPrompts = category && prompts[category as keyof typeof prompts] 
    ? prompts[category as keyof typeof prompts] 
    : allPrompts;
  
  return categoryPrompts[Math.floor(Math.random() * categoryPrompts.length)];
};