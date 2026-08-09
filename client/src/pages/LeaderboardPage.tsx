import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Crown, Flame, Zap, Award, Filter, Sparkles } from 'lucide-react';
import { apiRequest } from '../services/api';
import { LeaderboardEntry, Quiz } from '../types';
import { LeaderboardPodium } from '../components/LeaderboardPodium';

export const LeaderboardPage: React.FC = () => {
  const [mode, setMode] = useState<'GLOBAL' | 'QUIZ'>('GLOBAL');
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuizId, setSelectedQuizId] = useState<string>('');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchQuizzesList();
  }, []);

  useEffect(() => {
    if (mode === 'GLOBAL') {
      fetchGlobalLeaderboard();
    } else if (selectedQuizId) {
      fetchQuizLeaderboard(selectedQuizId);
    }
  }, [mode, selectedQuizId]);

  const fetchQuizzesList = async () => {
    try {
      const res = await apiRequest('/quizzes');
      setQuizzes(res.quizzes || []);
      if (res.quizzes && res.quizzes.length > 0) {
        setSelectedQuizId(res.quizzes[0].id);
      }
    } catch (e) {
      console.error('Failed to fetch quizzes list', e);
    }
  };

  const fetchGlobalLeaderboard = async () => {
    setIsLoading(true);
    try {
      const res = await apiRequest('/leaderboard/global');
      setLeaderboard(res.leaderboard || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load leaderboard');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchQuizLeaderboard = async (qId: string) => {
    setIsLoading(true);
    try {
      const res = await apiRequest(`/leaderboard/${qId}`);
      setLeaderboard(res.leaderboard || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load quiz leaderboard');
    } finally {
      setIsLoading(false);
    }
  };

  const topThree = leaderboard.slice(0, 3);
  const remainingRankings = leaderboard.slice(3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white flex items-center gap-3 tracking-tight">
            <Trophy className="w-9 h-9 text-amber-400 fill-amber-400 animate-float" /> Hall of Fame Leaderboard
          </h1>
          <p className="text-slate-300 font-semibold text-sm mt-1">
            Compete with players worldwide, earn XP multipliers, and claim top champion status
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-2xl border-2 border-slate-700/80 shadow-game-amber-sm">
          <button
            onClick={() => setMode('GLOBAL')}
            className={`btn-game text-xs px-4 py-2.5 ${
              mode === 'GLOBAL'
                ? 'btn-game-amber'
                : 'btn-game-gray opacity-80 hover:opacity-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 mr-1" /> Global XP Rankings
          </button>
          <button
            onClick={() => setMode('QUIZ')}
            className={`btn-game text-xs px-4 py-2.5 ${
              mode === 'QUIZ'
                ? 'btn-game-amber'
                : 'btn-game-gray opacity-80 hover:opacity-100'
            }`}
          >
            Per-Quiz Standings
          </button>
        </div>
      </div>

      {/* Quiz Selector Dropdown (when Mode === 'QUIZ') */}
      {mode === 'QUIZ' && (
        <div className="game-card p-4 flex items-center gap-3 border-2 border-slate-700/80 shadow-inner">
          <Filter className="w-5 h-5 text-amber-400" />
          <span className="font-display font-black text-xs text-slate-300 uppercase tracking-wider">Select Quest:</span>
          <select
            value={selectedQuizId}
            onChange={(e) => setSelectedQuizId(e.target.value)}
            className="flex-1 bg-slate-950/90 border-2 border-slate-800 rounded-xl px-4 py-2.5 text-xs font-display font-bold text-white focus:outline-none focus:border-amber-500 shadow-inner"
          >
            {quizzes.map((q) => (
              <option key={q.id} value={q.id}>
                {q.title} ({q.category})
              </option>
            ))}
          </select>
        </div>
      )}

      {isLoading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin shadow-game-glow-amber" />
          <p className="font-display font-black text-base text-amber-300 animate-pulse">Updating Hall of Fame...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 text-rose-400 font-black text-lg">{error}</div>
      ) : leaderboard.length === 0 ? (
        <div className="game-card text-center py-16 border-dashed border-slate-700">
          <Trophy className="w-16 h-16 text-slate-600 mx-auto mb-3 animate-float" />
          <h3 className="font-display font-black text-2xl text-white">No Hall of Fame Entries Yet</h3>
          <p className="text-sm text-slate-400 font-semibold mt-1">Be the very first adventurer to complete this quest!</p>
        </div>
      ) : (
        <>
          {/* Top 3 Podium */}
          <LeaderboardPodium topThree={topThree} />

          {/* Remaining Rankings Table */}
          {remainingRankings.length > 0 && (
            <div className="game-card p-6 space-y-4 border-2 border-slate-800 shadow-game-purple-sm">
              <h3 className="font-display font-black text-2xl text-white tracking-tight">Full Arena Standings</h3>

              <div className="space-y-2.5">
                {remainingRankings.map((entry) => (
                  <motion.div
                    key={entry.id || entry.attemptId}
                    whileHover={{ x: 4 }}
                    className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/90 border-2 border-slate-800 hover:border-purple-500/60 transition-all shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-display font-black text-lg text-slate-400 w-9 text-center bg-slate-900 py-1 rounded-xl border border-slate-800">
                        #{entry.rank}
                      </span>

                      <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 border-2 border-white/20 flex items-center justify-center font-display font-black text-white shadow-game-purple-sm">
                        {(entry.name || entry.user?.name || 'P').charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <h4 className="font-display font-black text-base text-white">
                          {entry.name || entry.user?.name}
                        </h4>
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                          <span>Level {entry.level || entry.user?.level || 1}</span>
                          {entry.streak !== undefined && entry.streak > 0 && (
                            <span className="text-rose-400 flex items-center gap-0.5 font-bold">
                              <Flame className="w-3.5 h-3.5 fill-rose-500" /> {entry.streak}d
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-display font-black text-base text-amber-400 flex items-center gap-1 justify-end drop-shadow">
                        <Zap className="w-4 h-4 fill-amber-400" /> {entry.xp !== undefined ? entry.xp : `${entry.percentage}%`} {entry.xp !== undefined ? 'XP' : ''}
                      </div>
                      {entry.timeTakenSeconds !== undefined && (
                        <p className="text-[10px] font-extrabold text-slate-400">
                          Time: {entry.timeTakenSeconds}s
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
