import React from 'react';
import { Home, PenTool, Clock, User } from 'lucide-react';

interface NavigationProps {
  currentView: 'dashboard' | 'write' | 'timeline' | 'profile';
  onNavigate: (view: 'dashboard' | 'write' | 'timeline' | 'profile') => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onNavigate }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'write', label: 'Write Story', icon: PenTool },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'profile', label: 'Profile', icon: User },
  ] as const;

  return (
    <nav className="glass-morphism rounded-2xl p-2 mb-8 max-w-md mx-auto">
      <div className="flex space-x-1">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={`
              flex items-center justify-center space-x-2 px-4 py-3 rounded-xl transition-all duration-300 flex-1
              ${
                currentView === id
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                  : 'text-slate-600 hover:bg-white/50 hover:text-primary-600'
              }
            `}
          >
            <Icon size={20} />
            <span className="hidden sm:inline-block font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;