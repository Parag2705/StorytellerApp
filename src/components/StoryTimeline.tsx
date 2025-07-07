import React, { useState, useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { 
  ArrowLeft, 
  Star, 
  Calendar, 
  Search,
  Filter,
  Edit,
  Trash2,
  Heart,
  Share,
  Clock
} from 'lucide-react';
import { format, parseISO, isValid } from 'date-fns';
import { Story, StoryCategory } from '../types';

interface StoryTimelineProps {
  onBack: () => void;
}

const StoryTimeline: React.FC<StoryTimelineProps> = ({ onBack }) => {
  const { stories, updateStory, deleteStory } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<StoryCategory | 'all'>('all');
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [editingStory, setEditingStory] = useState<Story | null>(null);

  const categories: { value: StoryCategory | 'all'; label: string; icon: string }[] = [
    { value: 'all', label: 'All Stories', icon: '📚' },
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

  const filteredStories = useMemo(() => {
    return stories
      .filter(story => {
        const matchesSearch = story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            story.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            story.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = filterCategory === 'all' || story.category === filterCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [stories, searchTerm, filterCategory]);

  const handleToggleFavorite = (story: Story) => {
    updateStory(story.id, { isFavorite: !story.isFavorite });
  };

  const handleDelete = (story: Story) => {
    if (window.confirm('Are you sure you want to delete this story?')) {
      deleteStory(story.id);
      setSelectedStory(null);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      if (isValid(date)) {
        return format(date, 'EEEE, MMMM d, yyyy \'at\' h:mm a');
      }
      return 'Invalid date';
    } catch {
      return 'Invalid date';
    }
  };

  if (selectedStory) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => setSelectedStory(null)}
            className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Timeline</span>
          </button>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleToggleFavorite(selectedStory)}
              className={`p-2 rounded-lg transition-colors ${
                selectedStory.isFavorite 
                  ? 'text-yellow-500 bg-yellow-50 hover:bg-yellow-100' 
                  : 'text-slate-400 hover:text-yellow-500 hover:bg-yellow-50'
              }`}
            >
              <Star size={20} className={selectedStory.isFavorite ? 'fill-current' : ''} />
            </button>
            <button
              onClick={() => handleDelete(selectedStory)}
              className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>

        <div className="story-card">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-slate-800 mb-4">{selectedStory.title}</h1>
            <div className="flex items-center space-x-4 text-sm text-slate-600 mb-4">
              <div className="flex items-center space-x-1">
                <Calendar size={16} />
                <span>{formatDate(selectedStory.date)}</span>
              </div>
              <span>{selectedStory.wordCount} words</span>
              <span className="capitalize">{selectedStory.category}</span>
              <span className="capitalize">{selectedStory.mood}</span>
            </div>
            {selectedStory.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedStory.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          <div className="prose prose-slate max-w-none">
            {selectedStory.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4 text-slate-700 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Dashboard</span>
        </button>
        <div className="text-slate-600">
          {filteredStories.length} {filteredStories.length === 1 ? 'story' : 'stories'}
        </div>
      </div>

      {/* Filters */}
      <div className="story-card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search stories, tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as StoryCategory | 'all')}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all appearance-none bg-white"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.icon} {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stories Grid */}
      {filteredStories.length === 0 ? (
        <div className="story-card text-center py-12">
          <Clock className="mx-auto text-slate-400 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-slate-600 mb-2">No stories found</h3>
          <p className="text-slate-500">
            {searchTerm || filterCategory !== 'all' 
              ? 'Try adjusting your search or filter criteria.' 
              : 'Start writing your first story to see it here!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map((story) => (
            <div
              key={story.id}
              onClick={() => setSelectedStory(story)}
              className="story-card cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-slate-800 group-hover:text-primary-600 transition-colors line-clamp-2">
                  {story.title}
                </h3>
                {story.isFavorite && (
                  <Star className="text-yellow-500 fill-current flex-shrink-0 ml-2" size={16} />
                )}
              </div>
              
              <p className="text-sm text-slate-600 line-clamp-3 mb-4">
                {story.content}
              </p>
              
              <div className="flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center space-x-2">
                  <span>{format(parseISO(story.date), 'MMM d, yyyy')}</span>
                  <span>•</span>
                  <span>{story.wordCount} words</span>
                </div>
                <span className="capitalize">{story.category}</span>
              </div>
              
              {story.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {story.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                  {story.tags.length > 3 && (
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                      +{story.tags.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StoryTimeline;