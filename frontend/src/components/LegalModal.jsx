import React, { useState } from 'react';
import { X, Shield, Lock, FileText } from 'lucide-react';

const LegalModal = ({ onClose, initialTab = 'privacy' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  const tabs = [
    { id: 'privacy', label: 'Privacy Policy', icon: <Lock size={16} /> },
    { id: 'security', label: 'Security', icon: <Shield size={16} /> },
    { id: 'terms', label: 'Terms of Use', icon: <FileText size={16} /> }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-4xl h-[80vh] bg-[#0f0f13] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-ink-primary/10 rounded-full blur-[100px] mix-blend-screen pointer-events-none" />

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors z-20"
        >
          <X size={24} />
        </button>

        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/10 p-6 flex flex-col gap-2 shrink-0 bg-black/20">
          <h2 className="font-outfit font-bold text-xl text-white mb-6">Legal & Security</h2>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id 
                  ? 'bg-ink-primary/20 text-ink-primary border border-ink-primary/30' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8 md:p-10 overflow-y-auto custom-scrollbar relative z-10 text-gray-300 font-inter text-sm leading-relaxed">
          
          {activeTab === 'privacy' && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <h3 className="text-2xl font-bold text-white font-outfit mb-4">Privacy Policy</h3>
              <p>At HumanInk, your data is yours. We process text strictly for the purpose of neural rewriting and do not store your inputs longer than required to return the output.</p>
              <h4 className="text-lg font-bold text-white mt-6 mb-2">1. Data Collection</h4>
              <p>We collect your authentication details via Clerk, and your custom DNA profiles. DNA profiles are stored securely in Supabase.</p>
              <h4 className="text-lg font-bold text-white mt-6 mb-2">2. LLM Processing</h4>
              <p>Outputs are generated using third-party APIs. We ensure that our API agreements prohibit third-party model providers from training on your proprietary data.</p>
              <h4 className="text-lg font-bold text-white mt-6 mb-2">3. Data Retention</h4>
              <p>You can delete your DNA profiles at any time. Active stream history is ephemeral and disappears when you refresh your workspace.</p>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <h3 className="text-2xl font-bold text-white font-outfit mb-4">Security Overview</h3>
              <p>HumanInk is built with zero-trust architecture principles in mind.</p>
              <h4 className="text-lg font-bold text-white mt-6 mb-2">Authentication</h4>
              <p>We use Clerk for highly secure, SOC2 compliant user authentication. We never handle your passwords directly.</p>
              <h4 className="text-lg font-bold text-white mt-6 mb-2">Database Security</h4>
              <p>Our Supabase database relies on strict Row Level Security (RLS) and Service Role isolation. Frontend clients have strictly zero read/write access to sensitive columns.</p>
              <h4 className="text-lg font-bold text-white mt-6 mb-2">Encryption</h4>
              <p>All data in transit is encrypted using TLS 1.3. Data at rest is encrypted using AES-256 block-level encryption managed by Supabase.</p>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <h3 className="text-2xl font-bold text-white font-outfit mb-4">Terms of Use</h3>
              <p>By accessing HumanInk, you agree to these terms.</p>
              <h4 className="text-lg font-bold text-white mt-6 mb-2">1. Acceptable Use</h4>
              <p>HumanInk is designed to bypass automated filters by generating human-like rhythmic text. However, you may not use HumanInk to generate illegal, hateful, or harmful content.</p>
              <h4 className="text-lg font-bold text-white mt-6 mb-2">2. Fair Usage</h4>
              <p>The Free Plan is subject to strict rate limits to protect our API. Attempting to bypass the credit system or flooding the API will result in immediate termination.</p>
              <h4 className="text-lg font-bold text-white mt-6 mb-2">3. Liability</h4>
              <p>HumanInk is provided "as is". We do not guarantee that output will perfectly evade all detection systems at all times, as AI detection is constantly evolving.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default LegalModal;
