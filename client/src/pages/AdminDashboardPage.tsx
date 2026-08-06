import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  BarChart3,
  Plus,
  CheckCircle2,
  TrendingUp,
  Target,
  Sparkles,
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { apiRequest } from '../services/api';
import { StatsCard } from '../components/StatsCard';

export const AdminDashboardPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOverview();
  }, []);

  const fetchOverview = async () => {
    setIsLoading(true);
    try {
      const res = await apiRequest('/admin/analytics/overview');
      setAnalytics(res.analytics);
    } catch (err: any) {
      setError(err.message || 'Failed to load command center analytics');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-teal-400 border-t-transparent rounded-full animate-spin" />
        <p className="font-display font-bold text-sm text-slate-400">Initializing Command Center HUD...</p>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="max-w-md mx-auto my-16 p-6 rounded-3xl bg-slate-900 border border-slate-800 text-center">
        <p className="text-rose-400 font-bold mb-4">{error || 'Could not load admin analytics.'}</p>
        <button onClick={fetchOverview} className="btn-game btn-game-purple px-6 py-2.5 text-xs">
          Retry
        </button>
      </div>
    );
  }

  const { totalQuizzes, totalStudents, totalAttempts, averageScore, passRate, recentAttempts, attemptsOverTime } =
    analytics;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full bg-teal-950 border border-teal-700 text-teal-300 text-xs font-bold font-display uppercase">
              Admin HUD
            </span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white">
            Command Center Overview
          </h1>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link to="/admin/quizzes" className="btn-game btn-game-teal px-5 py-3 text-xs flex items-center gap-2">
            <Plus className="w-4 h-4" /> Create New Quiz
          </Link>
          <Link to="/admin/users" className="btn-game btn-game-purple px-5 py-3 text-xs flex items-center gap-2">
            <Users className="w-4 h-4" /> Manage Users
          </Link>
        </div>
      </div>

      {/* Metric Cards HUD Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Quizzes"
          value={totalQuizzes}
          subtitle="Platform assessment modules"
          icon={<BookOpen className="w-6 h-6" />}
          color="teal"
        />

        <StatsCard
          title="Active Students"
          value={totalStudents}
          subtitle="Registered test takers"
          icon={<Users className="w-6 h-6" />}
          color="purple"
        />

        <StatsCard
          title="Total Attempts"
          value={totalAttempts}
          subtitle="Completed quiz runs"
          icon={<CheckCircle2 className="w-6 h-6" />}
          color="indigo"
        />

        <StatsCard
          title="Average Score"
          value={`${averageScore}%`}
          subtitle={`Platform pass rate: ${passRate}%`}
          icon={<Target className="w-6 h-6" />}
          color="amber"
        />
      </div>

      {/* Attempts Over Time Chart */}
      <div className="game-card p-6 space-y-4">
        <h2 className="font-display font-extrabold text-xl text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-teal-400" /> Platform Assessment Volume (Last 7 Days)
        </h2>

        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={attemptsOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
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
                dataKey="attempts"
                name="Attempts"
                stroke="#14b8a6"
                strokeWidth={3}
                dot={{ fill: '#8b5cf6', r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="avgScore"
                name="Avg Score (%)"
                stroke="#f59e0b"
                strokeWidth={2}
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Live Recent Attempts Feed */}
      <div className="game-card p-6 space-y-4">
        <h2 className="font-display font-extrabold text-xl text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" /> Recent Student Attempts
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-display">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Quiz Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Score</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Submitted At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium text-slate-200">
              {recentAttempts?.map((att: any) => (
                <tr key={att.id} className="hover:bg-slate-900/60">
                  <td className="py-3.5 px-4 font-bold font-display text-sm text-slate-100">
                    {att.user?.name}
                    <div className="text-[10px] text-slate-400 font-normal">{att.user?.email}</div>
                  </td>
                  <td className="py-3.5 px-4 font-bold">{att.quiz?.title}</td>
                  <td className="py-3.5 px-4">{att.quiz?.category}</td>
                  <td className="py-3.5 px-4 font-bold text-amber-400">{att.percentage}%</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        att.passed
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {att.passed ? 'PASSED' : 'FAILED'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right text-slate-400">
                    {att.submittedAt ? new Date(att.submittedAt).toLocaleTimeString() : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
