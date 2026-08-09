import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { History, TrendingUp, BookOpen, ArrowRight, Award, Sparkles } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { apiRequest } from '../services/api';
import { Attempt } from '../types';

export const HistoryPage: React.FC = () => {
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const res = await apiRequest('/attempts/history');
      setAttempts(res.attempts || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load attempt history');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to determine Grade Tier
  const getGradeTier = (percentage: number) => {
    if (percentage >= 90) return { grade: 'S Tier', color: 'bg-amber-400 text-slate-950 border-yellow-200 shadow-game-amber-sm' };
    if (percentage >= 75) return { grade: 'A Tier', color: 'bg-purple-600 text-white border-purple-400 shadow-game-purple-sm' };
    if (percentage >= 60) return { grade: 'B Tier', color: 'bg-teal-500 text-slate-950 border-teal-300 shadow-game-teal-sm' };
    return { grade: 'C Tier', color: 'bg-slate-700 text-slate-200 border-slate-600 shadow-sm' };
  };

  // Format history for trend chart (chronological order)
  const chartData = [...attempts]
    .reverse()
    .map((att, idx) => ({
      attempt: `#${idx + 1}`,
      quiz: att.quiz?.title || 'Quiz',
      score: att.percentage,
      date: att.submittedAt ? new Date(att.submittedAt).toLocaleDateString() : '',
    }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-white flex items-center gap-3 tracking-tight">
          <History className="w-9 h-9 text-teal-400" /> Quest Log & Performance Trend
        </h1>
        <p className="text-slate-300 font-semibold text-sm mt-1">
          Track your skill growth timeline, accuracy trends, and grade milestones over time
        </p>
      </div>

      {isLoading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 border-4 border-teal-400 border-t-transparent rounded-full animate-spin shadow-game-glow-teal" />
          <p className="font-display font-black text-base text-teal-300 animate-pulse">Retrieving Quest Log...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 text-rose-400 font-black text-lg">{error}</div>
      ) : attempts.length === 0 ? (
        <div className="game-card text-center py-16 border-dashed border-slate-700">
          <BookOpen className="w-16 h-16 text-slate-600 mx-auto mb-3 animate-bounce-subtle" />
          <h3 className="font-display font-black text-2xl text-white">No Quest Log Found</h3>
          <p className="text-sm text-slate-400 font-semibold mt-1 mb-5">
            You haven't completed any quests yet. Step into the arena to build your track record!
          </p>
          <Link to="/quizzes" className="btn-game btn-game-purple px-6 py-3 text-xs">
            Start First Quest
          </Link>
        </div>
      ) : (
        <>
          {/* Trend Chart Card */}
          <div className="game-card p-6 space-y-4 border-2 border-slate-700/80 shadow-game-purple-sm">
            <h2 className="font-display font-black text-2xl text-white flex items-center gap-2 tracking-tight">
              <TrendingUp className="w-6 h-6 text-purple-400" /> Skill Improvement Trend Graph
            </h2>
            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="attempt" stroke="#94a3b8" />
                  <YAxis domain={[0, 100]} stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#475569',
                      borderRadius: '16px',
                      color: '#f8fafc',
                      fontFamily: 'Fredoka',
                      fontWeight: 'bold',
                      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#14b8a6"
                    strokeWidth={4}
                    dot={{ fill: '#f59e0b', r: 6, strokeWidth: 2, stroke: '#ffffff' }}
                    activeDot={{ r: 9, fill: '#ec4899' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* History Table Card */}
          <div className="game-card p-6 space-y-4 border-2 border-slate-800 shadow-game-purple-sm">
            <h2 className="font-display font-black text-2xl text-white tracking-tight">All Quest Attempts</h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b-2 border-slate-800 text-slate-300 uppercase font-display tracking-wider">
                    <th className="py-3.5 px-4">Grade</th>
                    <th className="py-3.5 px-4">Quest Title</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Difficulty</th>
                    <th className="py-3.5 px-4">Score</th>
                    <th className="py-3.5 px-4">Result</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 font-bold text-slate-200">
                  {attempts.map((att) => {
                    const gradeInfo = getGradeTier(att.percentage);
                    return (
                      <tr key={att.id} className="hover:bg-slate-900/80 transition-colors">
                        <td className="py-4 px-4">
                          <span className={`px-2.5 py-1 rounded-xl text-[11px] font-black uppercase border font-display ${gradeInfo.color}`}>
                            {gradeInfo.grade}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-black font-display text-sm text-white">{att.quiz?.title}</td>
                        <td className="py-4 px-4">{att.quiz?.category}</td>
                        <td className="py-4 px-4">
                          <span className="badge-3d bg-slate-900 text-slate-300 border-slate-700">
                            {att.quiz?.difficulty}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-black text-amber-400 text-base">{att.percentage}%</td>
                        <td className="py-4 px-4">
                          <span
                            className={`badge-3d ${
                              att.passed
                                ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                                : 'bg-amber-950 text-amber-300 border-amber-600'
                            }`}
                          >
                            {att.passed ? 'PASSED' : 'RETRY'}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-slate-400">
                          {att.submittedAt ? new Date(att.submittedAt).toLocaleDateString() : '-'}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <Link
                            to={`/quizzes/${att.quizId}/result/${att.id}`}
                            className="btn-game btn-game-purple text-[11px] px-3.5 py-1.5 inline-flex items-center gap-1"
                          >
                            Review <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
