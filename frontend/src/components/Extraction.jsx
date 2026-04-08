import React, { useState, useEffect } from 'react';
import { Fingerprint, ArrowRight, ScanLine, PenTool } from 'lucide-react';

const Extraction = ({ onComplete, onGoHome, onSkip }) => {
  const [stage, setStage] = useState('IDENTIFY'); // IDENTIFY | INPUT | SCRAMBLE | ANALYZING
  const [userName, setUserName] = useState('');
  const [samples, setSamples] = useState('');
  const [scrambledText, setScrambledText] = useState('');
  const [isExiting, setIsExiting] = useState(false);

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
        
        iterations += samples.length / 40; // Scramble duration multiplier
        
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
       const res = await fetch('http://127.0.0.1:8000/api/profiler/analyze', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ samples: [samples] })
       });
       
       if (!res.ok) throw new Error("Backend failed");
       
       const data = await res.json();
       setTimeout(() => onComplete(data.profile), 2500); // 2.5s to let them watch the fingerprint
     } catch (err) {
       console.error("Backend error, proceeding with mock...", err);
       setTimeout(() => {
         onComplete({ archetype: 'The Pragmatist', tone: 'Direct' });
       }, 4000);
     }
  };

  return (
    <div className={`w-full min-h-screen text-white relative flex flex-col items-center justify-center p-6 transition-all duration-500 ease-in-out ${isExiting ? 'opacity-0 scale-95 blur-sm' : 'opacity-100 scale-100 blur-0'}`}>
       
       {/* Shared Background Orbs fixed in background - identical to Home.jsx */}
      <div className="fixed top-[10%] left-[20%] w-[600px] h-[600px] bg-ink-primary/5 rounded-full blur-[150px] -z-10 mix-blend-screen pointer-events-none" />
      <div className="fixed bottom-[20%] right-[20%] w-[500px] h-[500px] bg-ink-secondary/5 rounded-full blur-[150px] -z-10 mix-blend-screen pointer-events-none" />

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
         <div className="flex flex-col items-center w-full max-w-xl animate-fade-in fade-in-up">
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
           <p className="mt-12 text-gray-500 font-inter text-sm tracking-widest uppercase animate-pulse">Press Enter To Initialize</p>
         </div>
       )}

       {/* STAGE 2: INPUT */}
       {stage === 'INPUT' && (
         <div className="w-full max-w-4xl relative h-[600px] flex flex-col animate-fade-in">
            <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <h2 className="font-outfit text-3xl font-bold tracking-tight">Paste your sample, <span className="text-transparent bg-clip-text bg-gradient-to-r from-ink-primary to-ink-secondary">{userName}</span>.</h2>
              <button 
                onClick={() => {
                  if (samples.length > 10) {
                    setStage('SCRAMBLE');
                  } else {
                    alert('Please paste a slightly longer sample to analyze.');
                  }
                }}
                className="px-6 py-3 rounded-full bg-white text-black font-semibold hover:scale-105 active:scale-95 transition-all text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)] relative z-[999] cursor-pointer pointer-events-auto"
              >
                Extract DNA <ArrowRight size={16} pointerEvents="none" />
              </button>
            </div>
            
            <div className="relative w-full flex-1 rounded-2xl border border-white/10 bg-[#0a0a0c]/80 backdrop-blur-3xl shadow-2xl overflow-hidden group">
               <textarea
                  className="w-full h-full p-8 bg-transparent text-gray-300 font-inter text-lg outline-none resize-none placeholder:text-gray-700 leading-relaxed custom-scrollbar"
                  placeholder="Paste at least 150 words of your highest quality, most authentic writing here. Do not paste AI generated text, or the system will reject it."
                  value={samples}
                  onChange={(e) => setSamples(e.target.value)}
                  autoFocus
                />
                {!samples && <div className="absolute inset-0 border-2 border-transparent group-hover:border-ink-primary/20 transition-colors pointer-events-none rounded-2xl" />}
            </div>
         </div>
       )}

       {/* STAGE 3: SCRAMBLE */}
       {stage === 'SCRAMBLE' && (
         <div className="w-full max-w-4xl relative h-[600px] flex flex-col items-center justify-center">
            <h2 className="font-outfit text-4xl mb-4 text-ink-primary animate-pulse tracking-[0.2em] font-black drop-shadow-[0_0_20px_#8b5cf6]">DECONSTRUCTING SYNTAX</h2>
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
                <div className="absolute inset-0 bg-ink-primary/20 blur-[100px] rounded-full" />
                <Fingerprint size={120} className="text-white/20 relative z-0" strokeWidth={1} />
                <div className="absolute top-0 left-0 w-full h-[10px] bg-ink-primary shadow-[0_0_30px_#8b5cf6] animate-scan z-10" />
                <ScanLine size={120} className="text-ink-primary absolute top-0 left-0 animate-pulse-fast z-20 mix-blend-screen" strokeWidth={1.5}/>
              </div>
              
              <h2 className="font-outfit text-3xl font-extrabold tracking-[0.2em] mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
                PROFILING
              </h2>
              
              <div className="flex flex-col items-center gap-2 mt-4">
                <p className="text-gray-500 font-mono text-sm uppercase tracking-widest animate-pulse">Mapping Vocabulary Distribution</p>
                <p className="text-gray-500 font-mono text-sm uppercase tracking-widest animate-pulse" style={{animationDelay: '0.4s'}}>Calculating Rhythm Variance</p>
                <p className="text-ink-primary drop-shadow-[0_0_10px_#8b5cf6] font-mono text-sm uppercase tracking-widest animate-pulse" style={{animationDelay: '0.8s'}}>Synthesizing Profile JSON</p>
              </div>
          </div>
       )}

    </div>
  );
};

export default Extraction;
