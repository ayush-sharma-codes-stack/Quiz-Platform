import React from 'react';
import { Gamepad2, Heart, Sparkles, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t-2 border-slate-800/90 bg-slate-950/95 text-slate-400 py-8 px-4 sm:px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left Brand info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-sm">
            <Gamepad2 className="w-5 h-5 text-amber-400" />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-display font-black text-sm text-white flex items-center gap-1.5">
              QuizArena Arcade <Sparkles className="w-3.5 h-3.5 text-amber-400 inline" />
            </span>
            <span className="text-xs text-slate-500 font-semibold">
              Next-Gen Gamified Knowledge Platform
            </span>
          </div>
        </div>

        {/* Center Live Status Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Server Status: <span className="text-emerald-400">100% Operational</span></span>
        </div>

        {/* Right Tagline */}
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
          <span>Built with</span>
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-bounce-subtle" />
          <span>for Ultimate Gamified Learning</span>
        </div>
      </div>
    </footer>
  );
};
