import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { History, TrendingUp, BookOpen, ArrowRight, Award } from 'lucide-react';
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
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white flex items-center gap-3">
          <History className="w-8 h-8 text-teal-400" /> Assessment History & Trend
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Review your past assessment scores, accuracy progress, and performance trends over time
        </p>
      </div>

      {isLoading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-4 border-teal-400 border-t-transparent rounded-full animate-spin" />
          <p className="font-display font-bold text-sm text-slate-400">Loading attempt history...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 text-rose-400 font-bold">{error}</div>
      ) : attempts.length === 0 ? (
        <div className="game-card text-center py-16">
          <BookOpen className="w-16 h-16 text-slate-600 mx-auto mb-3" />
          <h3 className="font-display font-bold text-xl text-slate-200">No Assessment History Found</h3>
          <p className="text-sm text-slate-400 mt-1 mb-4">
            You haven't completed any quizzes yet. Take your first quiz to track performance trends!
          </p>
          <Link to="/quizzes" className="btn-game btn-game-purple px-6 py-2.5 text-xs">
            Start First Quiz
          </Link>
        </div>
      ) : (
        <>
          {/* Trend Chart Card */}
          <div className="game-card p-6 space-y-4">
            <h2 className="font-display font-extrabold text-xl text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-400" /> Score Improvement Trend
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
                      borderColor: '#334155',
                      borderRadius: '16px',
                      color: '#f8fafc',
                      fontFamily: 'Fredoka',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#14b8a6"
                    strokeWidth={3}
                    dot={{ fill: '#8b5cf6', r: 5 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* History List */}
          <div className="game-card p-6 space-y-4">
            <h2 className="font-display font-extrabold text-xl text-white">All Past Attempts</h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase font-display">
                    <th className="py-3 px-4">Quiz Title</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Difficulty</th>
                    <th className="py-3 px-4">Score</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium text-slate-200">
                  {attempts.map((att) => (
                    <tr key={att.id} className="hover:bg-slate-900/60">
                      <td className="py-3.5 px-4 font-bold font-display text-sm">{att.quiz?.title}</td>
                      <td className="py-3.5 px-4">{att.quiz?.category}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 border border-slate-700">
                          {att.quiz?.difficulty}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-amber-400">{att.percentage}%</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            att.passed
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-amber-950 text-amber-300 border border-amber-800'
                          }`}
                        >
                          {att.passed ? 'PASSED' : 'RETRY'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">
                        {att.submittedAt ? new Date(att.submittedAt).toLocaleDateString() : '-'}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          to={`/quizzes/${att.quizId}/result/${att.id}`}
                          className="text-purple-400 hover:underline font-bold flex items-center justify-end gap-1"
                        >
                          View Results <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
