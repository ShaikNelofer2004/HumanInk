import React from 'react';
import { Activity } from 'lucide-react';

const StatsPanel = ({ score = 0, status = "Idle" }) => {
  return (
    <div className="w-full bg-[#0a0a0c]/80 backdrop-blur-xl border-t border-white/5 px-6 py-4 flex items-center justify-start shadow-[0_-10px_40px_rgba(0,0,0,0.5)] h-[72px]">
      
      <div className="flex items-center gap-4 flex-1 min-w-0 pr-6">
          <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-lg border border-white/10 max-w-full overflow-hidden">
             <Activity size={16} className={`shrink-0 ${status !== 'Idle' && status !== 'Offline' ? "text-emerald-400 animate-pulse" : "text-gray-500"}`} />
             <span className="text-xs font-outfit uppercase tracking-widest text-gray-400 whitespace-nowrap">Status: <span className={`font-medium ml-1 truncate max-w-[300px] inline-block align-bottom ${status.includes('Failed') ? 'text-amber-400' : 'text-emerald-400'}`}>{status}</span></span>
          </div>
      </div>

    </div>
  );
};

export default StatsPanel;
