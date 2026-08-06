import React from 'react';
import { Gamepad2, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400 py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-display font-bold text-slate-300">
          <Gamepad2 className="w-5 h-5 text-teal-400" />
          <span>QuizArena Assessment Platform</span>
        </div>

        <div className="flex items-center gap-1 text-xs font-semibold text-slate-500">
          <span>Crafted with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>for Gamified Learning</span>
        </div>
      </div>
    </footer>
  );
};
