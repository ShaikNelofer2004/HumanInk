import React, { useState } from 'react';
import Home from './components/Home';
import Workspace from './components/Workspace';
import Extraction from './components/Extraction';
import './App.css';

function App() {
  // States: 'HOME', 'EXTRACTION', 'WORKSPACE'
  const [currentView, setCurrentView] = useState('HOME');
  const [userProfile, setUserProfile] = useState(null);

  const startSetup = () => {
    setCurrentView('EXTRACTION');
  };

  const goHome = () => {
    setCurrentView('HOME');
  };

  const skipSetup = () => {
    setUserProfile({ archetype: 'Guest', tone: 'Neutral' }); // Default fallback profile
    setCurrentView('WORKSPACE');
  };

  const handleProfileComplete = (profile) => {
    setUserProfile(profile);
    setCurrentView('WORKSPACE');
  };

  return (
    <div className="relative w-full min-h-screen text-white overflow-hidden">
      {currentView === 'HOME' && <Home onStartSetup={startSetup} />}
      
      {currentView === 'EXTRACTION' && (
        <Extraction onComplete={handleProfileComplete} onGoHome={goHome} onSkip={skipSetup} />
      )}

      {currentView === 'WORKSPACE' && (
        <Workspace userProfile={userProfile} onGoHome={goHome} />
      )}
    </div>
  );
}

export default App;
