import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Users,
  Plus,
  CheckCircle2,
  TrendingUp,
  Target,
  Sparkles,
  Shield,
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
        <div className="w-12 h-12 border-4 border-teal-400 border-t-transparent rounded-full animate-spin shadow-game-glow-teal" />
        <p className="font-display font-black text-base text-teal-300 animate-pulse">Initializing Command Center HUD...</p>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 rounded-3xl bg-slate-900 border-2 border-slate-800 text-center shadow-game-purple">
        <p className="text-rose-400 font-black mb-5 text-base">{error || 'Could not load admin analytics.'}</p>
        <button onClick={fetchOverview} className="btn-game btn-game-purple px-6 py-3 text-sm">
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
          <div className="flex items-center gap-2 mb-2">
            <span className="badge-3d bg-teal-950 border-teal-700 text-teal-300">
              <Shield className="w-3 h-3 mr-1 inline" /> Admin HUD
            </span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
            Command Center Overview
          </h1>
          <p className="text-slate-300 font-semibold text-sm mt-1">Platform-wide analytics and quick action controls</p>
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
      <div className="game-card p-6 space-y-4 border-2 border-slate-700/80 shadow-game-teal-sm">
        <h2 className="font-display font-black text-2xl text-white flex items-center gap-2 tracking-tight">
          <TrendingUp className="w-6 h-6 text-teal-400" /> Platform Assessment Volume (Last 7 Days)
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
                  borderColor: '#475569',
                  borderRadius: '16px',
                  color: '#f8fafc',
                  fontFamily: 'Fredoka',
                  fontWeight: 'bold',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)',
                }}
              />
              <Line type="monotone" dataKey="attempts" name="Attempts" stroke="#14b8a6" strokeWidth={4} dot={{ fill: '#8b5cf6', r: 6, strokeWidth: 2, stroke: '#fff' }} />
              <Line type="monotone" dataKey="avgScore" name="Avg Score (%)" stroke="#f59e0b" strokeWidth={3} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Live Recent Attempts Feed */}
      <div className="game-card p-6 space-y-4 border-2 border-slate-800 shadow-game-purple-sm">
        <h2 className="font-display font-black text-2xl text-white flex items-center gap-2 tracking-tight">
          <Sparkles className="w-6 h-6 text-purple-400" /> Recent Student Attempts
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b-2 border-slate-800 text-slate-300 uppercase font-display tracking-wider">
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">Quiz Title</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Score</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Submitted At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-bold text-slate-200">
              {recentAttempts?.map((att: any) => (
                <tr key={att.id} className="hover:bg-slate-900/80 transition-colors">
                  <td className="py-4 px-4">
                    <span className="font-black font-display text-sm text-white">{att.user?.name}</span>
                    <div className="text-[10px] text-slate-400 font-semibold">{att.user?.email}</div>
                  </td>
                  <td className="py-4 px-4 font-bold">{att.quiz?.title}</td>
                  <td className="py-4 px-4 text-slate-400">{att.quiz?.category}</td>
                  <td className="py-4 px-4 font-black text-amber-400 text-base">{att.percentage}%</td>
                  <td className="py-4 px-4">
                    <span className={`badge-3d ${att.passed ? 'bg-emerald-950 text-emerald-300 border-emerald-600' : 'bg-rose-950 text-rose-300 border-rose-600'}`}>
                      {att.passed ? 'PASSED' : 'FAILED'}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right text-slate-400">
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
