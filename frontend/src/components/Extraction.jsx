import React, { useState, useEffect } from 'react';
import { Fingerprint, ArrowRight, ScanLine, PenTool, GraduationCap, FlaskConical, BookOpen, Landmark, BarChart2, Code2 } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';

const ACADEMIC_FIELDS = [
  { id: 'cs',         label: 'Computer Science', icon: Code2,       color: 'text-blue-400',    border: 'border-blue-500/30',    bg: 'bg-blue-500/10',    glow: 'shadow-[0_0_20px_rgba(59,130,246,0.2)]' },
  { id: 'medicine',   label: 'Medicine / Bio',   icon: FlaskConical, color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10', glow: 'shadow-[0_0_20px_rgba(16,185,129,0.2)]' },
  { id: 'humanities', label: 'Humanities',        icon: BookOpen,    color: 'text-amber-400',   border: 'border-amber-500/30',  bg: 'bg-amber-500/10',   glow: 'shadow-[0_0_20px_rgba(245,158,11,0.2)]' },
  { id: 'law',        label: 'Law / Social Sci.', icon: Landmark,    color: 'text-purple-400',  border: 'border-purple-500/30', bg: 'bg-purple-500/10',  glow: 'shadow-[0_0_20px_rgba(168,85,247,0.2)]' },
  { id: 'business',   label: 'Business',          icon: BarChart2,   color: 'text-pink-400',    border: 'border-pink-500/30',   bg: 'bg-pink-500/10',    glow: 'shadow-[0_0_20px_rgba(236,72,153,0.2)]' },
  { id: 'general',    label: 'General Academic',  icon: GraduationCap, color: 'text-gray-300', border: 'border-white/20',      bg: 'bg-white/5',        glow: 'shadow-[0_0_20px_rgba(255,255,255,0.05)]' },
];

const Extraction = ({ onComplete, onGoHome, onSkip }) => {
  const { getToken, isSignedIn } = useAuth();
  const [stage, setStage] = useState('IDENTIFY'); // IDENTIFY | INPUT | SCRAMBLE | ANALYZING
  const [userName, setUserName] = useState('');
  const [samples, setSamples] = useState('');
  const [scrambledText, setScrambledText] = useState('');
  const [isExiting, setIsExiting] = useState(false);
  const [academicMode, setAcademicMode] = useState(false);
  const [selectedField, setSelectedField] = useState(null);

  const handleExit = (routeFunc) => {
    setIsExiting(true);
    setTimeout(() => routeFunc(), 400);
  };

  // Matrix scramble effect
  useEffect(() => {
    if (stage === 'SCRAMBLE') {
      let iterations = 0;
      const chars = "!<>-_\\/[]{}—=+*^?#________ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      
      const interval = setInterval(() => {
        setScrambledText(samples.split('').map((char, index) => {
          if (index < iterations) {
            return ' '; // Fade out backwards
          }
          if (char === ' ' || char === '\n') return char;
          return chars[Math.floor(Math.random() * chars.length)];
        }).join(''));
        
        iterations += samples.length / 40;
        
        if (iterations >= samples.length) {
          clearInterval(interval);
          setStage('ANALYZING');
          handleExtraction();
        }
      }, 30);

      return () => clearInterval(interval);
    }
  }, [stage, samples]);

  const handleExtraction = async () => {
     try {
       const token = isSignedIn ? await getToken() : null;
       const headers = { 'Content-Type': 'application/json' };
       if (token) headers['Authorization'] = `Bearer ${token}`;

       const res = await fetch('http://127.0.0.1:8000/api/profile/extract', {
         method: 'POST',
         headers,
         body: JSON.stringify({ samples })
       });
       
       if (!res.ok) throw new Error("Backend failed");
       
       const data = await res.json();
       const p = data.profile || {};
       
       const styleInstructions = `
Sentence Rhythm: ${p.Sentence_Length_Variance || 'Medium'}
Vocabulary: ${p.Vocabulary_Level || 'Standard'}
Connectors: ${(p.Common_Connectors || []).join(', ')}
Quirks: ${(p.Quirks || []).join('; ')}
`.trim();

       setTimeout(() => onComplete({
         archetype: userName || 'Custom DNA',
         tone: p.Tone || 'Neutral',
         style_instructions: styleInstructions,
         academicMode,
         field: selectedField,
         rawProfile: p
       }), 2500);
     } catch (err) {
       console.error("Backend error, proceeding with mock...", err);
       setTimeout(() => {
         onComplete({
           archetype: academicMode ? `Academic — ${selectedField?.label || 'General'}` : 'The Pragmatist',
           tone: academicMode ? 'Academic' : 'Direct',
           academicMode,
           field: selectedField,
         });
       }, 4000);
     }
  };

  // Academic Mode skip — go straight to workspace with field-based profile
  const handleAcademicSkip = () => {
    if (!selectedField) return;
    setStage('ANALYZING');
    setTimeout(() => {
      onComplete({
        archetype: `Academic — ${selectedField.label}`,
        tone: 'Academic',
        academicMode: true,
        field: selectedField,
      });
    }, 2200);
  };

  // General Mode skip — go straight to workspace with a basic persona based on their input
  const handleGeneralSkip = () => {
    setStage('ANALYZING');
    setTimeout(() => {
      onComplete({
        archetype: `The ${userName || 'Professional'}`,
        tone: 'Direct',
        academicMode: false,
        field: null,
      });
    }, 2200);
  };

  return (
    <div className={`w-full min-h-screen text-white relative flex flex-col items-center justify-center p-6 transition-all duration-500 ease-in-out ${isExiting ? 'opacity-0 scale-95 blur-sm' : 'opacity-100 scale-100 blur-0'}`}>
       
       {/* Shared Background Orbs */}
      <div className="fixed top-[10%] left-[20%] w-[600px] h-[600px] bg-ink-primary/5 rounded-full blur-[150px] -z-10 mix-blend-screen pointer-events-none" />
      <div className="fixed bottom-[20%] right-[20%] w-[500px] h-[500px] bg-ink-secondary/5 rounded-full blur-[150px] -z-10 mix-blend-screen pointer-events-none" />
      {/* Academic Mode ambient glow */}
      {academicMode && <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-500/5 rounded-full blur-[120px] -z-10 pointer-events-none transition-all duration-700" />}

      {/* Top Navigation */}
      <div className="absolute top-0 left-0 w-full px-12 py-10 flex justify-between items-start z-50 pointer-events-none">
         <button onClick={() => handleExit(onGoHome)} className="pointer-events-auto flex items-center opacity-50 hover:opacity-100 transition-opacity cursor-pointer group">
            <span className="font-outfit text-xl font-bold tracking-wide text-white group-hover:text-ink-primary transition-colors">HumanInk</span>
         </button>
         <button onClick={() => handleExit(onSkip)} className="pointer-events-auto text-gray-500 font-inter text-sm hover:text-white transition-colors cursor-pointer tracking-widest uppercase">
            Skip Setup
         </button>
      </div>

       {/* STAGE 1: IDENTIFY */}
       {stage === 'IDENTIFY' && (
         <div className="flex flex-col items-center w-full max-w-xl animate-fade-in">
           <h2 className="font-outfit text-3xl md:text-5xl font-extrabold mb-8 tracking-tight text-white drop-shadow-md">Identify archetype.</h2>
           <input
             type="text"
             placeholder="Who are you? (e.g. Founder, Developer)"
             value={userName}
             onChange={(e) => setUserName(e.target.value)}
             onKeyDown={(e) => { if (e.key === 'Enter' && userName.trim()) setStage('INPUT'); }}
             className="w-full bg-transparent border-b-2 border-white/20 text-white text-2xl pb-4 outline-none focus:border-ink-primary transition-colors text-center font-inter placeholder:text-gray-600"
             autoFocus
           />

           {/* Academic Mode Toggle */}
           <div className="mt-12 flex flex-col items-center gap-4">
             <button
               onClick={() => setAcademicMode(prev => !prev)}
               className={`flex items-center gap-3 px-5 py-2.5 rounded-full border transition-all duration-300 font-inter text-sm ${
                 academicMode
                   ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                   : 'border-white/10 bg-white/5 text-gray-500 hover:text-white hover:border-white/20'
               }`}
             >
               <GraduationCap size={16} />
               <span className="tracking-wide">Academic Mode</span>
               {/* Toggle pill */}
               <div className={`w-8 h-4 rounded-full relative transition-all duration-300 ${academicMode ? 'bg-emerald-500' : 'bg-white/20'}`}>
                 <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-all duration-300 ${academicMode ? 'left-4' : 'left-0.5'}`} />
               </div>
             </button>

             {/* Field selector appears when Academic Mode is ON */}
             {academicMode && (
               <div className="mt-4 flex flex-col items-center gap-4 animate-fade-in w-full max-w-lg">
                 <p className="text-gray-500 text-xs font-inter tracking-widest uppercase">Select your field</p>
                 <div className="grid grid-cols-3 gap-3 w-full">
                   {ACADEMIC_FIELDS.map(field => {
                     const Icon = field.icon;
                     const isSelected = selectedField?.id === field.id;
                     return (
                       <button
                         key={field.id}
                         onClick={() => setSelectedField(field)}
                         className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
                           isSelected
                             ? `${field.border} ${field.bg} ${field.color} ${field.glow}`
                             : 'border-white/5 bg-white/[0.02] text-gray-600 hover:text-gray-300 hover:border-white/10'
                         }`}
                       >
                         <Icon size={20} />
                         <span className="font-inter text-xs font-medium text-center leading-tight">{field.label}</span>
                       </button>
                     );
                   })}
                 </div>
               </div>
             )}

             <p className="mt-4 text-gray-500 font-inter text-sm tracking-widest uppercase animate-pulse">Press Enter To Initialize</p>
           </div>
         </div>
       )}

       {/* STAGE 2: INPUT */}
       {stage === 'INPUT' && (
         <div className="w-full max-w-4xl relative h-[600px] flex flex-col animate-fade-in">
            <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="font-outfit text-3xl font-bold tracking-tight">
                  {academicMode
                    ? <>Academic sample, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">{userName}</span>.</>
                    : <>Paste your sample, <span className="text-transparent bg-clip-text bg-gradient-to-r from-ink-primary to-ink-secondary">{userName}</span>.</>
                  }
                </h2>
                {academicMode ? (
                  <p className="text-gray-500 font-inter text-sm mt-1">
                    Optional — paste a past academic paragraph or <button onClick={handleAcademicSkip} disabled={!selectedField} className={`underline transition-colors ${selectedField ? 'text-emerald-400 hover:text-emerald-300 cursor-pointer' : 'text-gray-600 cursor-not-allowed'}`}>use field baseline ({selectedField?.label || 'select a field first'})</button>
                  </p>
                ) : (
                  <p className="text-gray-500 font-inter text-sm mt-1">
                    Optional — paste a sample of your writing or <button onClick={handleGeneralSkip} className="underline transition-colors text-ink-primary hover:text-ink-secondary cursor-pointer">skip to use a default {userName || 'professional'} baseline</button>
                  </p>
                )}
              </div>
              <button 
                onClick={() => {
                  if (!samples) {
                    if (academicMode) handleAcademicSkip();
                    else handleGeneralSkip();
                  } else if (samples.trim().length >= 150) {
                    setStage('SCRAMBLE');
                  } else {
                    alert('Please paste a longer sample! We need at least 150 characters to accurately extract your linguistic DNA.');
                  }
                }}
                className={`px-6 py-3 rounded-full font-semibold hover:scale-105 active:scale-95 transition-all text-sm flex items-center gap-2 relative z-[999] cursor-pointer pointer-events-auto ${
                  !samples
                    ? academicMode
                      ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500 hover:text-white shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                      : 'bg-ink-primary/20 border border-ink-primary/40 text-ink-primary hover:bg-ink-primary hover:text-white shadow-[0_0_20px_rgba(142,45,226,0.2)]'
                    : 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.1)]'
                }`}
              >
                {!samples 
                  ? (academicMode ? 'Use Field Baseline' : 'Skip & Use Default Profile') 
                  : 'Extract DNA'
                } <ArrowRight size={16} pointerEvents="none" />
              </button>
            </div>
            
            <div className="relative w-full flex-1 rounded-2xl border border-white/10 bg-[#0a0a0c]/80 backdrop-blur-3xl shadow-2xl overflow-hidden group">
               <textarea
                  className="w-full h-full p-8 bg-transparent text-gray-300 font-inter text-lg outline-none resize-none placeholder:text-gray-700 leading-relaxed custom-scrollbar"
                  placeholder={academicMode
                    ? "Optional: paste a paragraph from one of your past papers to calibrate your academic voice. Leave blank to use the field baseline profile."
                    : "Paste at least 150 words of your highest quality, most authentic writing here. Do not paste AI generated text, or the system will reject it."
                  }
                  value={samples}
                  onChange={(e) => setSamples(e.target.value)}
                  autoFocus
                />
                {!samples && <div className={`absolute inset-0 border-2 border-transparent transition-colors pointer-events-none rounded-2xl ${academicMode ? 'group-hover:border-emerald-500/20' : 'group-hover:border-ink-primary/20'}`} />}
            </div>
         </div>
       )}

       {/* STAGE 3: SCRAMBLE */}
       {stage === 'SCRAMBLE' && (
         <div className="w-full max-w-4xl relative h-[600px] flex flex-col items-center justify-center">
            <h2 className={`font-outfit text-4xl mb-4 animate-pulse tracking-[0.2em] font-black ${academicMode ? 'text-emerald-400 drop-shadow-[0_0_20px_#10b981]' : 'text-ink-primary drop-shadow-[0_0_20px_#8b5cf6]'}`}>DECONSTRUCTING SYNTAX</h2>
            <p className="text-gray-500 font-mono text-sm uppercase tracking-widest mb-12">Parsing neural rhythm map...</p>
            <div className="w-full p-8 font-mono text-white opacity-80 break-all leading-relaxed text-sm max-h-[400px] overflow-hidden select-none">
               {scrambledText}
            </div>
         </div>
       )}

       {/* STAGE 4: ANALYZING */}
       {stage === 'ANALYZING' && (
          <div className="flex flex-col items-center justify-center animate-fade-in h-[600px]">
              <div className="relative mb-12">
                <div className={`absolute inset-0 blur-[100px] rounded-full ${academicMode ? 'bg-emerald-500/20' : 'bg-ink-primary/20'}`} />
                <Fingerprint size={120} className="text-white/20 relative z-0" strokeWidth={1} />
                <div className={`absolute top-0 left-0 w-full h-[10px] shadow-[0_0_30px] animate-scan z-10 ${academicMode ? 'bg-emerald-400 shadow-emerald-400' : 'bg-ink-primary shadow-ink-primary'}`} />
                <ScanLine size={120} className={`absolute top-0 left-0 animate-pulse-fast z-20 mix-blend-screen ${academicMode ? 'text-emerald-400' : 'text-ink-primary'}`} strokeWidth={1.5}/>
              </div>
              
              <h2 className="font-outfit text-3xl font-extrabold tracking-[0.2em] mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
                {academicMode ? 'CALIBRATING FIELD' : 'PROFILING'}
              </h2>
              
              <div className="flex flex-col items-center gap-2 mt-4">
                {academicMode ? (
                  <>
                    <p className="text-gray-500 font-mono text-sm uppercase tracking-widest animate-pulse">Loading Field Baseline Profile</p>
                    <p className="text-gray-500 font-mono text-sm uppercase tracking-widest animate-pulse" style={{animationDelay: '0.4s'}}>Calibrating Academic Register</p>
                    <p className={`font-mono text-sm uppercase tracking-widest animate-pulse drop-shadow-[0_0_10px_#10b981] text-emerald-400`} style={{animationDelay: '0.8s'}}>Enabling LaTeX-Safe Mode</p>
                  </>
                ) : (
                  <>
                    <p className="text-gray-500 font-mono text-sm uppercase tracking-widest animate-pulse">Mapping Vocabulary Distribution</p>
                    <p className="text-gray-500 font-mono text-sm uppercase tracking-widest animate-pulse" style={{animationDelay: '0.4s'}}>Calculating Rhythm Variance</p>
                    <p className="text-ink-primary drop-shadow-[0_0_10px_#8b5cf6] font-mono text-sm uppercase tracking-widest animate-pulse" style={{animationDelay: '0.8s'}}>Synthesizing Profile JSON</p>
                  </>
                )}
              </div>
          </div>
       )}

    </div>
  );
};

export default Extraction;
