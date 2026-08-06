import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Crown, Flame, Zap, Award, Filter } from 'lucide-react';
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
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white flex items-center gap-3">
            <Trophy className="w-8 h-8 text-amber-400 fill-amber-400" /> Hall of Fame Leaderboard
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Compete with players worldwide, earn XP, and climb the top rankings
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setMode('GLOBAL')}
            className={`px-4 py-2 rounded-xl font-display font-bold text-xs transition-all ${
              mode === 'GLOBAL'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Global XP Rankings
          </button>
          <button
            onClick={() => setMode('QUIZ')}
            className={`px-4 py-2 rounded-xl font-display font-bold text-xs transition-all ${
              mode === 'QUIZ'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Per-Quiz Rankings
          </button>
        </div>
      </div>

      {/* Quiz Selector Dropdown (when Mode === 'QUIZ') */}
      {mode === 'QUIZ' && (
        <div className="game-card p-4 flex items-center gap-3">
          <Filter className="w-5 h-5 text-amber-400" />
          <span className="font-display font-bold text-xs text-slate-300 uppercase">Select Quiz:</span>
          <select
            value={selectedQuizId}
            onChange={(e) => setSelectedQuizId(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs font-display font-bold text-slate-200 focus:outline-none focus:border-amber-500"
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
          <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
          <p className="font-display font-bold text-sm text-slate-400">Updating Hall of Fame...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 text-rose-400 font-bold">{error}</div>
      ) : leaderboard.length === 0 ? (
        <div className="game-card text-center py-16">
          <Trophy className="w-16 h-16 text-slate-600 mx-auto mb-3" />
          <h3 className="font-display font-bold text-xl text-slate-200">No Leaderboard Entries Yet</h3>
          <p className="text-sm text-slate-400 mt-1">Be the very first player to complete this quiz!</p>
        </div>
      ) : (
        <>
          {/* Top 3 Podium */}
          <LeaderboardPodium topThree={topThree} />

          {/* Remaining Rankings Table */}
          {remainingRankings.length > 0 && (
            <div className="game-card p-6 space-y-4">
              <h3 className="font-display font-extrabold text-xl text-white">Full Rankings</h3>

              <div className="space-y-2">
                {remainingRankings.map((entry) => (
                  <div
                    key={entry.id || entry.attemptId}
                    className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-display font-black text-lg text-slate-500 w-8 text-center">
                        #{entry.rank}
                      </span>

                      <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-800 flex items-center justify-center font-display font-bold text-purple-300">
                        {(entry.name || entry.user?.name || 'P').charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <h4 className="font-display font-bold text-sm text-slate-100">
                          {entry.name || entry.user?.name}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span>Level {entry.level || entry.user?.level || 1}</span>
                          {entry.streak !== undefined && entry.streak > 0 && (
                            <span className="text-rose-400 flex items-center gap-0.5">
                              <Flame className="w-3 h-3 fill-rose-500" /> {entry.streak}d
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-display font-extrabold text-base text-amber-400 flex items-center gap-1 justify-end">
                        <Zap className="w-4 h-4 fill-amber-400" /> {entry.xp !== undefined ? entry.xp : `${entry.percentage}%`} {entry.xp !== undefined ? 'XP' : ''}
                      </div>
                      {entry.timeTakenSeconds !== undefined && (
                        <p className="text-[10px] font-semibold text-slate-500">
                          Time: {entry.timeTakenSeconds}s
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
