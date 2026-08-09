import React from 'react';
import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color?: 'purple' | 'teal' | 'amber' | 'coral' | 'emerald' | 'indigo' | 'pink' | 'cyan';
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color = 'purple',
}) => {
  const colorMap = {
    purple: 'bg-gradient-to-br from-purple-900/80 via-slate-900 to-slate-950 border-purple-600/60 shadow-game-purple-sm hover:border-purple-400',
    teal: 'bg-gradient-to-br from-teal-900/80 via-slate-900 to-slate-950 border-teal-600/60 shadow-game-teal-sm hover:border-teal-400',
    amber: 'bg-gradient-to-br from-amber-900/80 via-slate-900 to-slate-950 border-amber-600/60 shadow-game-amber-sm hover:border-amber-400',
    coral: 'bg-gradient-to-br from-rose-900/80 via-slate-900 to-slate-950 border-rose-600/60 shadow-game-coral-sm hover:border-rose-400',
    emerald: 'bg-gradient-to-br from-emerald-900/80 via-slate-900 to-slate-950 border-emerald-600/60 shadow-game-emerald-sm hover:border-emerald-400',
    indigo: 'bg-gradient-to-br from-indigo-900/80 via-slate-900 to-slate-950 border-indigo-600/60 shadow-game-indigo-sm hover:border-indigo-400',
    pink: 'bg-gradient-to-br from-pink-900/80 via-slate-900 to-slate-950 border-pink-600/60 shadow-game-pink-sm hover:border-pink-400',
    cyan: 'bg-gradient-to-br from-cyan-900/80 via-slate-900 to-slate-950 border-cyan-600/60 shadow-game-cyan-sm hover:border-cyan-400',
  };

  const iconBgMap = {
    purple: 'bg-purple-600/20 text-purple-300 border-purple-500/50 shadow-inner',
    teal: 'bg-teal-600/20 text-teal-300 border-teal-500/50 shadow-inner',
    amber: 'bg-amber-600/20 text-amber-300 border-amber-500/50 shadow-inner',
    coral: 'bg-rose-600/20 text-rose-300 border-rose-500/50 shadow-inner',
    emerald: 'bg-emerald-600/20 text-emerald-300 border-emerald-500/50 shadow-inner',
    indigo: 'bg-indigo-600/20 text-indigo-300 border-indigo-500/50 shadow-inner',
    pink: 'bg-pink-600/20 text-pink-300 border-pink-500/50 shadow-inner',
    cyan: 'bg-cyan-600/20 text-cyan-300 border-cyan-500/50 shadow-inner',
  };

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      className={`border-2 rounded-3xl p-5 relative overflow-hidden transition-colors duration-200 cursor-pointer backdrop-blur-xl ${colorMap[color]}`}
    >
      {/* Top Glossy Highlight Line */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-black uppercase tracking-wider text-slate-300 font-display">
          {title}
        </span>
        <div className={`p-3 rounded-2xl border-2 ${iconBgMap[color]}`}>{icon}</div>
      </div>

      <div className="font-display font-black text-3xl sm:text-4xl text-white mb-1 tracking-tight drop-shadow-md">
        {value}
      </div>

      {subtitle && <p className="text-xs text-slate-400 font-semibold">{subtitle}</p>}
    </motion.div>
  );
};
