import React from 'react';
import { X, CheckCircle2, Zap } from 'lucide-react';

const PricingModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-4xl bg-[#0f0f13] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-ink-primary/20 rounded-full blur-[100px] mix-blend-screen pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[100px] mix-blend-screen pointer-events-none" />

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors z-20"
        >
          <X size={24} />
        </button>

        {/* Free Tier */}
        <div className="flex-1 p-8 md:p-12 border-b md:border-b-0 md:border-r border-white/10 relative z-10">
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-2">Free Plan</h3>
            <div className="flex items-end gap-1">
              <span className="text-4xl font-black text-white">₹0</span>
              <span className="text-gray-400 mb-1">/ forever</span>
            </div>
          </div>

          <ul className="space-y-4 mb-8">
            <li className="flex items-start gap-3">
              <CheckCircle2 size={18} className="text-gray-500 mt-0.5 shrink-0" />
              <span className="text-gray-300 text-sm">10 Credits per month</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 size={18} className="text-gray-500 mt-0.5 shrink-0" />
              <span className="text-gray-300 text-sm">100 words per request</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 size={18} className="text-gray-500 mt-0.5 shrink-0" />
              <span className="text-gray-300 text-sm">Standard processing speed</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 size={18} className="text-gray-500 mt-0.5 shrink-0" />
              <span className="text-gray-300 text-sm">Basic AI Models</span>
            </li>
          </ul>

          <button 
            disabled
            className="w-full py-3 rounded-lg bg-white/5 border border-white/10 text-gray-400 font-semibold cursor-not-allowed"
          >
            Current Plan
          </button>
        </div>

        {/* Premium Tier */}
        <div className="flex-1 p-8 md:p-12 relative z-10 bg-gradient-to-br from-ink-primary/5 to-transparent">
          <div className="absolute top-0 right-8 transform -translate-y-1/2">
            <span className="bg-ink-primary text-white text-[10px] font-bold uppercase tracking-widest py-1 px-3 rounded-full shadow-[0_0_15px_rgba(142,45,226,0.5)]">
              Coming Soon
            </span>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <Zap size={20} className="text-amber-400" />
              Premium Plan
            </h3>
            <div className="flex items-end gap-1">
              <span className="text-4xl font-black text-white">₹999</span>
              <span className="text-gray-400 mb-1">/ month</span>
            </div>
          </div>

          <ul className="space-y-4 mb-8">
            <li className="flex items-start gap-3">
              <CheckCircle2 size={18} className="text-emerald-400 mt-0.5 shrink-0" />
              <span className="text-white text-sm font-medium">150 Credits per month</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 size={18} className="text-emerald-400 mt-0.5 shrink-0" />
              <span className="text-white text-sm font-medium">800 words per request</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 size={18} className="text-emerald-400 mt-0.5 shrink-0" />
              <span className="text-white text-sm font-medium">Priority processing queue</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 size={18} className="text-emerald-400 mt-0.5 shrink-0" />
              <span className="text-white text-sm font-medium">Advanced reasoning models</span>
            </li>
          </ul>

          <button 
            className="w-full py-3 rounded-lg bg-ink-primary hover:bg-ink-primary/90 text-white font-semibold shadow-[0_0_20px_rgba(142,45,226,0.3)] transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            onClick={onClose}
          >
            Join Waitlist
          </button>
        </div>

      </div>
    </div>
  );
};

export default PricingModal;
