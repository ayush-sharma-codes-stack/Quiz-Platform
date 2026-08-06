import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Crown } from 'lucide-react';
import { LeaderboardEntry } from '../types';

interface LeaderboardPodiumProps {
  topThree: LeaderboardEntry[];
}

export const LeaderboardPodium: React.FC<LeaderboardPodiumProps> = ({ topThree }) => {
  const first = topThree[0];
  const second = topThree[1];
  const third = topThree[2];

  if (!first) return null;

  return (
    <div className="flex justify-center items-end gap-3 sm:gap-6 my-8 px-2 max-w-2xl mx-auto">
      {/* 2nd Place - Silver */}
      {second ? (
        <motion.div
          className="flex flex-col items-center flex-1"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="w-12 h-12 rounded-full bg-slate-300/20 border-2 border-slate-300 flex items-center justify-center text-slate-300 mb-2 shadow-lg">
            <Medal className="w-6 h-6" />
          </div>
          <span className="font-display font-bold text-sm text-slate-200 truncate max-w-[100px]">
            {second.name || second.user?.name}
          </span>
          <span className="text-xs text-slate-400 font-semibold">{second.xp || second.score} {second.xp !== undefined ? 'XP' : 'pts'}</span>

          <div className="w-full bg-gradient-to-t from-slate-800 to-slate-700/80 rounded-t-2xl h-32 sm:h-40 mt-3 flex flex-col items-center justify-center border-t-4 border-slate-300 shadow-xl">
            <span className="font-display font-extrabold text-3xl text-slate-300">2</span>
            <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">SILVER</span>
          </div>
        </motion.div>
      ) : (
        <div className="flex-1" />
      )}

      {/* 1st Place - Gold */}
      <motion.div
        className="flex flex-col items-center flex-1 z-10"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="relative">
          <Crown className="w-7 h-7 text-amber-400 absolute -top-5 left-1/2 transform -translate-x-1/2 animate-bounce-subtle" />
          <div className="w-16 h-16 rounded-full bg-amber-500/20 border-4 border-amber-400 flex items-center justify-center text-amber-400 mb-2 shadow-xl shadow-amber-500/30">
            <Trophy className="w-8 h-8 fill-amber-400" />
          </div>
        </div>
        <span className="font-display font-extrabold text-base text-amber-300 truncate max-w-[120px]">
          {first.name || first.user?.name}
        </span>
        <span className="text-xs text-amber-400 font-extrabold">{first.xp || first.score} {first.xp !== undefined ? 'XP' : 'pts'}</span>

        <div className="w-full bg-gradient-to-t from-amber-950 via-amber-900/90 to-amber-600/90 rounded-t-3xl h-44 sm:h-52 mt-3 flex flex-col items-center justify-center border-t-4 border-amber-400 shadow-2xl shadow-amber-500/20">
          <span className="font-display font-extrabold text-4xl text-amber-300">1</span>
          <span className="text-xs font-black tracking-widest uppercase text-amber-200">CHAMPION</span>
        </div>
      </motion.div>

      {/* 3rd Place - Bronze */}
      {third ? (
        <motion.div
          className="flex flex-col items-center flex-1"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="w-12 h-12 rounded-full bg-amber-800/30 border-2 border-amber-600 flex items-center justify-center text-amber-500 mb-2 shadow-lg">
            <Medal className="w-6 h-6" />
          </div>
          <span className="font-display font-bold text-sm text-slate-200 truncate max-w-[100px]">
            {third.name || third.user?.name}
          </span>
          <span className="text-xs text-slate-400 font-semibold">{third.xp || third.score} {third.xp !== undefined ? 'XP' : 'pts'}</span>

          <div className="w-full bg-gradient-to-t from-slate-900 to-amber-950/70 rounded-t-2xl h-24 sm:h-32 mt-3 flex flex-col items-center justify-center border-t-4 border-amber-600 shadow-xl">
            <span className="font-display font-extrabold text-2xl text-amber-500">3</span>
            <span className="text-[10px] font-bold tracking-widest uppercase text-amber-600">BRONZE</span>
          </div>
        </motion.div>
      ) : (
        <div className="flex-1" />
      )}
    </div>
  );
};
