import React, { useState, useEffect } from 'react';
import { PenTool, ArrowRight, Shield, Zap, BrainCircuit, Terminal, Mail, BookOpen, MessageSquare, Search, Target, Network, Cpu, Globe, Layers, FileCode2 } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton, ClerkLoading, ClerkLoaded } from '@clerk/clerk-react';
import PricingModal from './PricingModal';
import LegalModal from './LegalModal';

const STANDARD_TEXT = "The integration of artificial intelligence into daily workflows significantly enhances overarching productivity. By automating repetitive administrative tasks, employees are empowered to allocate their cognitive resources toward high-level strategic objectives.";
const HUMAN_TEXT = "Putting AI to work in your daily routine really gives productivity a boost. When you let it handle the boring, repetitive admin stuff, you're finally free to focus your energy on the big projects that actually matter."

const TypewriterComparison = () => {
  const [stdTyped, setStdTyped] = useState("");
  const [humanTyped, setHumanTyped] = useState("");

  useEffect(() => {
    // Reset
    setStdTyped("");
    setHumanTyped("");

    // Animate Standard (monotonous, fast)
    let stdIndex = 0;
    const stdInterval = setInterval(() => {
      if (stdIndex < STANDARD_TEXT.length) {
        setStdTyped(STANDARD_TEXT.substring(0, stdIndex + 1));
        stdIndex++;
      } else {
        clearInterval(stdInterval);
      }
    }, 40); // perfectly even, boring pace

    // Animate Human (bursty, pauses)
    let humanIndex = 0;
    const typeHuman = () => {
      if (humanIndex < HUMAN_TEXT.length) {
        setHumanTyped(HUMAN_TEXT.substring(0, humanIndex + 1));
        humanIndex++;

        // Randomize delay to simulate human burstiness
        let delay = Math.random() * 50 + 20;
        const nextChar = HUMAN_TEXT[humanIndex] || '';

        // Pause heavily on punctuation or newlines
        if (['.', ',', '\n'].includes(nextChar)) {
          delay = 400 + Math.random() * 300;
        }

        setTimeout(typeHuman, delay);
      }
    };

    // Start human slightly later for dramatic effect
    setTimeout(typeHuman, 500);

    return () => clearInterval(stdInterval);
  }, []); // Re-run mechanism could be added via intersection observer later if needed

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col items-center mt-20 mb-32 z-10 relative">
      <div className="text-center mb-16">
        <h2 className="font-outfit text-3xl md:text-4xl text-white font-bold tracking-tight mb-4">The Turing Test, <span className="text-gray-500">Solved.</span></h2>
        <p className="text-gray-400 font-light text-lg">Watch the difference between standard LLM generation and HumanInk's rhythmic styling.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full px-6">
        {/* Standard LLM Board */}
        <div className="rounded-2xl border border-white/5 bg-[#0a0a0c] overflow-hidden flex flex-col shadow-2xl relative">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
          <div className="px-6 py-4 border-b border-white/5 flex items-center gap-3 bg-white/5">
            <Terminal size={16} className="text-gray-500" />
            <span className="font-mono text-xs text-gray-500 tracking-widest uppercase">Standard LLM Output</span>
          </div>
          <div className="p-8 h-[250px] font-mono text-gray-400 text-sm md:text-base leading-relaxed">
            {stdTyped}
            <span className="animate-pulse bg-gray-500 w-[8px] h-[16px] inline-block ml-1 align-middle"></span>
          </div>
        </div>

        {/* HumanInk Board */}
        <div className="rounded-2xl border border-white/10 bg-[#050505] overflow-hidden flex flex-col shadow-[0_0_50px_rgba(142,45,226,0.1)] relative group">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-ink-primary to-transparent" />
          <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-ink-900/40">
            <div className="flex items-center gap-3">
              <PenTool size={16} className="text-ink-primary" />
              <span className="font-outfit font-bold text-xs text-ink-primary tracking-widest"><span className="normal-case">HumanInk</span> <span className="uppercase">Profile</span></span>
            </div>
            <div className="flex gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981] animate-pulse"></span>
            </div>
          </div>
          <div className="p-8 h-[250px] font-inter text-gray-100 text-lg md:text-xl leading-relaxed whitespace-pre-wrap">
            {humanTyped}
            <span className="animate-pulse bg-ink-primary w-[2px] h-[22px] inline-block ml-1 align-middle shadow-[0_0_10px_#8b5cf6]"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

const UseCases = () => {
  return (
    <section className="w-full max-w-7xl mx-auto px-6 py-32 z-10 relative flex flex-col items-center">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-ink-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="text-center mb-20">
        <h2 className="font-outfit text-4xl md:text-5xl text-white font-extrabold tracking-tight mb-4">
          Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-ink-primary to-ink-secondary">High-Stakes</span> output.
        </h2>
        <p className="text-gray-400 font-light text-lg max-w-2xl mx-auto">Wherever automated content filters or generic styling hurts your bottom line, HumanInk steps into the workflow.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">

        {/* Card 1: Cold Email (Spans 2 columns on desktop) */}
        <div className="md:col-span-2 rounded-3xl bg-[#0a0a0c]/80 backdrop-blur-2xl border border-white/5 p-10 flex flex-col justify-end relative overflow-hidden group hover:border-ink-primary/30 transition-all duration-500 shadow-2xl hover:shadow-[0_0_80px_rgba(142,45,226,0.15)] min-h-[300px]">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-ink-primary/10 to-transparent rounded-full blur-[80px] group-hover:from-ink-primary/20 transition-all duration-700" />
          <Mail className="absolute top-8 right-8 text-ink-primary/20 group-hover:text-ink-primary/50 transition-colors w-24 h-24 stroke-[1]" />
          <div className="z-10 mt-auto">
            <div className="w-12 h-12 rounded-full bg-ink-primary/10 flex items-center justify-center mb-6 border border-ink-primary/20">
              <Target size={20} className="text-ink-primary" />
            </div>
            <h3 className="font-outfit text-3xl font-bold text-white mb-3 tracking-wide">Cold Email Outreach</h3>
            <p className="text-gray-400 font-light text-lg max-w-md leading-relaxed">Navigate strict content filters and ensure authentic delivery. Send massive B2B sequences that genuinely sound like a human individually typed them.</p>
          </div>
        </div>

        {/* Card 2: Academic & Research (Spans 2 rows) */}
        <div className="md:row-span-2 rounded-3xl bg-[#050505] backdrop-blur-2xl border border-white/5 p-10 flex flex-col relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-500 shadow-2xl hover:shadow-[0_0_80px_rgba(16,185,129,0.1)] min-h-[300px]">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
          <div className="z-10 shrink-0">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6 border border-emerald-500/20">
              <BookOpen size={20} className="text-emerald-400" />
            </div>
            <h3 className="font-outfit text-2xl font-bold text-white mb-3 tracking-wide">Academic Research</h3>
            <p className="text-gray-400 font-light text-base leading-relaxed">Synthesize massive datasets into dense, highly credible academic prose without the hallucinatory filler associated with standard LLMs.</p>
          </div>

          <div className="mt-12 flex-1 relative rounded-xl border border-white/5 bg-black/50 p-4 font-mono text-[10px] text-emerald-500/50 overflow-hidden group-hover:text-emerald-400/80 transition-colors">
            <div className="absolute top-0 left-0 w-full h-[200%] bg-gradient-to-b from-transparent via-emerald-500/10 to-transparent animate-scan" />
            [010] EVAL SYNTAX_TREE<br />
            [011] INJECT CITE(AUTHOR, 24)<br />
            [012] VERIFY HUMANISTIC_SCORE=TRUE<br />
            [013] RHYTHM_SCORE: 98.4%
          </div>
        </div>

        {/* Card 3: Creator Content */}
        <div className="rounded-3xl bg-[#0a0a0c]/80 backdrop-blur-2xl border border-white/5 p-8 flex flex-col relative overflow-hidden group hover:border-ink-secondary/30 transition-all duration-500 shadow-2xl min-h-[250px]">
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-ink-secondary/20 rounded-full blur-[50px] group-hover:bg-ink-secondary/40 transition-all" />
          <div className="z-10">
            <div className="w-10 h-10 rounded-full bg-ink-secondary/10 flex items-center justify-center mb-6 border border-ink-secondary/20">
              <MessageSquare size={18} className="text-ink-secondary" />
            </div>
            <h3 className="font-outfit text-xl font-bold text-white mb-2 tracking-wide">Creator Content</h3>
            <p className="text-gray-400 font-light text-sm leading-relaxed">Scale your newsletters and social posts while flawlessly maintaining your unique, recognizable brand voice.</p>
          </div>
        </div>

        {/* Card 4: SEO Copywriting */}
        <div className="rounded-3xl bg-[#0a0a0c]/80 backdrop-blur-2xl border border-white/5 p-8 flex flex-col relative overflow-hidden group hover:border-blue-500/30 transition-all duration-500 shadow-2xl min-h-[250px]">
          {/* Grid background effect */}
          <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

          <div className="z-10 relative">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/20">
              <Search size={18} className="text-blue-400" />
            </div>
            <h3 className="font-outfit text-xl font-bold text-white mb-2 tracking-wide">SEO Copywriting</h3>
            <p className="text-gray-400 font-light text-sm leading-relaxed">Defeat the newest search engine penalization algorithms by ensuring your blog content passes as 100% human-written.</p>
          </div>
        </div>

      </div>
    </section>
  );
};

const MetricsSection = () => {
  return (
    <section className="w-full max-w-7xl mx-auto px-6 py-20 z-10 relative">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full border-y border-white/5 py-12 bg-[#050505]/50 backdrop-blur-sm">
        <div className="flex flex-col items-center text-center px-4 border-b md:border-b-0 md:border-r border-white/5 pb-8 md:pb-0">
          <span className="font-outfit text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 to-emerald-600 mb-2">99.9%</span>
          <h3 className="font-outfit font-bold text-white text-xl mb-2">Tone Accuracy</h3>
          <p className="text-gray-400 font-light text-sm">Maintains exact emotional resonance and stylistic pacing across infinite generations.</p>
        </div>
        <div className="flex flex-col items-center text-center px-4 border-b md:border-b-0 md:border-r border-white/5 pb-8 md:pb-0">
          <span className="font-outfit text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-ink-primary to-ink-secondary mb-2">3.2x</span>
          <h3 className="font-outfit font-bold text-white text-xl mb-2">Higher Engagement</h3>
          <p className="text-gray-400 font-light text-sm">Cold outreach and social content convert dramatically higher when sounding human.</p>
        </div>
        <div className="flex flex-col items-center text-center px-4">
          <span className="font-outfit text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-blue-600 mb-2">100%</span>
          <h3 className="font-outfit font-bold text-white text-xl mb-2">Neural Consistency</h3>
          <p className="text-gray-400 font-light text-sm">Locks in your exact vocabulary distribution, sentence variance, and quirks.</p>
        </div>
      </div>
    </section>
  );
};

const DNACarousel = () => {
  const dnas = [
    { name: "The Novelist", color: "from-ink-secondary to-pink-600", border: "hover:border-ink-secondary", bg: "bg-ink-secondary/10", icon: "text-ink-secondary", desc: "Highly emotive, vivid imagery, varied sentence structure with a lyrical rhythm." },
    { name: "The Academic", color: "from-emerald-400 to-emerald-600", border: "hover:border-emerald-500", bg: "bg-emerald-500/10", icon: "text-emerald-400", desc: "Dense, objective, citation-heavy prose with highly structured argumentation." },
    { name: "The Marketer", color: "from-ink-primary to-purple-600", border: "hover:border-ink-primary", bg: "bg-ink-primary/10", icon: "text-ink-primary", desc: "Punchy, persuasive, high-energy hooks optimized for maximum scroll-stopping engagement." }
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-6 py-32 z-10 relative flex flex-col items-center">
      <div className="text-center mb-16">
        <h2 className="font-outfit text-4xl md:text-5xl text-white font-extrabold tracking-tight mb-4">Choose your <span className="text-transparent bg-clip-text bg-gradient-to-r from-ink-primary to-ink-secondary">Digital DNA.</span></h2>
        <p className="text-gray-400 font-light text-lg max-w-2xl mx-auto">Or extract your own. HumanInk shapes the AI pipeline to match the exact mathematical rhythm of your chosen profile.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
        {dnas.map((dna, idx) => (
          <div key={idx} className={`rounded-3xl bg-[#0a0a0c]/80 backdrop-blur-2xl border border-white/5 p-8 flex flex-col relative overflow-hidden group transition-all duration-500 shadow-2xl hover:shadow-[0_0_80px_rgba(255,255,255,0.05)] ${dna.border}`}>
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px] opacity-20 group-hover:opacity-50 transition-all duration-500 bg-gradient-to-bl ${dna.color}`} />
            <div className="z-10 relative">
              <div className={`w-12 h-12 rounded-full ${dna.bg} flex items-center justify-center mb-6 border border-white/5`}>
                <BrainCircuit size={20} className={dna.icon} />
              </div>
              <h3 className="font-outfit text-2xl font-bold text-white mb-3 tracking-wide">{dna.name}</h3>
              <p className="text-gray-400 font-light text-sm leading-relaxed">{dna.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const Home = ({ onStartSetup, isLoading, hasProfiles }) => {
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [legalModalState, setLegalModalState] = useState({ isOpen: false, tab: 'privacy' });
  const [isTakingLong, setIsTakingLong] = useState(false);

  useEffect(() => {
    let timeout;
    if (isLoading) {
      timeout = setTimeout(() => {
        setIsTakingLong(true);
      }, 3000);
    } else {
      setIsTakingLong(false);
    }
    return () => clearTimeout(timeout);
  }, [isLoading]);

  const openLegal = (tab) => setLegalModalState({ isOpen: true, tab });

  return (
    <div className="w-full min-h-screen text-white scroll-smooth relative">

      {/* Shared Background Orbs fixed in background */}
      <div className="fixed top-[10%] left-[20%] w-[600px] h-[600px] bg-ink-primary/5 rounded-full blur-[150px] -z-10 mix-blend-screen pointer-events-none" />
      <div className="fixed bottom-[20%] right-[20%] w-[500px] h-[500px] bg-ink-secondary/5 rounded-full blur-[150px] -z-10 mix-blend-screen pointer-events-none" />

      {/* Global User Profile Button positioned relative to viewport */}
      <SignedIn>
        <div className="absolute top-8 right-12 z-50">
          <UserButton appearance={{ elements: { userButtonAvatarBox: "w-11 h-11 border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:scale-105 transition-transform" } }} />
        </div>
      </SignedIn>

      {/* =========================================
          SECTION 1: HERO
          ========================================= */}
      <section className="min-h-screen flex flex-col justify-between px-12 py-10 relative">
        <div className="flex justify-start items-start w-full max-w-[1600px] mx-auto z-10">
          <h2 className="font-outfit text-2xl md:text-3xl font-medium tracking-tight text-white drop-shadow-md">Experience authenticity.</h2>
        </div>

        <div className="flex flex-col items-center justify-center flex-1 z-10 relative w-full">

          {/* The Infinite Faded Marquee Background */}
          <div className="absolute top-1/2 left-0 w-full overflow-hidden whitespace-nowrap opacity-[0.08] md:opacity-[0.03] pointer-events-none -translate-y-1/2 flex select-none" style={{ maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)' }}>
            <div className="animate-marquee flex gap-12 font-outfit font-black text-7xl md:text-[10rem] tracking-widest text-[#fff] items-center">
              <span>THE FOUNDER</span><span className="text-4xl text-ink-primary">✦</span>
              <span>THE NOVELIST</span><span className="text-4xl text-ink-secondary">✦</span>
              <span>THE ACADEMIC</span><span className="text-4xl text-emerald-500">✦</span>
              <span>THE DEVELOPER</span><span className="text-4xl text-red-500">✦</span>
              <span>THE MARKETER</span><span className="text-4xl text-ink-primary">✦</span>
              <span>THE JOURNALIST</span><span className="text-4xl text-ink-secondary">✦</span>
              {/* Duplicated exactly for seamless looping */}
              <span>THE FOUNDER</span><span className="text-4xl text-ink-primary">✦</span>
              <span>THE NOVELIST</span><span className="text-4xl text-ink-secondary">✦</span>
              <span>THE ACADEMIC</span><span className="text-4xl text-emerald-500">✦</span>
              <span>THE DEVELOPER</span><span className="text-4xl text-red-500">✦</span>
              <span>THE MARKETER</span><span className="text-4xl text-ink-primary">✦</span>
              <span>THE JOURNALIST</span><span className="text-4xl text-ink-secondary">✦</span>
            </div>
          </div>

          <div className="flex flex-col items-center translate-y-6 z-10">
            <ClerkLoading>
              <button className="px-8 py-4 rounded-full bg-white/50 text-black/50 font-semibold tracking-wide flex items-center gap-3 cursor-not-allowed">
                Initializing...
              </button>
            </ClerkLoading>
            <ClerkLoaded>
              <SignedIn>
                <button
                  onClick={onStartSetup}
                  disabled={isLoading}
                  className={`px-8 py-4 rounded-full ${isLoading ? 'bg-white/50 cursor-not-allowed' : 'bg-white hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:shadow-[0_0_60px_rgba(255,255,255,0.3)]'} text-black font-semibold tracking-wide transition-all flex items-center gap-3`}
                >
                  {isLoading ? (isTakingLong ? 'Waking up backend (~50s)...' : 'Checking DNA Profile...') : 'Enter Workspace'} <ArrowRight size={18} />
                </button>
              </SignedIn>
              
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="px-8 py-4 rounded-full bg-white text-black font-semibold tracking-wide hover:scale-105 active:scale-95 transition-all flex items-center gap-3 shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:shadow-[0_0_60px_rgba(255,255,255,0.3)]">
                    Enter Workspace <ArrowRight size={18} />
                  </button>
                </SignInButton>
              </SignedOut>
            </ClerkLoaded>

            <p className="mt-6 text-gray-500 font-inter text-sm tracking-widest uppercase">The loop starts here.</p>
          </div>
        </div>

        <div className="w-full relative flex justify-center translate-y-[15%] z-0">
          <h1 className="font-outfit font-extrabold text-[18vw] leading-[0.8] tracking-tighter text-white/95 whitespace-nowrap drop-shadow-[0_0_80px_rgba(255,255,255,0.05)] selection:bg-transparent" style={{ maskImage: 'linear-gradient(to bottom, white 40%, transparent 95%)', WebkitMaskImage: 'linear-gradient(to bottom, white 40%, transparent 95%)' }}>
            HumanInk
          </h1>
        </div>
      </section>

      {/* =========================================
          SECTION 2: WHY HUMANINK — establish the problem first
          ========================================= */}
      <WhyHumanInkSection />

      {/* =========================================
          SECTION 3: THE PROOF — immediately show it works
          ========================================= */}
      <TypewriterComparison />

      {/* =========================================
          SECTION 4: METRICS — back the proof with numbers
          ========================================= */}
      <MetricsSection />

      {/* =========================================
          SECTION 5: USE CASES — show who it's for
          ========================================= */}
      <UseCases />

      {/* =========================================
          SECTION 6: DNA CAROUSEL — the key differentiator
          ========================================= */}
      <DNACarousel />

      {/* =========================================
          SECTION 7: PIPELINE EXPLORER — now they're invested, show how
          ========================================= */}
      <PipelineExplorer />

      {/* =========================================
          SECTION 8: THE AGENTIC LAYER — future vision
          ========================================= */}
      <AgentProtocolSection />

      {/* =========================================
          SECTION 9: THE HORIZON — roadmap last
          ========================================= */}
      <RoadmapSection />

      {/* Footer */}
      <footer className="w-full border-t border-white/5 relative z-10 bg-[#050505] mt-24">

        {/* Main Footer Grid */}
        <div className="max-w-7xl mx-auto px-6 pt-16 pb-10 w-full grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* Brand Column */}
          <div className="flex flex-col gap-6 md:col-span-1">
            <div className="flex items-center gap-3">
              <PenTool size={18} className="text-ink-primary" />
              <span className="font-outfit font-bold tracking-widest text-white">HumanInk</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed font-inter">A multi-agent pipeline that rewrites AI text to match your exact neural rhythm.</p>
            {/* Social Icons */}
            <div className="flex items-center gap-5 mt-2">
              <a href="https://github.com" target="_blank" rel="noreferrer" title="GitHub" className="text-gray-600 hover:text-white transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" title="Twitter / X" className="text-gray-600 hover:text-white transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://discord.com" target="_blank" rel="noreferrer" title="Discord" className="text-gray-600 hover:text-white transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
              </a>
            </div>
          </div>

          {/* Product Column */}
          <div className="flex flex-col gap-3">
            <span className="font-outfit font-bold text-xs tracking-[0.2em] uppercase text-gray-500 mb-2">Product</span>
            <span onClick={() => setIsPricingModalOpen(true)} className="text-gray-400 text-sm font-inter hover:text-white cursor-pointer transition-colors">Pricing</span>
            {['Architecture', 'Multi-Agent Loop', 'Pipeline Explorer', 'Changelog'].map(l => (
              <span key={l} className="text-gray-400 text-sm font-inter hover:text-white cursor-pointer transition-colors">{l}</span>
            ))}
          </div>

          {/* Resources Column */}
          <div className="flex flex-col gap-3">
            <span className="font-outfit font-bold text-xs tracking-[0.2em] uppercase text-gray-500 mb-2">Resources</span>
            {['Documentation', 'API Reference', 'System Status', 'Open Source'].map(l => (
              <span key={l} className="text-gray-400 text-sm font-inter hover:text-white cursor-pointer transition-colors">{l}</span>
            ))}
          </div>

          {/* Legal & Contact Column */}
          <div className="flex flex-col gap-3">
            <span className="font-outfit font-bold text-xs tracking-[0.2em] uppercase text-gray-500 mb-2">Contact</span>
            <a href="mailto:humanink.ai@gmail.com" className="text-ink-primary text-sm font-inter hover:text-white transition-colors cursor-pointer">humanink.ai@gmail.com</a>
            <span onClick={() => openLegal('privacy')} className="text-gray-400 text-sm font-inter hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span onClick={() => openLegal('security')} className="text-gray-400 text-sm font-inter hover:text-white cursor-pointer transition-colors">Security</span>
            <span onClick={() => openLegal('terms')} className="text-gray-400 text-sm font-inter hover:text-white cursor-pointer transition-colors">Terms of Use</span>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="max-w-7xl mx-auto px-6 py-5 border-t border-white/5 w-full flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-xs font-inter">© 2026 HumanInk. Authentic Identity. Zero Fluff.</p>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981] animate-pulse" />
            <span className="text-gray-600 text-xs font-mono tracking-wider">Agent Pipeline Operational</span>
          </div>
        </div>
      </footer>

      {isPricingModalOpen && <PricingModal onClose={() => setIsPricingModalOpen(false)} />}
      {legalModalState.isOpen && <LegalModal onClose={() => setLegalModalState({ isOpen: false, tab: 'privacy' })} initialTab={legalModalState.tab} />}
    </div>
  );
};

const WhyHumanInkSection = () => {
  return (
    <section className="w-full max-w-7xl mx-auto px-6 py-32 z-10 relative">
      <div className="text-center mb-16">
        <h2 className="font-outfit text-4xl md:text-5xl font-black text-white mb-6">Why HumanInk?</h2>
        <p className="text-gray-400 text-lg md:text-xl font-light max-w-2xl mx-auto">
          Generic AI sounds like everyone else. HumanInk sounds exactly like <span className="text-white font-medium">you</span>.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* The Problem (ChatGPT/Claude/Gemini) */}
        <div className="rounded-3xl bg-[#0a0a0c]/80 backdrop-blur-2xl border border-red-500/20 p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-[80px]" />
          <h3 className="font-outfit text-2xl font-bold text-white mb-8 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 text-sm">✕</span>
            ChatGPT / Claude / Gemini
          </h3>
          
          <ul className="space-y-8">
            <li className="flex items-start gap-4">
              <span className="text-red-500/70 mt-1">→</span>
              <div>
                <p className="text-white font-bold text-lg mb-1">Generic "AI Voice"</p>
                <p className="text-gray-400 text-base leading-relaxed">Uses predictable vocabulary (delve, tapestry, testament) that instantly signals it was machine-written.</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-red-500/70 mt-1">→</span>
              <div>
                <p className="text-white font-bold text-lg mb-1">Flat Sentence Rhythm</p>
                <p className="text-gray-400 text-base leading-relaxed">Every sentence is exactly 15-20 words long, lacking the natural "burstiness" of human thought.</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-red-500/70 mt-1">→</span>
              <div>
                <p className="text-white font-bold text-lg mb-1">One-Size-Fits-All</p>
                <p className="text-gray-400 text-base leading-relaxed">A prompt like "write in my style" just defaults to a generic enthusiastic tone.</p>
              </div>
            </li>
          </ul>
        </div>

        {/* The Solution (HumanInk) */}
        <div className="rounded-3xl bg-gradient-to-br from-ink-primary/10 to-ink-secondary/10 backdrop-blur-2xl border border-ink-secondary/30 p-8 md:p-12 relative overflow-hidden shadow-[0_0_50px_rgba(217,70,239,0.1)]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-ink-secondary/20 rounded-full blur-[80px]" />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          <h3 className="font-outfit text-2xl font-bold text-white mb-8 flex items-center gap-3 relative z-10">
            <span className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-sm">✓</span>
            HumanInk Neural Engine
          </h3>
          
          <ul className="space-y-8 relative z-10">
            <li className="flex items-start gap-4">
              <span className="text-emerald-400 mt-1">→</span>
              <div>
                <p className="text-white font-bold text-lg mb-1">Exact Vocabulary Mapping</p>
                <p className="text-gray-300 text-base leading-relaxed">Strictly enforces your specific vocabulary distribution, completely banning generic LLM filler words.</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-emerald-400 mt-1">→</span>
              <div>
                <p className="text-white font-bold text-lg mb-1">High-Variance Burstiness</p>
                <p className="text-gray-300 text-base leading-relaxed">The Critic agent mathematically measures sentence lengths to ensure natural, human-like pacing.</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-emerald-400 mt-1">→</span>
              <div>
                <p className="text-white font-bold text-lg mb-1">True Stylistic Cloning</p>
                <p className="text-gray-300 text-base leading-relaxed">Uses adversarial Reflexion Loops to analyze and replicate your exact punctuation quirks, not just "tone."</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

const PipelineExplorer = () => {
  const [activeNode, setActiveNode] = useState('profiler');

  const nodes = [
    {
      id: 'input',
      label: 'RAW_INPUT',
      log: '> Receiving payload...\n> Size: 482 words\n> Status: Awaiting processing...',
      color: 'text-gray-400',
      bg: 'bg-white/5',
      border: 'border-white/20',
      shadow: 'shadow-none',
      description: 'The raw text payload submitted by the user before processing.'
    },
    {
      id: 'profiler',
      label: 'PROFILER_AGENT',
      log: '{\n  "status": "extracting_dna",\n  "burstiness_score": 0.82,\n  "tone": "academic",\n  "vocabulary_complexity": 0.94,\n  "sentence_length_variance": 14.5\n}',
      color: 'text-ink-primary',
      bg: 'bg-ink-primary/10',
      border: 'border-ink-primary/40',
      shadow: 'shadow-[0_0_30px_rgba(139,92,246,0.2)]',
      description: 'Analyzes your writing samples to map vocabulary distribution, sentence length variance, and stylistic quirks.'
    },
    {
      id: 'gatekeeper',
      label: 'GATEKEEPER_AGENT',
      log: '> INITIATING DUAL-GATE SCAN...\n[MODE] DNA-Calibrated (Custom Profile Active)\n[DNA] burstiness_score=2.81 → threshold=1.69\n[MATH_GATE] Input Burstiness: 2.1 → PASSED\n[SEMANTIC] Checking quirks: [em-dashes, And/But openers]\n[SEMANTIC] No AI watermarks found. Natural flow confirmed.\n[RESULT] Text matches DNA profile. Bypassing Writer.\n> COMPUTE SAVED.',
      color: 'text-red-400',
      bg: 'bg-red-500/10',
      border: 'border-red-500/40',
      shadow: 'shadow-[0_0_30px_rgba(239,68,68,0.2)]',
      description: 'A dual-gate firewall with Dynamic Calibration. When a Custom DNA is active, the Math Gate uses your personal burstiness score as the threshold — not a global value. The Semantic Gate also reads your documented quirks so intentional stylistic choices are never flagged as errors.'
    },
    {
      id: 'writer',
      label: 'WRITER_AGENT',
      log: '> INJECTING DNA PROFILE...\n> Applying constraint: [Sentence Variance +12%]\n> Banning tokens: ["delve", "tapestry", "crucial"]\n> DRAFT_01 GENERATED.',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/40',
      shadow: 'shadow-[0_0_30px_rgba(16,185,129,0.2)]',
      description: 'Uses Chain-of-Thought reasoning to surgically inject exact rhythmic variations defined by your Profile.'
    },
    {
      id: 'critic',
      label: 'CRITIC_AGENT',
      log: '> ADVERSARIAL REVIEW ENGAGED.\n> Target Score: 85/100\n> Current Score: 68/100\n[FAIL] Output too robotic. Pacing is flat.\n> FEEDBACK_GENERATED: Break up compound sentences.\n> INITIATING LOOP: Sending back to WRITER_AGENT.',
      color: 'text-ink-secondary',
      bg: 'bg-ink-secondary/10',
      border: 'border-ink-secondary/40',
      shadow: 'shadow-[0_0_30px_rgba(217,70,239,0.2)]',
      description: 'Adversarially evaluates the final draft. If the Human Score falls below 85%, it forces the Writer to immediately restart.'
    },
    {
      id: 'output',
      label: 'HUMANINK_OUT',
      log: '> DRAFT_03 APPROVED.\n> Final Score: 92/100\n> Payload locked and ready for deployment.\n> [PROCESS_COMPLETE]',
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/40',
      shadow: 'shadow-[0_0_30px_rgba(59,130,246,0.2)]',
      description: 'The final, fully authenticated text ready for deployment.'
    }
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-6 py-32 z-10 relative">
      <div className="text-center mb-16">
        <h2 className="font-outfit text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">The Neural Pipeline</h2>
        <p className="text-gray-400 text-lg font-light max-w-2xl mx-auto">
          Discard the standard LLM prompt wrapper. Explore the strict, programmatic microservices that rebuild your text.
        </p>
      </div>

      <div className="w-full max-w-5xl mx-auto">
        
        {/* Microservice Chip Layout */}
        <div className="flex flex-wrap justify-center items-center gap-3 mb-10 relative z-20">
          {nodes.map((node, index) => (
            <React.Fragment key={node.id}>
              <button 
                onClick={() => setActiveNode(node.id)}
                className={`px-5 py-3 font-mono text-[11px] md:text-xs font-semibold tracking-widest uppercase transition-all duration-300 border backdrop-blur-md rounded-md
                  ${activeNode === node.id 
                    ? `${node.color} ${node.bg} ${node.border} ${node.shadow} scale-105` 
                    : 'text-gray-500 bg-transparent border-white/5 hover:border-white/20 hover:text-gray-300'
                  }`}
              >
                {node.label}
              </button>
              
              {/* Connector */}
              {index < nodes.length - 1 && (
                <div className="text-white/20 font-light hidden md:block">
                  —
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Active Node Description */}
        <div className="text-center mb-10 h-16 flex items-center justify-center">
          <p className="text-gray-400 font-inter text-[15px] md:text-base max-w-2xl mx-auto animate-[fade-in-up_0.3s_ease-out_forwards]" key={`desc-${activeNode}`}>
            {nodes.find(n => n.id === activeNode)?.description}
          </p>
        </div>

        {/* Studio Terminal UI */}
        <div className="bg-[#030303] rounded-xl border border-white/10 overflow-hidden relative shadow-2xl">
          {/* Top Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#080808]">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-white/10"></div>
              <div className="w-3 h-3 rounded-full bg-white/10"></div>
              <div className="w-3 h-3 rounded-full bg-white/10"></div>
            </div>
            <span className="text-[10px] uppercase tracking-widest font-mono text-gray-500">System Logs // {activeNode.toUpperCase()}</span>
            <div className="w-4 h-4 opacity-50 flex items-center justify-center">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></div>
            </div>
          </div>
          
          {/* Terminal Body with glowing scanline effect */}
          <div className="p-8 font-mono text-sm md:text-[15px] leading-loose text-gray-300 min-h-[280px] relative overflow-hidden group">
            {(activeNode !== 'input' && activeNode !== 'output') && (
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.01] to-transparent h-[200%] w-full -top-[100%] animate-[scan_4s_ease-in-out_infinite] pointer-events-none" />
            )}
            
            {nodes.find(n => n.id === activeNode)?.log.split('\n').map((line, i) => {
              const isAnimated = activeNode !== 'input' && activeNode !== 'output';
              return (
                <div 
                  key={`${activeNode}-${i}`} 
                  className={`mb-2 flex items-start ${isAnimated ? 'opacity-0 animate-[fade-in-up_0.3s_ease-out_forwards]' : 'opacity-100'}`} 
                  style={isAnimated ? { animationDelay: `${i * 0.1}s` } : {}}
                >
                  <span className="text-gray-600 mr-6 select-none shrink-0">{(i+1).toString().padStart(2, '0')}</span>
                  <span className={`
                    ${(line.startsWith('{') || line.startsWith('}') || line.includes('":')) ? 'text-emerald-400' : ''}
                    ${line.includes('[FAIL]') ? 'text-red-400 font-bold' : ''}
                    ${(line.includes('SUCCESS') || line.includes('[OK]') || line.includes('GRANTED')) ? 'text-green-400 font-bold' : ''}
                    ${line.startsWith('>') ? 'text-gray-400' : ''}
                  `}>
                    {line}
                  </span>
                </div>
              );
            })}
            
            {/* Blinking Cursor */}
            <div 
              key={`cursor-${activeNode}`}
              className={`flex items-start mt-4 ${activeNode !== 'input' && activeNode !== 'output' ? 'opacity-0 animate-[fade-in-up_0.3s_ease-out_forwards]' : 'opacity-100'}`} 
              style={activeNode !== 'input' && activeNode !== 'output' ? { animationDelay: `${nodes.find(n => n.id === activeNode)?.log.split('\n').length * 0.1 || 0.5}s` } : {}}
            >
              <span className="text-gray-600 mr-6 select-none">{(nodes.find(n => n.id === activeNode)?.log.split('\n').length + 1).toString().padStart(2, '0')}</span>
              <span className="w-2 h-5 bg-white/40 animate-pulse"></span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

const AgentProtocolSection = () => {
  const protocols = [
    {
      icon: <FileCode2 size={22} />,
      tag: 'AGENTS.MD',
      tagColor: 'text-pink-400 border-pink-500/30 bg-pink-500/10',
      title: 'Agent Identity Standard',
      by: 'open standard',
      description: 'Every HumanInk agent publishes an AGENTS.md — a machine-readable identity card declaring its capabilities, input/output schema, and constraints. The entire AI ecosystem can discover and invoke your agents correctly.',
      gain: 'HumanInk agents become first-class citizens of the global agent ecosystem.',
      glow: 'group-hover:shadow-[0_0_40px_rgba(236,72,153,0.15)]',
      border: 'border-pink-500/20 hover:border-pink-500/40',
    },
    {
      icon: <Layers size={22} />,
      tag: 'SKILLS',
      tagColor: 'text-orange-400 border-orange-500/30 bg-orange-500/10',
      title: 'Packaged Skill Marketplace',
      by: 'open standard',
      description: 'Each HumanInk capability — DNA extraction, humanization, authenticity scoring — is packaged as a reusable Skill. Any agent orchestrator (CrewAI, AutoGPT, LangGraph Cloud) can discover and import them.',
      gain: 'HumanInk stops being a product and becomes a platform others build on.',
      glow: 'group-hover:shadow-[0_0_40px_rgba(249,115,22,0.15)]',
      border: 'border-orange-500/20 hover:border-orange-500/40',
    },
    {
      icon: <Globe size={22} />,
      tag: 'MCP',
      tagColor: 'text-violet-400 border-violet-500/30 bg-violet-500/10',
      title: 'Model Context Protocol',
      by: 'by Anthropic',
      description: 'HumanInk becomes a universal tool plug-in. Any MCP-compatible model — Claude, GPT, Gemini — can call your humanization pipeline directly from their environment. Write in Notion, get humanized in real time.',
      gain: 'Chrome Extension & Workspace integrations become trivial MCP calls.',
      glow: 'group-hover:shadow-[0_0_40px_rgba(139,92,246,0.15)]',
      border: 'border-violet-500/20 hover:border-violet-500/40',
    },
    {
      icon: <Network size={22} />,
      tag: 'A2A',
      tagColor: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
      title: 'Agent-to-Agent Protocol',
      by: 'by Google',
      description: 'HumanInk agents publish capability cards. External AI pipelines discover and hire your Writer, Critic, or Gatekeeper as standalone services. No human needed in between.',
      gain: 'B2B API tier — built automatically. External tools hire your agents directly.',
      glow: 'group-hover:shadow-[0_0_40px_rgba(59,130,246,0.15)]',
      border: 'border-blue-500/20 hover:border-blue-500/40',
    },
    {
      icon: <Cpu size={22} />,
      tag: 'SUBAGENTS',
      tagColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
      title: 'Parallel Subagent Architecture',
      by: 'internal upgrade',
      description: 'The Writer spawns one subagent per paragraph and processes them all simultaneously. The Profiler runs four specialist subagents in parallel for vocabulary, rhythm, quirks, and burstiness.',
      gain: '100-word limit gone. 500 words processed in the same time as 100 today.',
      glow: 'group-hover:shadow-[0_0_40px_rgba(16,185,129,0.15)]',
      border: 'border-emerald-500/20 hover:border-emerald-500/40',
    },
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-6 py-24 z-10 relative">
      {/* Section Header */}
      <div className="text-center mb-16">
        <span className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-gray-400 text-xs font-mono tracking-widest uppercase mb-6">Protocol Layer</span>
        <h2 className="font-outfit text-3xl md:text-4xl font-black text-white mb-4">The Agentic Layer</h2>
        <p className="text-gray-400 text-base md:text-lg font-light max-w-2xl mx-auto">
          HumanInk is being rebuilt from a product into an agent. These open protocols define how it will talk to — and be used by — the entire AI ecosystem.
        </p>
      </div>

      {/* Protocol Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
        {protocols.slice(0, 3).map((p, i) => (
          <div key={i} className={`group relative rounded-2xl bg-[#050507] border ${p.border} p-6 transition-all duration-500 ${p.glow} cursor-default`}>
            {/* Top line accent */}
            <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            
            <div className="flex items-start justify-between mb-5">
              <span className={`px-2.5 py-1 rounded-md border text-xs font-mono font-bold tracking-widest ${p.tagColor}`}>{p.tag}</span>
              <span className="text-gray-600 text-xs font-mono">{p.by}</span>
            </div>

            <div className="flex items-center gap-3 mb-3">
              <span className="text-gray-500 group-hover:text-white transition-colors duration-300">{p.icon}</span>
              <h3 className="font-outfit font-bold text-white text-base">{p.title}</h3>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed mb-5">{p.description}</p>

            {/* Gain line */}
            <div className="border-t border-white/5 pt-4">
              <p className="text-gray-500 text-xs font-mono leading-relaxed">
                <span className="text-gray-600 mr-2">→</span>{p.gain}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom row — 2 cards centered */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
        {protocols.slice(3).map((p, i) => (
          <div key={i} className={`group relative rounded-2xl bg-[#050507] border ${p.border} p-6 transition-all duration-500 ${p.glow} cursor-default`}>
            <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            
            <div className="flex items-start justify-between mb-5">
              <span className={`px-2.5 py-1 rounded-md border text-xs font-mono font-bold tracking-widest ${p.tagColor}`}>{p.tag}</span>
              <span className="text-gray-600 text-xs font-mono">{p.by}</span>
            </div>

            <div className="flex items-center gap-3 mb-3">
              <span className="text-gray-500 group-hover:text-white transition-colors duration-300">{p.icon}</span>
              <h3 className="font-outfit font-bold text-white text-base">{p.title}</h3>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed mb-5">{p.description}</p>

            <div className="border-t border-white/5 pt-4">
              <p className="text-gray-500 text-xs font-mono leading-relaxed">
                <span className="text-gray-600 mr-2">→</span>{p.gain}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const RoadmapSection = () => {
  return (
    <section className="w-full max-w-7xl mx-auto px-6 py-24 z-10 relative">
      <div className="text-center mb-16">
        <h2 className="font-outfit text-3xl md:text-4xl font-black text-white mb-4">The Horizon</h2>
        <p className="text-gray-400 text-base md:text-lg font-light max-w-2xl mx-auto">
          We are constantly pushing the boundaries of stylistic cloning. Here is what's coming next.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Highlighted Feature 1 - SHIPPED */}
        <div className="md:col-span-3 rounded-2xl bg-[#0a0a0c]/80 backdrop-blur-xl border border-blue-500/30 p-8 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold tracking-widest uppercase border border-blue-500/30">✦ Shipped</span>
              <h3 className="font-outfit text-2xl font-bold text-white">Dynamic Gatekeeper Calibration</h3>
            </div>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed max-w-3xl">
              The Gatekeeper no longer uses one-size-fits-all thresholds. When a Custom DNA is active, it reads your 
              <strong> personal burstiness score</strong> — saved at extraction time — and uses 60% of that as the bypass threshold. 
              A Hemingway-style writer with natural variance of 2.8 gets a threshold of 1.68, not the global 4.0 that would have wrongly forced a rewrite. 
              The Semantic Gate is also DNA-aware: your documented quirks are injected into the LLM prompt so intentional stylistic choices are never flagged as errors.
            </p>
          </div>
        </div>

        {/* Highlighted Feature 2 */}
        <div className="md:col-span-3 rounded-2xl bg-[#0a0a0c]/80 backdrop-blur-xl border border-emerald-500/30 p-8 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold tracking-widest uppercase border border-emerald-500/30">HumanInk Labs</span>
              <h3 className="font-outfit text-2xl font-bold text-white">Field DNA Retriever — Domain-Aware Academic Writing</h3>
            </div>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-3 max-w-4xl">
              A retrieval-powered agent that learns how researchers in your field actually write. The <strong>Field DNA Retriever</strong> searches 
              arXiv and trusted scholarly sources based on your target venue — extracting real writing patterns, technical vocabulary density, 
              citation rhythm, and sentence structure conventions from recent papers in your <em>exact</em> research community.
            </p>
            <p className="text-emerald-400 text-sm font-medium italic mb-6 max-w-4xl">
              Instead of mimicking academic writing, HumanInk learns from the writing culture of your research community.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-emerald-400 font-mono text-xs tracking-widest uppercase mb-1">Venue Targeting</p>
                <p className="text-gray-400 text-xs">Specify NeurIPS, IEEE CVPR, NEJM, or Nature — not just a broad topic — for laser-precise style retrieval. IEEE papers are sourced via free arXiv preprints.</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-emerald-400 font-mono text-xs tracking-widest uppercase mb-1">Section-Aware Style</p>
                <p className="text-gray-400 text-xs">Extracts different style signals per section — Abstract, Methodology, and Discussion write completely differently.</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-emerald-400 font-mono text-xs tracking-widest uppercase mb-1">Current Research Voice</p>
                <p className="text-gray-400 text-xs">Only uses papers from the last 2 years. Writing conventions evolve — stale style means an outdated voice.</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-emerald-400 font-mono text-xs tracking-widest uppercase mb-1">Blend Mode</p>
                <p className="text-gray-400 text-xs">Writing at the intersection of two fields? Pick two venues and blend their Field DNAs together.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Standard Features */}
        <div className="rounded-xl border border-white/10 bg-[#050505] p-6 hover:border-white/20 transition-colors">
          <h4 className="font-outfit font-bold text-white mb-2">Team & Enterprise DNAs</h4>
          <p className="text-gray-400 text-sm">Allow organizations to extract a unified "Brand DNA" and apply it to their entire team's workspace.</p>
        </div>
        
        <div className="rounded-xl border border-white/10 bg-[#050505] p-6 hover:border-white/20 transition-colors">
          <h4 className="font-outfit font-bold text-white mb-2">Deep Workspace Integration</h4>
          <p className="text-gray-400 text-sm">A seamless browser extension for real-time humanization inside Google Docs and Notion.</p>
        </div>

        <div className="rounded-xl border border-white/10 bg-[#050505] p-6 hover:border-white/20 transition-colors">
          <h4 className="font-outfit font-bold text-white mb-2">Enhanced Profiler</h4>
          <p className="text-gray-400 text-sm">Allow users to upload PDFs or scrape entire blog domains to extract highly robust style profiles.</p>
        </div>
      </div>
    </section>
  );
};

export default Home;
