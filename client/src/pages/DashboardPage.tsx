import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Trophy,
  Flame,
  Zap,
  BookOpen,
  Award,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Play,
} from 'lucide-react';
import { apiRequest } from '../services/api';
import { XPProgressBar } from '../components/XPProgressBar';
import { StatsCard } from '../components/StatsCard';
import { BadgeCard } from '../components/BadgeCard';

export const DashboardPage: React.FC = () => {
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await apiRequest('/users/me');
      setProfileData(res.user);
    } catch (err: any) {
      setError(err.message || 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <div className="w-14 h-14 border-4 border-purple-500 border-t-transparent rounded-full animate-spin shadow-game-glow-purple" />
        <p className="font-display font-black text-base text-purple-300 animate-pulse">Initializing Player Profile...</p>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 rounded-3xl bg-slate-900 border-2 border-slate-700 text-center shadow-game-coral">
        <p className="text-rose-400 font-extrabold mb-4">{error || 'Could not load player profile.'}</p>
        <button onClick={fetchProfile} className="btn-game btn-game-coral px-6 py-3 text-xs">
          Retry Connection
        </button>
      </div>
    );
  }

  const { name, level, xp, streak, totalCompletedQuizzes, levelProgress, badges, recentAttempts } =
    profileData;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Player Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="game-card bg-gradient-to-r from-slate-950 via-purple-950/70 to-slate-950 border-2 border-purple-600/60 relative overflow-hidden shadow-game-purple"
      >
        {/* Glow & Sparkle accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl -z-0 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="badge-3d bg-purple-900/80 text-purple-200 border-purple-600 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Adventurer Profile
              </span>
              {streak > 0 && (
                <span className="badge-3d bg-rose-950 text-rose-300 border-rose-600 animate-pulse">
                  <Flame className="w-3.5 h-3.5 fill-rose-500 text-rose-500" /> {streak} Day Streak Multiplier!
                </span>
              )}
            </div>

            <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight leading-tight">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-purple-300 to-teal-300">{name}</span>!
            </h1>
            <p className="text-slate-300 font-semibold text-sm max-w-xl leading-relaxed">
              Ready to conquer new arcade quiz challenges, climb the leaderboards, and unlock legendary developer trophies?
            </p>
          </div>

          <Link to="/quizzes" className="btn-game btn-game-teal px-8 py-4 text-sm flex items-center gap-2.5 shrink-0 shadow-game-teal group">
            <Play className="w-5 h-5 fill-slate-950 group-hover:scale-110 transition-transform" /> Enter Quiz Arena
          </Link>
        </div>

        {/* Level Progress Bar Widget */}
        <div className="mt-6 relative z-10">
          <XPProgressBar
            level={level}
            xp={xp}
            progressPercentage={levelProgress?.percentage || 0}
          />
        </div>
      </motion.div>

      {/* Stats HUD Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          title="Player Rank"
          value={`Lvl ${level}`}
          subtitle={`${levelProgress?.xpInCurrentLevel || 0} / ${levelProgress?.xpNeededForNextLevel || 100} XP to L${level + 1}`}
          icon={<Zap className="w-6 h-6" />}
          color="amber"
        />

        <StatsCard
          title="Total Experience"
          value={`${xp} XP`}
          subtitle="Earned from completed quests"
          icon={<Sparkles className="w-6 h-6" />}
          color="purple"
        />

        <StatsCard
          title="Completed Quests"
          value={totalCompletedQuizzes}
          subtitle="Passed assessment attempts"
          icon={<BookOpen className="w-6 h-6" />}
          color="teal"
        />

        <StatsCard
          title="Daily Streak"
          value={`${streak} Days`}
          subtitle={streak > 0 ? 'On fire! Keep it going' : 'Complete a quiz today to start'}
          icon={<Flame className="w-6 h-6" />}
          color="coral"
        />
      </div>

      {/* Badges Shelf */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-black text-2xl text-white flex items-center gap-2 tracking-tight">
            <Award className="w-7 h-7 text-amber-400" /> Trophies & Achievements ({badges?.length || 0})
          </h2>
          <Link to="/profile" className="btn-game btn-game-gray text-xs px-4 py-2 flex items-center gap-1.5">
            View All Trophies <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {badges && badges.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {badges.map((b: any) => (
              <BadgeCard key={b.id} badge={{ ...b, isEarned: true }} />
            ))}
          </div>
        ) : (
          <div className="game-card text-center py-10 border-dashed border-slate-700">
            <Trophy className="w-14 h-14 text-slate-600 mx-auto mb-3 animate-float" />
            <p className="font-display font-black text-white text-base">No trophies unlocked yet!</p>
            <p className="text-xs text-slate-400 font-semibold mt-1">Complete your first quiz to earn the "First Step" achievement.</p>
          </div>
        )}
      </div>

      {/* Recent Attempts Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-black text-2xl text-white flex items-center gap-2 tracking-tight">
            <CheckCircle2 className="w-7 h-7 text-teal-400" /> Quest Log & Recent Activity
          </h2>
          <Link to="/history" className="btn-game btn-game-gray text-xs px-4 py-2 flex items-center gap-1.5">
            Full Quest Log <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentAttempts && recentAttempts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentAttempts.map((att: any) => (
              <motion.div
                key={att.id}
                whileHover={{ y: -3 }}
                className="game-card flex items-center justify-between p-5 border-2 border-slate-800 hover:border-purple-500/60 shadow-game-purple-sm transition-all"
              >
                <div className="space-y-1.5">
                  <span className="badge-3d bg-purple-950 text-purple-300 border-purple-700">
                    {att.quiz?.category}
                  </span>
                  <h3 className="font-display font-black text-lg text-white">{att.quiz?.title}</h3>
                  <p className="text-xs text-slate-400 font-semibold">
                    Submitted {new Date(att.submittedAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="text-right flex flex-col items-end">
                  <div className={`font-display font-black text-2xl ${att.passed ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {att.percentage}%
                  </div>
                  <span className={`badge-3d mt-1 ${
                    att.passed ? 'bg-emerald-950 text-emerald-300 border-emerald-600' : 'bg-amber-950 text-amber-300 border-amber-600'
                  }`}>
                    {att.passed ? 'PASSED' : 'RETRY'}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="game-card text-center py-10 border-dashed border-slate-700">
            <BookOpen className="w-14 h-14 text-slate-600 mx-auto mb-3" />
            <p className="font-display font-black text-white text-base">No recent quiz attempts</p>
            <p className="text-xs text-slate-400 font-semibold mt-1 mb-5">Step into the arcade to test your skills!</p>
            <Link to="/quizzes" className="btn-game btn-game-purple px-6 py-3 text-xs">
              Browse Quiz Arena
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
