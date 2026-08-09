import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Crown, Sparkles } from 'lucide-react';
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
    <div className="flex justify-center items-end gap-3 sm:gap-6 my-10 px-2 max-w-2xl mx-auto">
      {/* 2nd Place - Silver */}
      {second ? (
        <motion.div
          className="flex flex-col items-center flex-1"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="relative mb-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-slate-400 to-slate-200 border-2 border-white flex items-center justify-center text-slate-900 shadow-game-cyan-sm font-display font-black text-xl">
              {second.name ? second.name.charAt(0).toUpperCase() : (second.user?.name ? second.user.name.charAt(0).toUpperCase() : '2')}
            </div>
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-300 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full border border-slate-950 uppercase shadow">
              2nd
            </span>
          </div>
          <span className="font-display font-extrabold text-sm text-white truncate max-w-[100px] mt-2">
            {second.name || second.user?.name}
          </span>
          <span className="text-xs text-cyan-300 font-extrabold">{second.xp || second.score} {second.xp !== undefined ? 'XP' : 'pts'}</span>

          <div className="w-full bg-gradient-to-t from-slate-900 via-slate-800 to-slate-700 rounded-t-3xl h-36 sm:h-44 mt-3 flex flex-col items-center justify-center border-t-4 border-slate-300 shadow-game-3d border-x border-slate-700">
            <Medal className="w-8 h-8 text-slate-300 mb-1" />
            <span className="font-display font-black text-3xl text-white">2</span>
            <span className="text-[10px] font-black tracking-widest uppercase text-slate-300">SILVER</span>
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
        <div className="relative mb-2">
          <Crown className="w-9 h-9 text-amber-400 absolute -top-7 left-1/2 transform -translate-x-1/2 animate-float drop-shadow-[0_4px_8px_rgba(245,158,11,0.6)]" />
          <div className="w-18 h-18 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-300 border-4 border-yellow-200 flex items-center justify-center text-slate-950 shadow-game-amber border-2 border-white/40 font-display font-black text-2xl">
            {first.name ? first.name.charAt(0).toUpperCase() : (first.user?.name ? first.user.name.charAt(0).toUpperCase() : '1')}
          </div>
          <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 text-[11px] font-black px-2.5 py-0.5 rounded-full border border-slate-950 uppercase shadow-md flex items-center gap-0.5">
            <Sparkles className="w-3 h-3" /> 1st
          </span>
        </div>
        <span className="font-display font-black text-base text-amber-300 truncate max-w-[120px] mt-3">
          {first.name || first.user?.name}
        </span>
        <span className="text-xs text-amber-400 font-black">{first.xp || first.score} {first.xp !== undefined ? 'XP' : 'pts'}</span>

        <div className="w-full bg-gradient-to-t from-amber-950 via-amber-900 to-amber-600 rounded-t-3xl h-48 sm:h-56 mt-3 flex flex-col items-center justify-center border-t-4 border-amber-300 shadow-game-amber border-x border-amber-700/80">
          <Trophy className="w-10 h-10 text-amber-300 mb-1 fill-amber-300 animate-bounce-subtle" />
          <span className="font-display font-black text-4xl text-amber-200">1</span>
          <span className="text-xs font-black tracking-widest uppercase text-amber-300">CHAMPION</span>
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
          <div className="relative mb-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-700 to-amber-600 border-2 border-amber-400 flex items-center justify-center text-white shadow-game-amber-sm font-display font-black text-xl">
              {third.name ? third.name.charAt(0).toUpperCase() : (third.user?.name ? third.user.name.charAt(0).toUpperCase() : '3')}
            </div>
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-700 text-amber-100 text-[10px] font-black px-2 py-0.5 rounded-full border border-slate-950 uppercase shadow">
              3rd
            </span>
          </div>
          <span className="font-display font-extrabold text-sm text-white truncate max-w-[100px] mt-2">
            {third.name || third.user?.name}
          </span>
          <span className="text-xs text-amber-400 font-extrabold">{third.xp || third.score} {third.xp !== undefined ? 'XP' : 'pts'}</span>

          <div className="w-full bg-gradient-to-t from-slate-950 via-amber-950/80 to-amber-900/80 rounded-t-3xl h-28 sm:h-36 mt-3 flex flex-col items-center justify-center border-t-4 border-amber-600 shadow-game-3d border-x border-amber-900">
            <Medal className="w-7 h-7 text-amber-400 mb-1" />
            <span className="font-display font-black text-2xl text-amber-400">3</span>
            <span className="text-[10px] font-black tracking-widest uppercase text-amber-500">BRONZE</span>
          </div>
        </motion.div>
      ) : (
        <div className="flex-1" />
      )}
    </div>
  );
};
