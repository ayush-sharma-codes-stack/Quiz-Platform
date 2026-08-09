import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Award, Sparkles } from 'lucide-react';
import { Badge } from '../types';

interface BadgeCardProps {
  badge: Badge;
}

export const BadgeCard: React.FC<BadgeCardProps> = ({ badge }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      className={`relative p-5 rounded-3xl border-2 transition-all duration-200 flex flex-col items-center text-center backdrop-blur-xl ${
        badge.isEarned
          ? 'bg-gradient-to-b from-purple-900/40 via-slate-900 to-slate-950 border-purple-500/80 shadow-game-purple-sm hover:border-purple-400'
          : 'bg-slate-900/50 border-slate-800/80 opacity-50 grayscale hover:opacity-75'
      }`}
    >
      {/* 3D Trophy Pedestal Icon */}
      <div className="relative mb-3.5">
        <div
          className={`w-20 h-20 rounded-2xl flex items-center justify-center text-3xl transition-transform duration-200 ${
            badge.isEarned
              ? 'bg-gradient-to-tr from-purple-600 via-pink-500 to-amber-400 text-white shadow-game-purple border-2 border-white/30 animate-float'
              : 'bg-slate-800 text-slate-500 border-2 border-slate-700'
          }`}
        >
          {badge.icon || <Award className="w-10 h-10" />}
        </div>
        {badge.isEarned ? (
          <div className="absolute -top-1 -right-1 bg-amber-400 p-1 rounded-full border border-slate-950 text-slate-950 shadow-md">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
        ) : (
          <div className="absolute -bottom-1 -right-1 bg-slate-950 p-1.5 rounded-full border-2 border-slate-700 text-slate-400 shadow-md">
            <Lock className="w-3.5 h-3.5" />
          </div>
        )}
      </div>

      <h4 className="font-display font-black text-base text-white mb-1 tracking-tight">{badge.name}</h4>
      <p className="text-xs text-slate-300 font-semibold leading-relaxed max-w-[200px] mb-2.5">{badge.description}</p>

      {badge.isEarned && badge.earnedAt && (
        <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-xl shadow-sm">
          Unlocked {new Date(badge.earnedAt).toLocaleDateString()}
        </span>
      )}
    </motion.div>
  );
};
