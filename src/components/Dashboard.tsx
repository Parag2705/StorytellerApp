import React from 'react';
import { useApp } from '../contexts/AppContext';
import { 
  Trophy, 
  Flame, 
  BookOpen, 
  Target, 
  Calendar,
  TrendingUp,
  Star,
  PenTool,
  Clock
} from 'lucide-react';
import { format, isToday } from 'date-fns';
import { getRandomPrompt, calculateLevel, pointsForNextLevel } from '../utils/gameLogic';

interface DashboardProps {
  onNavigate: (view: 'dashboard' | 'write' | 'timeline' | 'profile') => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { stories, profile } = useApp();
  
  const todayStory = stories.find(story => isToday(new Date(story.date)));
  const recentStories = stories
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  const prompt = getRandomPrompt();
  const nextLevelPoints = pointsForNextLevel(profile.level);
  const progressPercentage = ((profile.points % (profile.level * profile.level * 100)) / (profile.level * profile.level * 100)) * 100;

  const stats = [
    {
      label: 'Current Streak',
      value: profile.currentStreak,
      icon: Flame,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
    },
    {
      label: 'Total Stories',
      value: profile.totalStories,
      icon: BookOpen,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Level',
      value: profile.level,
      icon: Trophy,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
    },
    {
      label: 'Total Words',
      value: profile.totalWords.toLocaleString(),
      icon: TrendingUp,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
          Welcome back{profile.name ? `, ${profile.name}` : ''}! 👋
        </h2>
        <p className="text-slate-600">
          {todayStory 
            ? "Great job! You've already shared a story today." 
            : "Ready to capture today's memories?"
          }
        </p>
      </div>

      {/* Level Progress */}
      <div className="story-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800">Level Progress</h3>
          <div className="flex items-center space-x-2 text-yellow-600">
            <Trophy size={20} />
            <span className="font-bold">Level {profile.level}</span>
          </div>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-3 mb-2">
          <div 
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p className="text-sm text-slate-600">
          {profile.points} / {nextLevelPoints} points to next level
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="story-card text-center">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${stat.bgColor} mb-3`}>
              <stat.icon className={stat.color} size={24} />
            </div>
            <div className="text-2xl font-bold text-slate-800 mb-1">{stat.value}</div>
            <div className="text-sm text-slate-600">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Daily Prompt or Today's Story */}
      {!todayStory ? (
        <div className="story-card bg-gradient-to-br from-primary-50 to-secondary-50 border-primary-200">
          <div className="flex items-start space-x-4">
            <div className="bg-primary-100 rounded-full p-3">
              <Target className="text-primary-600" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Today's Prompt</h3>
              <p className="text-slate-700 mb-4 italic">"{prompt}"</p>
              <button 
                onClick={() => onNavigate('write')}
                className="btn-primary inline-flex items-center space-x-2"
              >
                <PenTool size={18} />
                <span>Start Writing</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="story-card bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-start space-x-4">
            <div className="bg-green-100 rounded-full p-3">
              <Star className="text-green-600" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Today's Story Complete! 🎉</h3>
              <p className="text-slate-700 mb-2">
                <strong>"{todayStory.title}"</strong>
              </p>
              <p className="text-sm text-slate-600 mb-4">
                {todayStory.wordCount} words • {format(new Date(todayStory.date), 'h:mm a')}
              </p>
              <button 
                onClick={() => onNavigate('timeline')}
                className="btn-secondary inline-flex items-center space-x-2"
              >
                <Clock size={18} />
                <span>View Timeline</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recent Stories */}
      {recentStories.length > 0 && (
        <div className="story-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-800">Recent Stories</h3>
            <button 
              onClick={() => onNavigate('timeline')}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentStories.map((story) => (
              <div key={story.id} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-800 mb-1">{story.title}</h4>
                    <p className="text-sm text-slate-600 line-clamp-2 mb-2">
                      {story.content.substring(0, 150)}...
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-slate-500">
                      <span>{format(new Date(story.date), 'MMM d, yyyy')}</span>
                      <span>{story.wordCount} words</span>
                      <span className="capitalize">{story.category}</span>
                    </div>
                  </div>
                  {story.isFavorite && (
                    <Star className="text-yellow-500 fill-current" size={16} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button 
          onClick={() => onNavigate('write')}
          className="story-card text-left group hover:scale-105"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-primary-100 rounded-full p-3 group-hover:bg-primary-200 transition-colors">
              <PenTool className="text-primary-600" size={24} />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800">Write New Story</h4>
              <p className="text-sm text-slate-600">Capture today's moment</p>
            </div>
          </div>
        </button>
        
        <button 
          onClick={() => onNavigate('timeline')}
          className="story-card text-left group hover:scale-105"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-secondary-100 rounded-full p-3 group-hover:bg-secondary-200 transition-colors">
              <Clock className="text-secondary-600" size={24} />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800">View Timeline</h4>
              <p className="text-sm text-slate-600">Browse your memories</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;