import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

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
    <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 p-2.5 rounded-2xl shadow-inner">
      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 font-display font-extrabold text-base shadow-md">
        L{level}
      </div>

      <div className="flex-1">
        {showDetails && (
          <div className="flex justify-between items-center text-xs font-semibold mb-1">
            <span className="text-amber-400 flex items-center gap-1 font-display">
              <Zap className="w-3.5 h-3.5 fill-amber-400" /> {xp} XP
            </span>
            <span className="text-slate-400">{progressPercentage}% to L{level + 1}</span>
          </div>
        )}

        <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-teal-400 rounded-full shadow-lg shadow-amber-500/20"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, Math.max(0, progressPercentage))}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>
    </div>
  );
};
