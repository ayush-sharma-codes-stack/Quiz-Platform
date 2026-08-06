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
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
        <p className="font-display font-bold text-sm text-slate-400">Loading Player Profile...</p>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 rounded-3xl bg-slate-900 border border-slate-800 text-center">
        <p className="text-rose-400 font-bold mb-4">{error || 'Could not load player profile.'}</p>
        <button onClick={fetchProfile} className="btn-game btn-game-purple px-6 py-2.5 text-xs">
          Retry
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
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="game-card bg-gradient-to-r from-slate-900 via-purple-950/50 to-slate-900 border-purple-800/40 relative overflow-hidden"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-purple-900/60 border border-purple-700/50 text-purple-300 text-xs font-bold uppercase tracking-wider font-display">
                Player Profile
              </span>
              {streak > 0 && (
                <span className="px-3 py-1 rounded-full bg-rose-950/60 border border-rose-800/50 text-rose-400 text-xs font-bold font-display flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-rose-500 text-rose-500" /> {streak} Day Streak!
                </span>
              )}
            </div>

            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-teal-300 to-amber-300">{name}</span>!
            </h1>
            <p className="text-slate-400 text-sm max-w-xl">
              Ready to take on new quiz challenges and level up your developer knowledge?
            </p>
          </div>

          <Link to="/quizzes" className="btn-game btn-game-teal px-8 py-4 text-sm flex items-center gap-2 shrink-0">
            <Sparkles className="w-5 h-5" /> Start Quiz Quest
          </Link>
        </div>

        {/* Level Progress Bar Widget */}
        <div className="mt-6">
          <XPProgressBar
            level={level}
            xp={xp}
            progressPercentage={levelProgress?.percentage || 0}
          />
        </div>
      </motion.div>

      {/* Stats HUD Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Player Level"
          value={`Lvl ${level}`}
          subtitle={`${levelProgress?.xpInCurrentLevel || 0} / ${levelProgress?.xpNeededForNextLevel || 100} XP to next level`}
          icon={<Zap className="w-6 h-6" />}
          color="amber"
        />

        <StatsCard
          title="Total Experience"
          value={`${xp} XP`}
          subtitle="Earned from completed quizzes"
          icon={<Sparkles className="w-6 h-6" />}
          color="purple"
        />

        <StatsCard
          title="Completed Quizzes"
          value={totalCompletedQuizzes}
          subtitle="Passed assessment attempts"
          icon={<BookOpen className="w-6 h-6" />}
          color="teal"
        />

        <StatsCard
          title="Daily Streak"
          value={`${streak} Days`}
          subtitle={streak > 0 ? 'On fire! Keep it going' : 'Attempt a quiz today to start'}
          icon={<Flame className="w-6 h-6" />}
          color="coral"
        />
      </div>

      {/* Badges Shelf */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-extrabold text-2xl text-white flex items-center gap-2">
            <Award className="w-6 h-6 text-purple-400" /> Earned Badges ({badges?.length || 0})
          </h2>
          <Link to="/profile" className="text-xs font-bold text-purple-400 hover:underline flex items-center gap-1">
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
          <div className="game-card text-center py-8">
            <Trophy className="w-12 h-12 text-slate-600 mx-auto mb-2" />
            <p className="font-display font-bold text-slate-300 text-sm">No badges unlocked yet!</p>
            <p className="text-xs text-slate-500 mt-1">Complete your first quiz to earn the "First Step" trophy.</p>
          </div>
        )}
      </div>

      {/* Recent Attempts Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-extrabold text-2xl text-white flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-teal-400" /> Recent Quiz Activity
          </h2>
          <Link to="/history" className="text-xs font-bold text-teal-400 hover:underline flex items-center gap-1">
            Full History <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentAttempts && recentAttempts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentAttempts.map((att: any) => (
              <div
                key={att.id}
                className="game-card flex items-center justify-between p-5 border-slate-800 hover:border-purple-600/40 transition-colors"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 px-2 py-0.5 rounded-full bg-purple-950/60 border border-purple-800">
                    {att.quiz?.category}
                  </span>
                  <h3 className="font-display font-bold text-base text-slate-100">{att.quiz?.title}</h3>
                  <p className="text-xs text-slate-400">
                    Submitted {new Date(att.submittedAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="text-right">
                  <div className={`font-display font-extrabold text-xl ${att.passed ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {att.percentage}%
                  </div>
                  <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                    att.passed ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}>
                    {att.passed ? 'PASSED' : 'RETRY'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="game-card text-center py-8">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-2" />
            <p className="font-display font-bold text-slate-300 text-sm">No recent activity</p>
            <p className="text-xs text-slate-500 mt-1 mb-4">Start a quiz to test your skills!</p>
            <Link to="/quizzes" className="btn-game btn-game-purple px-6 py-2 text-xs">
              Explore Quizzes
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
