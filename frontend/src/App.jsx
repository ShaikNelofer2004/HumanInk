import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import Home from './components/Home';
import Workspace from './components/Workspace';
import Extraction from './components/Extraction';
import ProfileDashboard from './components/ProfileDashboard';
import './App.css';

function App() {
  // States: 'HOME', 'EXTRACTION', 'WORKSPACE', 'PROFILE'
  const [currentView, setCurrentView] = useState(() => sessionStorage.getItem('humanink_view') || 'HOME');
  const [userProfileData, setUserProfileData] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [hasFetchedProfile, setHasFetchedProfile] = useState(false);
  
  const [workspaceState, setWorkspaceState] = useState(() => {
    const saved = sessionStorage.getItem('humanink_workspace');
    if (saved) return JSON.parse(saved);
    return {
      inputText: '',
      outputText: '',
      status: 'System Idle',
      score: 0,
      activeNode: null,
      detectedSection: null,
      sectionOverride: '',
      paraphraseDepth: 1
    };
  });
  
  const { isSignedIn, getToken } = useAuth();

  useEffect(() => {
    sessionStorage.setItem('humanink_view', currentView);
  }, [currentView]);

  useEffect(() => {
    sessionStorage.setItem('humanink_workspace', JSON.stringify(workspaceState));
  }, [workspaceState]);

  useEffect(() => {
    // When user logs out, reset view
    if (isSignedIn === false) {
      setCurrentView('HOME');
      setUserProfileData(null);
      setHasFetchedProfile(false);
      sessionStorage.removeItem('humanink_view');
      sessionStorage.removeItem('humanink_workspace');
    }
    
    // When user logs in, fetch their DNA profile exactly once
    if (isSignedIn === true && !hasFetchedProfile) {
      const fetchSavedProfile = async () => {
        setIsLoadingProfile(true);
        try {
          const token = await getToken();
          const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/profiles`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (response.ok) {
            const data = await response.json();
            if (data.profileData) {
              setUserProfileData(data.profileData);
              if (data.profileData.profiles && data.profileData.profiles.length > 0) {
                // Override route if we are stuck on HOME or EXTRACTION.
                setCurrentView(prev => (prev === 'HOME' || prev === 'EXTRACTION') ? 'WORKSPACE' : prev);
              } else {
                // They definitely have 0 profiles
                setCurrentView(prev => prev === 'HOME' || prev === 'WORKSPACE' ? 'EXTRACTION' : prev);
              }
            }
          } else {
             console.error("Failed to fetch profiles, status:", response.status);
          }
        } catch (e) {
          console.error("Error fetching saved profile:", e);
        } finally {
          setIsLoadingProfile(false);
          setHasFetchedProfile(true);
        }
      };
      
      fetchSavedProfile();
    }
  }, [isSignedIn, getToken, hasFetchedProfile]);

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
    handleProfileComplete({ 
      id: "default", 
      archetype: 'Default Profile', 
      tone: 'Neutral', 
      style_instructions: 'Sentence Rhythm: Medium\nVocabulary: Standard\nTone: Neutral' 
    });
  };

  const handleProfileComplete = async (profile) => {
    if (isSignedIn) {
      try {
        const token = await getToken();
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/profile`, {
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
      setUserProfileData(prev => ({
        version: 2,
        activeProfileId: "guest",
        profiles: [{ ...profile, id: "guest", name: profile.archetype }],
        credits: prev?.credits ?? 10
      }));
    }
    setCurrentView('WORKSPACE');
  };

  const activeProfile = userProfileData?.profiles?.find(p => p.id === userProfileData.activeProfileId) || null;

  return (
    <div className="relative w-full min-h-screen text-white overflow-hidden bg-[#0a0a0c]">
      {currentView === 'HOME' && <Home onStartSetup={startSetup} isLoading={isLoadingProfile} hasProfiles={userProfileData && userProfileData.profiles?.length > 0} />}
      
      {currentView === 'EXTRACTION' && (
        <Extraction onComplete={handleProfileComplete} onGoHome={goHome} onSkip={skipSetup} />
      )}

      {currentView === 'WORKSPACE' && (
        <Workspace userProfile={activeProfile} userProfileData={userProfileData} setUserProfileData={setUserProfileData} onGoHome={goHome} onOpenProfile={goProfile} workspaceState={workspaceState} setWorkspaceState={setWorkspaceState} />
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
