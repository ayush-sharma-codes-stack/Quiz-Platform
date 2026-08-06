import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User as UserIcon, Shield, Mail, Award, Flame, Zap, CheckCircle2 } from 'lucide-react';
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
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
        <p className="font-display font-bold text-sm text-slate-400">Loading trophy room...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Header */}
      <div className="game-card p-8 flex flex-col md:flex-row items-center gap-6">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-teal-400 p-1 shadow-2xl shrink-0">
          <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center font-display font-extrabold text-4xl text-white">
            {profile.name.charAt(0).toUpperCase()}
          </div>
        </div>

        <div className="space-y-2 text-center md:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <h1 className="font-display font-extrabold text-3xl text-white">{profile.name}</h1>
            <span className="px-3 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800 text-xs font-bold font-display uppercase">
              {profile.role}
            </span>
          </div>

          <p className="text-xs text-slate-400 flex items-center justify-center md:justify-start gap-1 font-medium">
            <Mail className="w-3.5 h-3.5" /> {profile.email}
          </p>

          <div className="pt-2 max-w-md">
            <XPProgressBar
              level={profile.level}
              xp={profile.xp}
              progressPercentage={profile.levelProgress?.percentage || 0}
            />
          </div>
        </div>
      </div>

      {/* Trophy Room Badge Gallery */}
      <div className="space-y-4">
        <h2 className="font-display font-extrabold text-2xl text-white flex items-center gap-2">
          <Award className="w-6 h-6 text-amber-400" /> Trophy Room & Badges Collection
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {allBadges.map((badge) => (
            <BadgeCard key={badge.id} badge={badge} />
          ))}
        </div>
      </div>
    </div>
  );
};
