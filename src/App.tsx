import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text mb-4">
          StoryTeller
        </h1>
        <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto mb-8">
          Your living memorial - capture life's moments, one story at a time
        </p>
        <div className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl rounded-xl p-8">
          <p className="text-slate-700 mb-4">Welcome to StoryTeller!</p>
          <p className="text-sm text-slate-600">The app is loading successfully. 🎉</p>
        </div>
      </div>
    </div>
  );
}

export default App;