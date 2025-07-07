import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { 
  ArrowLeft, 
  Save, 
  Lightbulb, 
  RefreshCw,
  Heart,
  Smile,
  Clock,
  Award,
  User,
  MapPin
} from 'lucide-react';
import { StoryCategory, Mood } from '../types';
import { getRandomPrompt } from '../utils/gameLogic';

interface WriteStoryProps {
  onBack: () => void;
}

const WriteStory: React.FC<WriteStoryProps> = ({ onBack }) => {
  const { addStory } = useApp();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<StoryCategory>('memories');
  const [mood, setMood] = useState<Mood>('reflective');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [prompt, setPrompt] = useState(getRandomPrompt());
  const [isFavorite, setIsFavorite] = useState(false);

  const categories: { value: StoryCategory; label: string; icon: string }[] = [
    { value: 'childhood', label: 'Childhood', icon: '🧸' },
    { value: 'career', label: 'Career', icon: '💼' },
    { value: 'relationships', label: 'Relationships', icon: '❤️' },
    { value: 'adventures', label: 'Adventures', icon: '🌍' },
    { value: 'achievements', label: 'Achievements', icon: '🏆' },
    { value: 'challenges', label: 'Challenges', icon: '💪' },
    { value: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦' },
    { value: 'hobbies', label: 'Hobbies', icon: '🎨' },
    { value: 'travel', label: 'Travel', icon: '✈️' },
    { value: 'lessons', label: 'Lessons', icon: '📚' },
    { value: 'memories', label: 'Memories', icon: '💭' },
    { value: 'dreams', label: 'Dreams', icon: '⭐' },
  ];

  const moods: { value: Mood; label: string; icon: string; color: string }[] = [
    { value: 'joyful', label: 'Joyful', icon: '😊', color: 'text-yellow-500' },
    { value: 'grateful', label: 'Grateful', icon: '🙏', color: 'text-green-500' },
    { value: 'nostalgic', label: 'Nostalgic', icon: '🕰️', color: 'text-blue-500' },
    { value: 'proud', label: 'Proud', icon: '🦾', color: 'text-purple-500' },
    { value: 'reflective', label: 'Reflective', icon: '🤔', color: 'text-slate-500' },
    { value: 'bittersweet', label: 'Bittersweet', icon: '😢', color: 'text-indigo-500' },
    { value: 'hopeful', label: 'Hopeful', icon: '🌅', color: 'text-orange-500' },
    { value: 'peaceful', label: 'Peaceful', icon: '☮️', color: 'text-teal-500' },
  ];

  const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return;

    addStory({
      title: title.trim(),
      content: content.trim(),
      category,
      mood,
      tags,
      isFavorite,
    });

    onBack();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      handleAddTag();
    }
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
        <div className="flex items-center space-x-4">
          <span className="text-sm text-slate-600">{wordCount} words</span>
          <button
            onClick={handleSubmit}
            disabled={!title.trim() || !content.trim()}
            className="btn-primary inline-flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={18} />
            <span>Save Story</span>
          </button>
        </div>
      </div>

      {/* Prompt Section */}
      <div className="story-card bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
        <div className="flex items-start space-x-4">
          <div className="bg-amber-100 rounded-full p-3">
            <Lightbulb className="text-amber-600" size={24} />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-slate-800">Writing Prompt</h3>
              <button 
                onClick={() => setPrompt(getRandomPrompt(category))}
                className="text-amber-600 hover:text-amber-700 transition-colors"
              >
                <RefreshCw size={18} />
              </button>
            </div>
            <p className="text-slate-700 italic">"{prompt}"</p>
          </div>
        </div>
      </div>

      {/* Story Form */}
      <div className="story-card">
        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Story Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your story a memorable title..."
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Category and Mood */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Category
              </label>
              <div className="grid grid-cols-3 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setCategory(cat.value)}
                    className={`
                      p-3 rounded-lg border-2 transition-all text-sm font-medium
                      ${category === cat.value
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                      }
                    `}
                  >
                    <div className="text-lg mb-1">{cat.icon}</div>
                    <div>{cat.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Mood
              </label>
              <div className="grid grid-cols-2 gap-2">
                {moods.map((m) => (
                  <button
                    key={m.value}
                    onClick={() => setMood(m.value)}
                    className={`
                      p-3 rounded-lg border-2 transition-all text-sm font-medium flex items-center space-x-2
                      ${mood === m.value
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                      }
                    `}
                  >
                    <span className="text-lg">{m.icon}</span>
                    <span>{m.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Your Story
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing your story here... Let the memories flow..."
              rows={12}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tags (optional)
            </label>
            <div className="flex items-center space-x-2 mb-3">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a tag..."
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
              <button
                onClick={handleAddTag}
                disabled={!tagInput.trim()}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors disabled:opacity-50"
              >
                Add
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center space-x-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                  >
                    <span>{tag}</span>
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="text-primary-500 hover:text-primary-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Favorite Toggle */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-all
                ${isFavorite
                  ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                  : 'border-slate-300 text-slate-600 hover:border-slate-400'
                }
              `}
            >
              <Heart 
                size={18} 
                className={isFavorite ? 'fill-current' : ''} 
              />
              <span>Mark as Favorite</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WriteStory;