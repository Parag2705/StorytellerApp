import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { 
  ArrowLeft, 
  User,
  Trophy,
  Calendar,
  Target,
  Settings,
  Bell,
  Palette,
  Share,
  Edit2,
  Save,
  X
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { calculateLevel, pointsForNextLevel } from '../utils/gameLogic';

interface ProfileProps {
  onBack: () => void;
}

const Profile: React.FC<ProfileProps> = ({ onBack }) => {
  const { profile, updateProfile, stories } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: profile.name,
    reminderTime: profile.preferences.reminderTime,
    reminderEnabled: profile.preferences.reminderEnabled,
  });

  const daysSinceJoined = differenceInDays(new Date(), new Date(profile.joinDate));
  const nextLevelPoints = pointsForNextLevel(profile.level);
  const progressPercentage = ((profile.points % (profile.level * profile.level * 100)) / (profile.level * profile.level * 100)) * 100;

  const stats = [
    {
      label: 'Stories Written',
      value: profile.totalStories,
      icon: '📝',
      description: 'Total stories shared',
    },
    {
      label: 'Words Written',
      value: profile.totalWords.toLocaleString(),
      icon: '✍️',
      description: 'Total words written',
    },
    {
      label: 'Current Streak',
      value: `${profile.currentStreak} days`,
      icon: '🔥',
      description: 'Consecutive writing days',
    },
    {
      label: 'Longest Streak',
      value: `${profile.longestStreak} days`,
      icon: '🏆',
      description: 'Best writing streak',
    },
    {
      label: 'Member Since',
      value: `${daysSinceJoined} days`,
      icon: '📅',
      description: format(new Date(profile.joinDate), 'MMMM d, yyyy'),
    },
    {
      label: 'Average Words',
      value: profile.totalStories > 0 ? Math.round(profile.totalWords / profile.totalStories) : 0,
      icon: '📊',
      description: 'Words per story',
    },
  ];

  const recentBadges = profile.badges.slice(-6);

  const handleSave = () => {
    updateProfile({
      name: editForm.name,
      preferences: {
        ...profile.preferences,
        reminderTime: editForm.reminderTime,
        reminderEnabled: editForm.reminderEnabled,
      },
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm({
      name: profile.name,
      reminderTime: profile.preferences.reminderTime,
      reminderEnabled: profile.preferences.reminderEnabled,
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Dashboard</span>
        </button>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors"
          >
            <Edit2 size={18} />
            <span>Edit Profile</span>
          </button>
        )}
      </div>

      {/* Profile Header */}
      <div className="story-card">
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {profile.name ? profile.name.charAt(0).toUpperCase() : <User size={32} />}
          </div>
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your name"
                  className="text-2xl font-bold bg-transparent border-b-2 border-slate-300 focus:border-primary-500 outline-none transition-colors"
                />
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleSave}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <Save size={16} />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center space-x-2 px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors"
                  >
                    <X size={16} />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
                  {profile.name || 'Anonymous Storyteller'}
                </h1>
                <div className="flex items-center space-x-4 text-slate-600">
                  <div className="flex items-center space-x-2">
                    <Trophy className="text-yellow-500" size={18} />
                    <span>Level {profile.level}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Target className="text-primary-500" size={18} />
                    <span>{profile.points} points</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="text-green-500" size={18} />
                    <span>Joined {format(new Date(profile.joinDate), 'MMM yyyy')}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Level Progress */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">Level Progress</span>
            <span className="text-sm text-slate-600">
              {profile.points} / {nextLevelPoints} XP
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="story-card text-center">
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold text-slate-800 mb-1">{stat.value}</div>
            <div className="text-sm font-medium text-slate-700 mb-1">{stat.label}</div>
            <div className="text-xs text-slate-500">{stat.description}</div>
          </div>
        ))}
      </div>

      {/* Recent Achievements */}
      <div className="story-card">
        <h3 className="text-lg font-semibold text-slate-800 mb-6">Recent Achievements</h3>
        {recentBadges.length === 0 ? (
          <div className="text-center py-8">
            <Trophy className="mx-auto text-slate-400 mb-4" size={48} />
            <p className="text-slate-500">No achievements yet. Keep writing to unlock badges!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {recentBadges.map((badge) => (
              <div key={badge.id} className="text-center p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="text-3xl mb-2">{badge.icon}</div>
                <div className="font-semibold text-slate-800 text-sm mb-1">{badge.name}</div>
                <div className="text-xs text-slate-600 mb-2">{badge.description}</div>
                <div className="text-xs text-slate-500">
                  {format(new Date(badge.unlockedAt), 'MMM d, yyyy')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Settings */}
      <div className="story-card">
        <div className="flex items-center space-x-3 mb-6">
          <Settings className="text-slate-600" size={24} />
          <h3 className="text-lg font-semibold text-slate-800">Settings</h3>
        </div>

        <div className="space-y-6">
          {/* Reminder Settings */}
          <div className="border border-slate-200 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-4">
              <Bell className="text-blue-500" size={20} />
              <h4 className="font-medium text-slate-800">Daily Reminders</h4>
            </div>
            
            {isEditing ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="reminderEnabled"
                    checked={editForm.reminderEnabled}
                    onChange={(e) => setEditForm(prev => ({ ...prev, reminderEnabled: e.target.checked }))}
                    className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label htmlFor="reminderEnabled" className="text-sm text-slate-700">
                    Enable daily writing reminders
                  </label>
                </div>
                
                {editForm.reminderEnabled && (
                  <div className="ml-7">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Reminder Time
                    </label>
                    <input
                      type="time"
                      value={editForm.reminderTime}
                      onChange={(e) => setEditForm(prev => ({ ...prev, reminderTime: e.target.value }))}
                      className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="text-sm text-slate-600">
                {profile.preferences.reminderEnabled 
                  ? `Enabled at ${format(new Date(`2000-01-01T${profile.preferences.reminderTime}`), 'h:mm a')}`
                  : 'Disabled'
                }
              </div>
            )}
          </div>

          {/* Data Export */}
          <div className="border border-slate-200 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-4">
              <Share className="text-green-500" size={20} />
              <h4 className="font-medium text-slate-800">Export Data</h4>
            </div>
            <p className="text-sm text-slate-600 mb-4">
              Download all your stories and data as a JSON file.
            </p>
            <button 
              onClick={() => {
                const dataStr = JSON.stringify({
                  profile,
                  stories,
                  exportDate: new Date().toISOString(),
                }, null, 2);
                const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
                const exportFileDefaultName = `storyteller-backup-${format(new Date(), 'yyyy-MM-dd')}.json`;
                
                const linkElement = document.createElement('a');
                linkElement.setAttribute('href', dataUri);
                linkElement.setAttribute('download', exportFileDefaultName);
                linkElement.click();
              }}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
            >
              Export Stories
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;