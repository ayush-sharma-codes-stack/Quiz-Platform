import React from 'react';
import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color?: 'purple' | 'teal' | 'amber' | 'coral' | 'emerald' | 'indigo';
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color = 'purple',
}) => {
  const colorMap = {
    purple: 'from-purple-950/60 to-slate-900 border-purple-800/50 text-purple-400',
    teal: 'from-teal-950/60 to-slate-900 border-teal-800/50 text-teal-400',
    amber: 'from-amber-950/60 to-slate-900 border-amber-800/50 text-amber-400',
    coral: 'from-rose-950/60 to-slate-900 border-rose-800/50 text-rose-400',
    emerald: 'from-emerald-950/60 to-slate-900 border-emerald-800/50 text-emerald-400',
    indigo: 'from-indigo-950/60 to-slate-900 border-indigo-800/50 text-indigo-400',
  };

  const iconBgMap = {
    purple: 'bg-purple-900/50 text-purple-300 border-purple-700/50',
    teal: 'bg-teal-900/50 text-teal-300 border-teal-700/50',
    amber: 'bg-amber-900/50 text-amber-300 border-amber-700/50',
    coral: 'bg-rose-900/50 text-rose-300 border-rose-700/50',
    emerald: 'bg-emerald-900/50 text-emerald-300 border-emerald-700/50',
    indigo: 'bg-indigo-900/50 text-indigo-300 border-indigo-700/50',
  };

  return (
    <motion.div
      whileHover={{ y: -3 }}
      className={`bg-gradient-to-br ${colorMap[color]} border rounded-3xl p-5 shadow-lg relative overflow-hidden`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-display">
          {title}
        </span>
        <div className={`p-2.5 rounded-2xl border ${iconBgMap[color]}`}>{icon}</div>
      </div>

      <div className="font-display font-extrabold text-3xl sm:text-4xl text-slate-100 mb-1 tracking-tight">
        {value}
      </div>

      {subtitle && <p className="text-xs text-slate-400 font-medium">{subtitle}</p>}
    </motion.div>
  );
};
