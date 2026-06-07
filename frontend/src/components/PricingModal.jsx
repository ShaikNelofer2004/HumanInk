import React from 'react';
import { X, CheckCircle2, Zap, Sparkles, Infinity } from 'lucide-react';

const PricingModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-5xl bg-[#09090b] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Background Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-ink-primary/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />

        {/* Header */}
        <div className="relative z-20 flex justify-between items-center p-6 sm:px-10 sm:pt-10 sm:pb-6">
          <div>
            <h2 className="text-3xl font-outfit font-bold text-white tracking-tight">Upgrade your Neural Loop</h2>
            <p className="text-gray-400 mt-2 font-light">Choose the pipeline capacity that fits your workflow.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-gray-400 hover:text-white transition-all hover:rotate-90 duration-300"
          >
            <X size={20} />
          </button>
        </div>

        {/* Pricing Cards */}
        <div className="relative z-10 flex flex-col md:flex-row gap-6 p-6 sm:px-10 sm:pb-10">
          
          {/* Free Tier */}
          <div className="flex-1 p-8 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col relative overflow-hidden group hover:bg-white/[0.04] transition-colors duration-500">
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-2 font-outfit">Free Plan</h3>
              <p className="text-sm text-gray-500 mb-6">Perfect for testing the pipeline.</p>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black text-white tracking-tighter">₹0</span>
                <span className="text-gray-500 font-medium">/ forever</span>
              </div>
            </div>

            <ul className="space-y-4 mb-10 flex-1">
              <li className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-gray-600 mt-0.5 shrink-0" />
                <span className="text-gray-300 text-sm">10 Credits per month</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-gray-600 mt-0.5 shrink-0" />
                <span className="text-gray-300 text-sm">100 words per request</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-gray-600 mt-0.5 shrink-0" />
                <span className="text-gray-300 text-sm">Standard processing queue</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-gray-600 mt-0.5 shrink-0" />
                <span className="text-gray-300 text-sm">Basic semantic engine</span>
              </li>
            </ul>

            <button 
              disabled
              className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-gray-400 font-bold uppercase tracking-widest text-xs cursor-not-allowed"
            >
              Current Plan
            </button>
          </div>

          {/* Premium Tier */}
          <div className="flex-1 p-8 rounded-3xl bg-gradient-to-b from-ink-primary/10 to-[#09090b] border border-ink-primary/40 flex flex-col relative overflow-hidden shadow-[0_0_50px_rgba(142,45,226,0.1)] group">
            
            {/* Glowing top border */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-ink-primary to-transparent" />
            
            <div className="absolute top-6 right-6">
              <span className="bg-ink-primary/20 border border-ink-primary/50 text-ink-primary text-[10px] font-bold uppercase tracking-widest py-1.5 px-3 rounded-full flex items-center gap-1.5 animate-pulse">
                <Sparkles size={12} /> Coming Soon
              </span>
            </div>

            <div className="mb-8 mt-2">
              <h3 className="text-xl font-bold text-white mb-2 font-outfit flex items-center gap-2">
                <Zap size={20} className="text-amber-400" />
                Premium Plan
              </h3>
              <p className="text-sm text-gray-400 mb-6">For high-stakes, high-volume workflows.</p>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400 tracking-tighter">₹999</span>
                <span className="text-gray-500 font-medium">/ month</span>
              </div>
            </div>

            <ul className="space-y-4 mb-10 flex-1">
              <li className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-ink-primary mt-0.5 shrink-0" />
                <span className="text-white text-sm font-medium">150 Credits per month</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-ink-primary mt-0.5 shrink-0" />
                <span className="text-white text-sm font-medium">800 words per request</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-ink-primary mt-0.5 shrink-0" />
                <span className="text-white text-sm font-medium">Priority multi-agent processing</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-ink-primary mt-0.5 shrink-0" />
                <span className="text-white text-sm font-medium">Advanced LLM reasoning engine</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-ink-primary mt-0.5 shrink-0" />
                <span className="text-white text-sm font-medium">Early access to new DNA parameters</span>
              </li>
            </ul>

            <button 
              className="w-full py-4 rounded-xl bg-gradient-to-r from-ink-primary to-ink-secondary text-white font-bold uppercase tracking-widest text-xs shadow-[0_0_20px_rgba(142,45,226,0.4)] transition-all transform hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(142,45,226,0.6)] active:scale-[0.98]"
              onClick={onClose}
            >
              Join Waitlist
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PricingModal;
