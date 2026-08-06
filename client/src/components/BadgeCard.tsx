import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Award } from 'lucide-react';
import { Badge } from '../types';

interface BadgeCardProps {
  badge: Badge;
}

export const BadgeCard: React.FC<BadgeCardProps> = ({ badge }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -2 }}
      className={`relative p-5 rounded-3xl border transition-all duration-200 flex flex-col items-center text-center ${
        badge.isEarned
          ? 'bg-gradient-to-b from-slate-900 to-purple-950/40 border-purple-500/50 shadow-xl shadow-purple-500/10'
          : 'bg-slate-900/40 border-slate-800/80 grayscale opacity-60'
      }`}
    >
      <div className="relative mb-3">
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-md ${
            badge.isEarned
              ? 'bg-gradient-to-tr from-purple-600 to-indigo-500 text-white shadow-purple-500/30 ring-2 ring-purple-400'
              : 'bg-slate-800 text-slate-500'
          }`}
        >
          {badge.icon || <Award className="w-8 h-8" />}
        </div>
        {!badge.isEarned && (
          <div className="absolute -bottom-1 -right-1 bg-slate-950 p-1.5 rounded-full border border-slate-700 text-slate-400">
            <Lock className="w-3.5 h-3.5" />
          </div>
        )}
      </div>

      <h4 className="font-display font-bold text-base text-slate-100 mb-1">{badge.name}</h4>
      <p className="text-xs text-slate-400 leading-relaxed max-w-[200px] mb-2">{badge.description}</p>

      {badge.isEarned && badge.earnedAt && (
        <span className="text-[10px] font-semibold text-purple-400 bg-purple-950/60 border border-purple-800/50 px-2.5 py-0.5 rounded-full">
          Unlocked {new Date(badge.earnedAt).toLocaleDateString()}
        </span>
      )}
    </motion.div>
  );
};
