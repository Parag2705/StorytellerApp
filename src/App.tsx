import React, { useState } from 'react';
import { AppProvider } from './contexts/AppContext';
import Dashboard from './components/Dashboard';
import WriteStory from './components/WriteStory';
import StoryTimeline from './components/StoryTimeline';
import Profile from './components/Profile';
import AchievementModal from './components/AchievementModal';
import Navigation from './components/Navigation';

type View = 'dashboard' | 'write' | 'timeline' | 'profile';

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentView} />;
      case 'write':
        return <WriteStory onBack={() => setCurrentView('dashboard')} />;
      case 'timeline':
        return <StoryTimeline onBack={() => setCurrentView('dashboard')} />;
      case 'profile':
        return <Profile onBack={() => setCurrentView('dashboard')} />;
      default:
        return <Dashboard onNavigate={setCurrentView} />;
    }
  };

  return (
    <AppProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <header className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-4">
              StoryTeller
            </h1>
            <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto">
              Your living memorial - capture life's moments, one story at a time
            </p>
          </header>

          <Navigation currentView={currentView} onNavigate={setCurrentView} />
          
          <main className="animate-fade-in">
            {renderCurrentView()}
          </main>

          <AchievementModal />
        </div>
      </div>
    </AppProvider>
  );
}

export default App;