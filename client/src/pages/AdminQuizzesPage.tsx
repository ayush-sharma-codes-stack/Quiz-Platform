import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, BookOpen, Clock, HelpCircle, Eye, AlertTriangle } from 'lucide-react';
import { apiRequest } from '../services/api';
import { Quiz } from '../types';

export const AdminQuizzesPage: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New Quiz Modal state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState('Development');
  const [newDifficulty, setNewDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>('MEDIUM');
  const [newTimeLimit, setNewTimeLimit] = useState(300);
  const [newPassingScore, setNewPassingScore] = useState(70);
  const [newStatus, setNewStatus] = useState<'DRAFT' | 'PUBLISHED' | 'ARCHIVED'>('DRAFT');

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    setIsLoading(true);
    try {
      const res = await apiRequest('/admin/quizzes');
      setQuizzes(res.quizzes || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch quizzes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest('/admin/quizzes', {
        method: 'POST',
        body: JSON.stringify({
          title: newTitle,
          description: newDescription,
          category: newCategory,
          difficulty: newDifficulty,
          timeLimitSeconds: Number(newTimeLimit),
          passingScore: Number(newPassingScore),
          status: newStatus,
        }),
      });

      setCreateModalOpen(false);
      fetchQuizzes();
    } catch (err: any) {
      setError(err.message || 'Failed to create quiz');
    }
  };

  const handleDeleteQuiz = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this quiz?')) return;
    try {
      await apiRequest(`/admin/quizzes/${id}`, { method: 'DELETE' });
      fetchQuizzes();
    } catch (err: any) {
      setError(err.message || 'Failed to delete quiz');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-teal-400" /> Quiz Management
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Create, edit, publish, and manage assessment modules
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="btn-game btn-game-teal px-6 py-3 text-xs flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create New Quiz
        </button>
      </div>

      {isLoading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-4 border-teal-400 border-t-transparent rounded-full animate-spin" />
          <p className="font-display font-bold text-sm text-slate-400">Loading quiz modules...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 text-rose-400 font-bold">{error}</div>
      ) : (
        <div className="game-card p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase font-display">
                  <th className="py-3 px-4">Quiz Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Difficulty</th>
                  <th className="py-3 px-4">Time Limit</th>
                  <th className="py-3 px-4">Passing</th>
                  <th className="py-3 px-4">Questions</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium text-slate-200">
                {quizzes.map((quiz) => (
                  <tr key={quiz.id} className="hover:bg-slate-900/60">
                    <td className="py-3.5 px-4 font-bold font-display text-sm text-slate-100">
                      {quiz.title}
                      <div className="text-[10px] text-slate-400 font-normal line-clamp-1">
                        {quiz.description}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">{quiz.category}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 border border-slate-700">
                        {quiz.difficulty}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">{Math.ceil(quiz.timeLimitSeconds / 60)} mins</td>
                    <td className="py-3.5 px-4 font-bold text-amber-400">{quiz.passingScore}%</td>
                    <td className="py-3.5 px-4">{quiz._count?.questions || 0}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          quiz.status === 'PUBLISHED'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : quiz.status === 'DRAFT'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {quiz.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/quizzes/${quiz.id}/edit`}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-purple-950 hover:text-purple-300 border border-slate-700 transition-colors"
                          title="Edit Quiz & Questions"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteQuiz(quiz.id)}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950 hover:text-rose-300 border border-slate-700 transition-colors"
                          title="Delete Quiz"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Create Quiz */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <h3 className="font-display font-bold text-2xl text-slate-100">Create Assessment Quiz</h3>

            <form onSubmit={handleCreateQuiz} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1 font-display">
                  Quiz Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Modern React 18 Essentials"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1 font-display">
                  Description
                </label>
                <textarea
                  required
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Comprehensive assessment of hooks, state management, and performance..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-teal-500"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1 font-display">
                    Category
                  </label>
                  <input
                    type="text"
                    required
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1 font-display">
                    Difficulty
                  </label>
                  <select
                    value={newDifficulty}
                    onChange={(e: any) => setNewDifficulty(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-teal-500"
                  >
                    <option value="EASY">EASY</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HARD">HARD</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1 font-display">
                    Time (sec)
                  </label>
                  <input
                    type="number"
                    required
                    value={newTimeLimit}
                    onChange={(e) => setNewTimeLimit(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1 font-display">
                    Pass Score (%)
                  </label>
                  <input
                    type="number"
                    required
                    value={newPassingScore}
                    onChange={(e) => setNewPassingScore(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1 font-display">
                    Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e: any) => setNewStatus(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-teal-500"
                  >
                    <option value="DRAFT">DRAFT</option>
                    <option value="PUBLISHED">PUBLISHED</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="btn-game btn-game-gray px-5 py-2.5 text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-game btn-game-teal px-6 py-2.5 text-xs">
                  Create Quiz
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
