import React, { useState, useEffect } from 'react';
import { PenTool, ArrowRight, Shield, Zap, BrainCircuit, Terminal, Mail, BookOpen, MessageSquare, Search, Target } from 'lucide-react';

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

const Home = ({ onStartSetup }) => {
  return (
    <div className="w-full min-h-screen text-white scroll-smooth relative">

      {/* Shared Background Orbs fixed in background */}
      <div className="fixed top-[10%] left-[20%] w-[600px] h-[600px] bg-ink-primary/5 rounded-full blur-[150px] -z-10 mix-blend-screen pointer-events-none" />
      <div className="fixed bottom-[20%] right-[20%] w-[500px] h-[500px] bg-ink-secondary/5 rounded-full blur-[150px] -z-10 mix-blend-screen pointer-events-none" />

      {/* =========================================
          SECTION 1: HERO
          ========================================= */}
      <section className="min-h-screen flex flex-col justify-between px-12 py-10 relative">
        <div className="flex justify-start items-start w-full max-w-[1600px] mx-auto z-10">
          <h2 className="font-outfit text-2xl md:text-3xl font-medium tracking-tight text-white drop-shadow-md">Experience authenticity.</h2>
        </div>

        <div className="flex flex-col items-center justify-center flex-1 z-10 relative w-full">

          {/* The Infinite Faded Marquee Background */}
          <div className="absolute top-1/2 left-0 w-full overflow-hidden whitespace-nowrap opacity-[0.03] pointer-events-none -translate-y-1/2 flex select-none" style={{ maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)' }}>
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
            <button
              onClick={onStartSetup}
              className="px-8 py-4 rounded-full bg-white text-black font-semibold tracking-wide hover:scale-105 active:scale-95 transition-all flex items-center gap-3 shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:shadow-[0_0_60px_rgba(255,255,255,0.3)]"
            >
              Begin Extraction Setup <ArrowRight size={18} />
            </button>
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
          SECTION 2: PROFILER PIPELINE (Neon Layout)
          ========================================= */}
      <section className="min-h-screen py-20 px-6 relative z-10 max-w-7xl mx-auto w-full flex flex-col md:flex-row items-start gap-20">

        <div className="w-full md:w-1/3 sticky top-40">
          <h2 className="font-outfit text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
            The multi-agent <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-ink-primary to-ink-secondary">pipeline.</span>
          </h2>
          <p className="text-lg text-gray-400 font-light leading-relaxed">
            HumanInk completely discards standard prompt wrapping. Instead, we use a rigid, adversarial agent loop that structurally forces the LLM to output sentences matching your exact neural rhythm.
          </p>
        </div>

        <div className="w-full md:w-2/3 relative pl-8 md:pl-16">
          <div className="absolute left-0 top-0 bottom-0 w-px bg-white/10 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[150px] bg-gradient-to-b from-transparent via-white to-transparent animate-pipeline shadow-[0_0_15px_#fff]" />
          </div>

          <div className="flex flex-col gap-24">
            <div className="relative group">
              <div className="absolute -left-[2.1rem] md:-left-[4.1rem] top-1 w-[5px] h-[5px] rounded-full bg-white/30 group-hover:bg-ink-primary group-hover:shadow-[0_0_20px_#8b5cf6] transition-all duration-300" />
              <div className="flex items-start gap-6">
                <div>
                  <h3 className="font-outfit text-3xl font-bold mb-4 text-white group-hover:text-ink-primary transition-colors">01. The Profiler</h3>
                  <p className="text-gray-400 text-lg leading-relaxed font-light">Analyzes your writing samples to map vocabulary distribution, sentence length variance, and stylistic quirks into a massive, multi-dimensional JSON fingerprint.</p>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -left-[2.1rem] md:-left-[4.1rem] top-1 w-[5px] h-[5px] rounded-full bg-white/30 group-hover:bg-red-500 group-hover:shadow-[0_0_20px_#ef4444] transition-all duration-300" />
              <div className="flex items-start gap-6">
                <div>
                  <h3 className="font-outfit text-3xl font-bold mb-4 text-white group-hover:text-red-400 transition-colors">02. The Gatekeeper</h3>
                  <p className="text-gray-400 text-lg leading-relaxed font-light">A strict dual-gate system (Math + Semantic). It instantly rejects text that feels robotic, hallucinated, or mathematically predictable, acting as an absolute firewall.</p>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -left-[2.1rem] md:-left-[4.1rem] top-1 w-[5px] h-[5px] rounded-full bg-white/30 group-hover:bg-emerald-500 group-hover:shadow-[0_0_20px_#10b981] transition-all duration-300" />
              <div className="flex items-start gap-6">
                <div>
                  <h3 className="font-outfit text-3xl font-bold mb-4 text-white group-hover:text-emerald-400 transition-colors">03. The Writer</h3>
                  <p className="text-gray-400 text-lg leading-relaxed font-light">Uses Chain-of-Thought (CoT) reasoning to intelligently draft text. It doesn't guess; it surgically injects the exact rhythmic variations defined by your Profile.</p>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -left-[2.1rem] md:-left-[4.1rem] top-1 w-[5px] h-[5px] rounded-full bg-white/30 group-hover:bg-ink-secondary group-hover:shadow-[0_0_20px_#d946ef] transition-all duration-300" />
              <div className="flex items-start gap-6">
                <div>
                  <h3 className="font-outfit text-3xl font-bold mb-4 text-white group-hover:text-ink-secondary transition-colors">04. The Critic</h3>
                  <p className="text-gray-400 text-lg leading-relaxed font-light">Adversarially evaluates the final draft against your profile. If the "Simulated Human Score" falls below 75%, it forces the Writer agent to immediately restart the loop.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          SECTION 3: USE CASES BENTO BOX
          ========================================= */}
      <UseCases />

      {/* =========================================
          SECTION 4: THE PROOF (Split Screen Typewriter)
          ========================================= */}
      <TypewriterComparison />

      {/* Footer */}
      <footer className="w-full py-16 border-t border-white/5 relative z-10 bg-[#050505] mt-24">
        <div className="max-w-7xl mx-auto px-6 w-full flex flex-col md:flex-row justify-between items-center gap-10">

          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-3 opacity-30">
              <PenTool size={20} />
              <span className="font-outfit font-bold tracking-widest">HumanInk</span>
            </div>
            <p className="text-gray-600 text-sm">© 2026 Authentic Identity. Zero Fluff.</p>
          </div>

          <div className="flex gap-16 font-inter text-sm font-medium text-gray-400">
            <div className="flex flex-col gap-4">
              <span className="hover:text-white cursor-pointer transition-colors">Documentation</span>
              <span className="hover:text-white cursor-pointer transition-colors">Architecture</span>
            </div>
            <div className="flex flex-col gap-4">
              <span className="hover:text-white cursor-pointer transition-colors">Agents</span>
              <span className="hover:text-white cursor-pointer transition-colors">Source</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
};

export default Home;
