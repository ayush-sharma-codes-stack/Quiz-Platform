import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Sparkles } from 'lucide-react';

interface XPProgressBarProps {
  level: number;
  xp: number;
  progressPercentage: number;
  showDetails?: boolean;
}

export const XPProgressBar: React.FC<XPProgressBarProps> = ({
  level,
  xp,
  progressPercentage,
  showDetails = true,
}) => {
  return (
    <div className="flex items-center gap-3.5 bg-slate-900/90 border-2 border-slate-700/80 p-3 rounded-3xl shadow-game-purple-sm backdrop-blur-xl">
      {/* 3D Level Badge */}
      <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-500 text-slate-950 font-display font-black text-lg border-2 border-yellow-200 shadow-game-amber-sm">
        <Sparkles className="w-3.5 h-3.5 absolute top-0.5 right-0.5 text-slate-950/60" />
        L{level}
      </div>

      <div className="flex-1">
        {showDetails && (
          <div className="flex justify-between items-center text-xs font-black mb-1.5 font-display tracking-wide">
            <span className="text-amber-400 flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
              <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {xp} XP
            </span>
            <span className="text-purple-300 font-extrabold">{progressPercentage}% to L{level + 1}</span>
          </div>
        )}

        {/* 3D Glossy Progress Bar */}
        <div className="w-full h-4 bg-slate-950 rounded-full overflow-hidden border-2 border-slate-800 p-0.5 relative shadow-inner">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-500 via-purple-500 to-teal-400 rounded-full shadow-game-glow-purple relative overflow-hidden"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, Math.max(0, progressPercentage))}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {/* Candy Stripe Highlight Effect */}
            <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:16px_16px] animate-shine" />
          </motion.div>
        </div>
      </div>
    </div>
  );
};
