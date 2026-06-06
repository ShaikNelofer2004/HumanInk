import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import Home from './components/Home';
import Workspace from './components/Workspace';
import Extraction from './components/Extraction';
import ProfileDashboard from './components/ProfileDashboard';
import './App.css';

function App() {
  // States: 'HOME', 'EXTRACTION', 'WORKSPACE', 'PROFILE'
  const [currentView, setCurrentView] = useState('HOME');
  const [userProfileData, setUserProfileData] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [workspaceState, setWorkspaceState] = useState({
    inputText: '',
    outputText: '',
    status: 'System Idle',
    score: 0,
    activeNode: null,
    detectedSection: null,
    sectionOverride: '',
    paraphraseDepth: 1
  });
  
  const { isSignedIn, getToken } = useAuth();

  useEffect(() => {
    // When user logs out, reset view
    if (isSignedIn === false) {
      setCurrentView('HOME');
      setUserProfileData(null);
    }
    
    // When user logs in, fetch their DNA profile
    if (isSignedIn === true && currentView === 'HOME') {
      const fetchSavedProfile = async () => {
        setIsLoadingProfile(true);
        try {
          const token = await getToken();
          const response = await fetch('http://localhost:8000/api/profiles', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (response.ok) {
            const data = await response.json();
            if (data.profileData && data.profileData.profiles && data.profileData.profiles.length > 0) {
              setUserProfileData(data.profileData);
              setCurrentView('WORKSPACE');
            } else {
              setCurrentView('EXTRACTION');
            }
          } else {
             setCurrentView('EXTRACTION');
          }
        } catch (e) {
          console.error("Error fetching saved profile:", e);
          setCurrentView('EXTRACTION');
        } finally {
          setIsLoadingProfile(false);
        }
      };
      
      fetchSavedProfile();
    }
  }, [isSignedIn, currentView, getToken]);

  const startSetup = () => {
    if (userProfileData && userProfileData.profiles.length > 0) {
      setCurrentView('WORKSPACE');
    } else {
      setCurrentView('EXTRACTION');
    }
  };

  const goHome = () => {
    setCurrentView('HOME');
  };
  
  const goProfile = () => {
    setCurrentView('PROFILE');
  }

  const skipSetup = () => {
    setUserProfileData({
      version: 2,
      activeProfileId: "guest",
      profiles: [{ id: "guest", name: "Guest", archetype: 'Guest', tone: 'Neutral' }]
    }); 
    setCurrentView('WORKSPACE');
  };

  const handleProfileComplete = async (profile) => {
    if (isSignedIn) {
      try {
        const token = await getToken();
        const res = await fetch('http://localhost:8000/api/profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ profile: { ...profile, name: profile.archetype } })
        });
        if (res.ok) {
          const data = await res.json();
          setUserProfileData(data.profileData);
        }
      } catch (e) {
        console.error("Save profile error:", e);
      }
    } else {
      // Mock for guests
      setUserProfileData({
        version: 2,
        activeProfileId: "guest",
        profiles: [{ ...profile, id: "guest", name: profile.archetype }]
      });
    }
    setCurrentView('WORKSPACE');
  };

  const activeProfile = userProfileData?.profiles?.find(p => p.id === userProfileData.activeProfileId) || null;

  return (
    <div className="relative w-full min-h-screen text-white overflow-hidden bg-[#0a0a0c]">
      {currentView === 'HOME' && <Home onStartSetup={startSetup} isLoading={isLoadingProfile} />}
      
      {currentView === 'EXTRACTION' && (
        <Extraction onComplete={handleProfileComplete} onGoHome={goHome} onSkip={skipSetup} />
      )}

      {currentView === 'WORKSPACE' && (
        <Workspace userProfile={activeProfile} onGoHome={goHome} onOpenProfile={goProfile} workspaceState={workspaceState} setWorkspaceState={setWorkspaceState} />
      )}
      
      {currentView === 'PROFILE' && (
        <ProfileDashboard 
          userProfileData={userProfileData} 
          setUserProfileData={setUserProfileData} 
          onBackToWorkspace={() => setCurrentView('WORKSPACE')}
          onAddNewDNA={() => setCurrentView('EXTRACTION')}
        />
      )}
    </div>
  );
}

export default App;
