import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User as UserIcon, Shield, Mail, Award, Flame, Zap, CheckCircle2, Star, Trophy } from 'lucide-react';
import { apiRequest } from '../services/api';
import { BadgeCard } from '../components/BadgeCard';
import { XPProgressBar } from '../components/XPProgressBar';

export const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [allBadges, setAllBadges] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const userRes = await apiRequest('/users/me');
      const badgesRes = await apiRequest('/users/me/badges');
      setProfile(userRes.user);
      setAllBadges(badgesRes.badges || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !profile) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin shadow-game-glow-purple" />
        <p className="font-display font-black text-base text-purple-300 animate-pulse">Loading Trophy Room...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Player Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="game-card p-8 border-2 border-slate-700/80 shadow-game-purple relative overflow-hidden"
      >
        {/* BG glow orbs */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-teal-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row items-center gap-8">
          {/* Avatar */}
          <div className="shrink-0 relative">
            <div className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-teal-400 p-1.5 shadow-game-purple">
              <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center font-display font-black text-5xl text-white">
                {profile.name.charAt(0).toUpperCase()}
              </div>
            </div>
            {/* Level badge on avatar */}
            <div className="absolute -bottom-2 -right-2 bg-amber-400 border-2 border-slate-950 rounded-xl px-2 py-0.5 font-display font-black text-xs text-slate-950 shadow-game-amber-sm">
              Lv. {profile.level}
            </div>
          </div>

          {/* Info */}
          <div className="space-y-3 text-center md:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <h1 className="font-display font-black text-3xl text-white tracking-tight">{profile.name}</h1>
              <span className="badge-3d bg-purple-950 text-purple-300 border-purple-700 capitalize">
                {profile.role}
              </span>
            </div>

            <p className="text-sm text-slate-300 font-semibold flex items-center justify-center md:justify-start gap-1.5">
              <Mail className="w-4 h-4 text-teal-400" /> {profile.email}
            </p>

            {/* Stat Chips Row */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1">
              <div className="flex items-center gap-1.5 bg-amber-500/20 border border-amber-500/40 rounded-xl px-3 py-1.5">
                <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="font-display font-black text-sm text-amber-300">{profile.xp ?? 0} XP</span>
              </div>
              {profile.streak > 0 && (
                <div className="flex items-center gap-1.5 bg-rose-500/20 border border-rose-500/40 rounded-xl px-3 py-1.5">
                  <Flame className="w-4 h-4 text-rose-400 fill-rose-400" />
                  <span className="font-display font-black text-sm text-rose-300">{profile.streak}d Streak</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-500/40 rounded-xl px-3 py-1.5">
                <Trophy className="w-4 h-4 text-emerald-400" />
                <span className="font-display font-black text-sm text-emerald-300">{allBadges.filter((b: any) => b.unlockedAt).length} Badges</span>
              </div>
            </div>

            {/* XP Progress Bar */}
            <div className="pt-1 max-w-md">
              <XPProgressBar
                level={profile.level}
                xp={profile.xp}
                progressPercentage={profile.levelProgress?.percentage || 0}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Trophy Room Badge Gallery */}
      <div className="space-y-5">
        <h2 className="font-display font-black text-2xl text-white flex items-center gap-2.5 tracking-tight">
          <Award className="w-7 h-7 text-amber-400" /> Trophy Room & Badge Collection
        </h2>

        {allBadges.length === 0 ? (
          <div className="game-card text-center py-14 border-dashed border-slate-700">
            <Star className="w-14 h-14 text-slate-600 mx-auto mb-3 animate-float" />
            <h3 className="font-display font-black text-xl text-white">No Badges Yet!</h3>
            <p className="text-sm text-slate-400 font-semibold mt-1">Complete quizzes to unlock badges and fill this room!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {allBadges.map((badge: any) => (
              <BadgeCard key={badge.id} badge={badge} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
