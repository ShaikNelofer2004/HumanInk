import React, { useState, useEffect } from 'react';
import { useClerk, useUser, useAuth } from '@clerk/clerk-react';
import { ArrowLeft, LogOut, Database, Shield, Terminal, Plus, Trash2, CheckCircle2 } from 'lucide-react';

const ProfileDashboard = ({ userProfileData, setUserProfileData, onBackToWorkspace, onAddNewDNA }) => {
  const clerk = useClerk();
  const { signOut } = clerk;
  const { user } = useUser();
  const { getToken, isSignedIn } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);
  const [profileToDelete, setProfileToDelete] = useState(null);

  useEffect(() => {
    // Trigger entry animation after initial render
    const t = setTimeout(() => setIsMounted(true), 10);
    return () => clearTimeout(t);
  }, []);

  const handleSignOut = () => {
    setIsExiting(true);
    setTimeout(() => signOut(), 500);
  };

  const handleBack = () => {
    setIsExiting(true);
    setTimeout(() => onBackToWorkspace(), 500);
  };

  const handleAddNew = () => {
    setIsExiting(true);
    setTimeout(() => onAddNewDNA(), 500);
  };

  const initiateDelete = (profileId) => {
    setProfileToDelete(profileId);
  };

  const confirmDelete = async () => {
    if (!profileToDelete) return;
    const profileId = profileToDelete;
    setProfileToDelete(null);

    if (!isSignedIn || profileId === 'guest') {
      const newProfiles = userProfileData.profiles.filter(p => p.id !== profileId);
      const newActive = userProfileData.activeProfileId === profileId 
        ? (newProfiles.length > 0 ? newProfiles[0].id : null) 
        : userProfileData.activeProfileId;
      setUserProfileData({ ...userProfileData, profiles: newProfiles, activeProfileId: newActive });
      return;
    }

    setIsDeleting(profileId);
    try {
      const token = await getToken();
      const res = await fetch(`http://localhost:8000/api/profile/${profileId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUserProfileData(data.profileData);
      }
    } catch (e) {
      console.error(e);
    }
    setIsDeleting(null);
  };

  const handleSetActive = async (profileId) => {
    if (!isSignedIn || profileId === 'guest') {
      setUserProfileData({ ...userProfileData, activeProfileId: profileId });
      return;
    }

    // Optimistic update
    setUserProfileData({ ...userProfileData, activeProfileId: profileId });
    try {
      const token = await getToken();
      await fetch('http://localhost:8000/api/profile/active', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ activeProfileId: profileId })
      });
    } catch (e) {
      console.error(e);
    }
  };

  const profiles = userProfileData?.profiles || [];
  const activeId = userProfileData?.activeProfileId;

  return (
    <div className={`w-full min-h-screen text-white bg-[#050505] flex flex-col items-center py-16 px-6 relative overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${(!isMounted || isExiting) ? 'opacity-0 scale-95 blur-md' : 'opacity-100 scale-100 blur-0'}`}>
      {/* Shared Background Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-ink-primary/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-ink-secondary/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />

      <div className="max-w-5xl w-full z-10 flex flex-col gap-8 flex-1">
        
        {/* Header Actions */}
        <div className="flex justify-between items-center w-full">
          <button 
            onClick={handleBack}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors font-medium text-sm text-gray-300 hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to Workspace
          </button>

          <button 
            onClick={handleSignOut}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-500/5 border border-red-500/10 text-red-400 font-medium text-sm hover:bg-red-500/10 hover:border-red-500/20 transition-colors"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>

        {/* User Identity Section */}
        {user && (
          <div className="bg-[#0a0a0c]/80 border border-white/10 rounded-3xl p-6 backdrop-blur-2xl shadow-xl flex items-center gap-5">
            <div className="relative">
              <img 
                src={user.imageUrl} 
                alt="Profile" 
                className="w-16 h-16 rounded-full border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
              />
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-[#0a0a0c] rounded-full"></div>
            </div>
            <div className="flex-1 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold font-outfit text-white tracking-wide">{user.fullName || user.firstName || 'Anonymous Writer'}</h2>
                <p className="text-gray-400 font-inter text-sm">{user.primaryEmailAddress?.emailAddress}</p>
              </div>
              <button 
                onClick={() => clerk.openUserProfile()}
                className="px-4 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-xs font-semibold text-gray-300 hover:text-white"
              >
                Manage Account
              </button>
            </div>
          </div>
        )}

        {/* DNA Profiles Header */}
        <div className="flex justify-between items-end mt-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-ink-primary/10 flex items-center justify-center border border-ink-primary/20">
              <Database className="text-ink-primary" size={20} />
            </div>
            <div>
              <h1 className="font-outfit font-bold text-3xl tracking-tight text-white">My DNA Profiles</h1>
              <p className="text-gray-500 font-inter text-sm">Manage your distinct writing personas.</p>
            </div>
          </div>
          <button 
            onClick={handleAddNew}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink-primary hover:bg-ink-primary/80 transition-colors text-white font-semibold text-sm shadow-[0_0_15px_rgba(139,92,246,0.3)]"
          >
            <Plus size={16} />
            Extract New DNA
          </button>
        </div>

        {/* Profile List */}
        <div className="flex flex-col gap-6">
          {profiles.length > 0 ? (
            profiles.map(profile => {
              const isActive = profile.id === activeId;
              return (
                <div key={profile.id} className={`bg-[#0a0a0c]/80 border ${isActive ? 'border-ink-primary/50 shadow-[0_0_20px_rgba(139,92,246,0.15)]' : 'border-white/10'} rounded-3xl p-8 backdrop-blur-2xl relative overflow-hidden flex flex-col gap-8 transition-colors duration-500`}>
                  {/* Subtle Grid Background */}
                  <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                  
                  <div className="relative z-10 flex justify-between items-center border-b border-white/5 pb-4">
                    <h3 className="font-outfit text-2xl font-bold text-white">{profile.name || profile.archetype || "Unnamed DNA"}</h3>
                    <div className="flex items-center gap-3">
                      {isActive ? (
                        <button 
                          onClick={() => {
                            handleSetActive(null);
                          }}
                          title="Click to deselect. The AI will use a default balanced style."
                          className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 hover:border-emerald-500/50 rounded-full text-emerald-400 text-xs font-semibold tracking-wide transition-colors"
                        >
                          <CheckCircle2 size={14} /> ACTIVE DNA
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleSetActive(profile.id)}
                          className="text-gray-400 hover:text-white font-mono text-xs uppercase tracking-widest bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-full transition-colors"
                        >
                          Set Active
                        </button>
                      )}
                      
                      <button 
                        onClick={() => initiateDelete(profile.id)}
                        disabled={isDeleting === profile.id}
                        className="text-red-400/50 hover:text-red-400 bg-red-500/5 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 p-1.5 rounded-full transition-colors disabled:opacity-50"
                        title="Delete Profile"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="relative z-10 grid grid-cols-1 md:grid-cols-5 gap-8">
                    {/* Left Column: Stats */}
                    <div className="md:col-span-2 flex flex-col gap-6">
                      <div>
                        <h3 className="text-xs text-gray-500 font-mono tracking-[0.2em] uppercase mb-2 flex items-center gap-2">
                          <Shield size={12} className={isActive ? "text-ink-primary" : "text-gray-500"} />
                          Archetype
                        </h3>
                        <div className="text-2xl font-bold text-white font-outfit">
                          {profile.archetype || "Unknown"}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-xs text-gray-500 font-mono tracking-[0.2em] uppercase mb-2 flex items-center gap-2">
                          <Terminal size={12} className={isActive ? "text-ink-secondary" : "text-gray-500"} />
                          Pitch Tone
                        </h3>
                        <div className="text-lg font-medium text-white font-inter">
                          {profile.tone || "Neutral"}
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Rules */}
                    <div className="md:col-span-3">
                      <h3 className="text-xs text-gray-500 font-mono tracking-[0.2em] uppercase mb-2">Style Instructions</h3>
                      <div className="bg-black/40 border border-white/5 rounded-xl p-5 text-gray-300 font-inter text-sm leading-relaxed max-h-[150px] overflow-y-auto custom-scrollbar">
                        {profile.style_instructions || "No custom instructions found."}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-20 bg-[#0a0a0c]/80 border border-white/5 rounded-3xl backdrop-blur-xl">
              <p className="text-gray-400 font-inter mb-2">No DNA Profiles found.</p>
              <button onClick={handleAddNew} className="text-sm text-ink-primary hover:underline">Extract your first DNA Profile</button>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {profileToDelete && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0a0a0c] border border-white/10 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl relative overflow-hidden flex flex-col gap-5 transform transition-all">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500/50 to-orange-500/50" />
            
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex-shrink-0 flex items-center justify-center border border-red-500/20">
                <Trash2 className="text-red-400" size={24} />
              </div>
              <div>
                <h3 className="font-outfit text-xl font-bold text-white mb-2">Delete DNA Profile?</h3>
                <p className="text-gray-400 font-inter text-sm leading-relaxed">
                  Are you sure you want to permanently delete this DNA profile? The Writer Agent will no longer be able to use this linguistic style. This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button 
                onClick={() => setProfileToDelete(null)}
                className="px-5 py-2.5 rounded-full border border-white/10 text-gray-300 font-medium text-sm hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="px-5 py-2.5 rounded-full bg-red-500 hover:bg-red-600 text-white font-medium text-sm shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all active:scale-95"
              >
                Delete Profile
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProfileDashboard;
