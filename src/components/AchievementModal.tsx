import React, { useEffect, useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { X, Trophy, Star } from 'lucide-react';

const AchievementModal: React.FC = () => {
  const { newAchievements, clearNewAchievements } = useApp();
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (newAchievements.length > 0) {
      setIsVisible(true);
      setCurrentIndex(0);
    }
  }, [newAchievements]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      clearNewAchievements();
    }, 300);
  };

  const handleNext = () => {
    if (currentIndex < newAchievements.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleClose();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (newAchievements.length === 0 || !isVisible) {
    return null;
  }

  const currentAchievement = newAchievements[currentIndex];

  return (
    <div className={`
      fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm
      transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}
    `}>
      <div className={`
        relative max-w-md w-full bg-white rounded-2xl shadow-2xl
        transform transition-all duration-300 ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}
      `}>
        {/* Header */}
        <div className="relative p-6 pb-0">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-lg hover:bg-slate-100"
          >
            <X size={20} />
          </button>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full mb-4 animate-bounce-gentle">
              <Trophy className="text-white" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Achievement Unlocked!</h2>
            <p className="text-slate-600">Congratulations on your progress!</p>
          </div>
        </div>

        {/* Achievement Details */}
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4 animate-bounce-gentle">
              {currentAchievement.icon}
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              {currentAchievement.name}
            </h3>
            <p className="text-slate-600 mb-4">
              {currentAchievement.description}
            </p>
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full text-white font-semibold">
              <Star size={16} />
              <span>{currentAchievement.points} points earned!</span>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <div className="flex space-x-1">
              {newAchievements.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-primary-500' : 'bg-slate-300'
                  }`}
                />
              ))}
            </div>
            
            <div className="flex items-center space-x-2">
              {currentIndex > 0 && (
                <button
                  onClick={handlePrevious}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
                >
                  Previous
                </button>
              )}
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all font-medium"
              >
                {currentIndex === newAchievements.length - 1 ? 'Continue' : 'Next'}
              </button>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden rounded-2xl">
          <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-yellow-200 to-yellow-300 rounded-full opacity-20"></div>
          <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-primary-200 to-primary-300 rounded-full opacity-20"></div>
        </div>
      </div>
    </div>
  );
};

export default AchievementModal;