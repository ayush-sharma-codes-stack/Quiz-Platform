import React, { useEffect, useState } from 'react';
import { BarChart3, Target, TrendingUp, Users, BookOpen, Filter } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import { apiRequest } from '../services/api';
import { Quiz } from '../types';
import { StatsCard } from '../components/StatsCard';

export const AdminAnalyticsPage: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuizId, setSelectedQuizId] = useState<string>('');
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchQuizList();
  }, []);

  useEffect(() => {
    if (selectedQuizId) {
      fetchQuizAnalytics(selectedQuizId);
    }
  }, [selectedQuizId]);

  const fetchQuizList = async () => {
    try {
      const res = await apiRequest('/admin/quizzes');
      const quizList = res.quizzes || [];
      setQuizzes(quizList);
      if (quizList.length > 0) {
        setSelectedQuizId(quizList[0].id);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch quizzes');
    }
  };

  const fetchQuizAnalytics = async (quizId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiRequest(`/admin/analytics/quizzes/${quizId}`);
      setAnalyticsData(res.analytics);
    } catch (err: any) {
      setError(err.message || 'Failed to load quiz analytics');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-purple-400" /> Assessment Analytics
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Deep-dive into quiz performance metrics, question difficulty analysis, and student results
          </p>
        </div>

        {/* Quiz Selector */}
        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-2xl p-3">
          <Filter className="w-5 h-5 text-purple-400" />
          <select
            value={selectedQuizId}
            onChange={(e) => setSelectedQuizId(e.target.value)}
            className="bg-transparent text-xs font-display font-bold text-slate-200 focus:outline-none min-w-[200px]"
          >
            {quizzes.map((q) => (
              <option key={q.id} value={q.id} className="bg-slate-900">
                {q.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-4 border-purple-400 border-t-transparent rounded-full animate-spin" />
          <p className="font-display font-bold text-sm text-slate-400">Compiling quiz analytics...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 text-rose-400 font-bold">{error}</div>
      ) : !analyticsData ? (
        <div className="game-card text-center py-16">
          <BarChart3 className="w-16 h-16 text-slate-600 mx-auto mb-3" />
          <h3 className="font-display font-bold text-xl text-slate-200">Select a Quiz to View Analytics</h3>
        </div>
      ) : (
        <>
          {/* Quiz Info Banner */}
          <div className="game-card p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-purple-800/40">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 font-display">
                {analyticsData.quiz.category}
              </span>
              <h2 className="font-display font-extrabold text-2xl text-white">{analyticsData.quiz.title}</h2>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400">Passing Score Threshold</span>
              <p className="font-display font-bold text-xl text-amber-400">{analyticsData.quiz.passingScore}%</p>
            </div>
          </div>

          {/* Stats Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="Total Attempts"
              value={analyticsData.totalAttempts}
              subtitle="Completed attempts on this quiz"
              icon={<Users className="w-6 h-6" />}
              color="teal"
            />
            <StatsCard
              title="Passed Students"
              value={analyticsData.passedAttempts}
              subtitle={`Pass Rate: ${analyticsData.passRate}%`}
              icon={<Target className="w-6 h-6" />}
              color="emerald"
            />
            <StatsCard
              title="Average Score"
              value={`${analyticsData.averageScore}%`}
              subtitle="Mean student performance"
              icon={<TrendingUp className="w-6 h-6" />}
              color="purple"
            />
            <StatsCard
              title="Questions"
              value={analyticsData.questionStats?.length || 0}
              subtitle="Assessment module size"
              icon={<BookOpen className="w-6 h-6" />}
              color="amber"
            />
          </div>

          {/* Question Difficulty Bar Chart */}
          {analyticsData.questionStats && analyticsData.questionStats.length > 0 && (
            <div className="game-card p-6 space-y-4">
              <h3 className="font-display font-extrabold text-xl text-white">
                Question-Level Difficulty Analysis (% Students Answered Correctly)
              </h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={analyticsData.questionStats.map((q: any, idx: number) => ({
                      name: `Q${idx + 1}`,
                      correct: q.percentCorrect,
                      difficulty: q.difficultyRating,
                    }))}
                    margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis domain={[0, 100]} stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '16px',
                        color: '#f8fafc',
                        fontFamily: 'Fredoka',
                      }}
                      formatter={(value: any) => [`${value}% correct`, 'Accuracy']}
                    />
                    <Bar dataKey="correct" radius={[8, 8, 0, 0]}>
                      {analyticsData.questionStats.map((q: any, idx: number) => (
                        <Cell
                          key={idx}
                          fill={
                            q.percentCorrect >= 75
                              ? '#10B981'
                              : q.percentCorrect >= 40
                              ? '#F59E0B'
                              : '#EF4444'
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center gap-6 text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-3 h-3 rounded bg-emerald-500 inline-block" /> Easy (&ge;75%)
                </span>
                <span className="flex items-center gap-1.5 text-amber-400">
                  <span className="w-3 h-3 rounded bg-amber-500 inline-block" /> Medium (40-75%)
                </span>
                <span className="flex items-center gap-1.5 text-rose-400">
                  <span className="w-3 h-3 rounded bg-rose-500 inline-block" /> Hard (&lt;40%)
                </span>
              </div>
            </div>
          )}

          {/* Student Attempt Results Table */}
          <div className="game-card p-6 space-y-4">
            <h3 className="font-display font-extrabold text-xl text-white">
              Individual Student Attempts
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase font-display">
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Score</th>
                    <th className="py-3 px-4">Percentage</th>
                    <th className="py-3 px-4">Result</th>
                    <th className="py-3 px-4 text-right">Submitted At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium text-slate-200">
                  {analyticsData.attempts?.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        No completed attempts yet for this quiz.
                      </td>
                    </tr>
                  ) : (
                    analyticsData.attempts?.map((att: any) => (
                      <tr key={att.id} className="hover:bg-slate-900/60">
                        <td className="py-3.5 px-4 font-bold font-display">
                          {att.user?.name}
                          <div className="text-[10px] text-slate-400 font-normal">{att.user?.email}</div>
                        </td>
                        <td className="py-3.5 px-4 font-bold">
                          {att.score} / {att.totalPoints}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-amber-400">
                          {att.percentage}%
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              att.passed
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : 'bg-rose-950 text-rose-300 border border-rose-800'
                            }`}
                          >
                            {att.passed ? 'PASSED' : 'FAILED'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right text-slate-400">
                          {att.submittedAt ? new Date(att.submittedAt).toLocaleString() : '-'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
