import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Upload,
  HelpCircle,
  CheckCircle2,
  FileJson,
  AlertTriangle,
} from 'lucide-react';
import { apiRequest } from '../services/api';
import { Quiz, Question, Option } from '../types';
import { BulkImportModal } from '../components/BulkImportModal';

export const AdminQuizEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [bulkImportOpen, setBulkImportOpen] = useState(false);

  // New Question Form state
  const [qType, setQType] = useState<'SINGLE_CHOICE' | 'MULTI_CHOICE' | 'TRUE_FALSE'>('SINGLE_CHOICE');
  const [qText, setQText] = useState('');
  const [qPoints, setQPoints] = useState(10);
  const [qExplanation, setQExplanation] = useState('');
  const [qOptions, setQOptions] = useState<{ text: string; isCorrect: boolean }[]>([
    { text: '', isCorrect: true },
    { text: '', isCorrect: false },
  ]);

  useEffect(() => {
    if (id) fetchQuizDetail();
  }, [id]);

  const fetchQuizDetail = async () => {
    setIsLoading(true);
    try {
      const res = await apiRequest(`/admin/quizzes/${id}`);
      setQuiz(res.quiz);
      setQuestions(res.quiz.questions || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch quiz');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateQuizMetadata = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quiz) return;
    setIsSaving(true);
    setError(null);
    setSuccessMsg(null);

    try {
      await apiRequest(`/admin/quizzes/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          title: quiz.title,
          description: quiz.description,
          category: quiz.category,
          difficulty: quiz.difficulty,
          timeLimitSeconds: Number(quiz.timeLimitSeconds),
          passingScore: Number(quiz.passingScore),
          thumbnail: quiz.thumbnail,
          status: quiz.status,
        }),
      });

      setSuccessMsg('Quiz settings updated successfully!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update quiz settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !qText.trim()) return;

    const hasCorrect = qOptions.some((o) => o.isCorrect);
    if (!hasCorrect) {
      setError('Question must contain at least one correct option.');
      return;
    }

    try {
      await apiRequest(`/admin/quizzes/${id}/questions`, {
        method: 'POST',
        body: JSON.stringify({
          type: qType,
          text: qText,
          points: Number(qPoints),
          explanation: qExplanation,
          options: qOptions,
        }),
      });

      // Reset Form
      setQText('');
      setQExplanation('');
      setQOptions([
        { text: '', isCorrect: true },
        { text: '', isCorrect: false },
      ]);
      fetchQuizDetail();
    } catch (err: any) {
      setError(err.message || 'Failed to add question');
    }
  };

  const handleDeleteQuestion = async (qId: string) => {
    if (!window.confirm('Delete this question?')) return;
    try {
      await apiRequest(`/admin/quizzes/${id}/questions/${qId}`, { method: 'DELETE' });
      fetchQuizDetail();
    } catch (err: any) {
      setError(err.message || 'Failed to delete question');
    }
  };

  if (isLoading || !quiz) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
        <p className="font-display font-bold text-sm text-slate-400">Loading Quiz Builder...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Link to="/admin/quizzes" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Quizzes List
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white">
            Quiz Builder: {quiz.title}
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Configure settings, manage questions, or bulk import via CSV/JSON
          </p>
        </div>

        <button
          onClick={() => setBulkImportOpen(true)}
          className="btn-game btn-game-purple px-6 py-3 text-xs flex items-center gap-2"
        >
          <Upload className="w-4 h-4" /> Bulk Import Questions
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" /> {successMsg}
        </div>
      )}

      {/* Section 1: Quiz Settings Form */}
      <div className="game-card p-6 space-y-6">
        <h2 className="font-display font-extrabold text-xl text-white">Assessment Metadata & Settings</h2>

        <form onSubmit={handleUpdateQuizMetadata} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1 font-display">
                Title
              </label>
              <input
                type="text"
                required
                value={quiz.title}
                onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1 font-display">
                Category
              </label>
              <input
                type="text"
                required
                value={quiz.category}
                onChange={(e) => setQuiz({ ...quiz, category: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1 font-display">
              Description
            </label>
            <textarea
              required
              rows={2}
              value={quiz.description}
              onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1 font-display">
                Difficulty
              </label>
              <select
                value={quiz.difficulty}
                onChange={(e: any) => setQuiz({ ...quiz, difficulty: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
              >
                <option value="EASY">EASY</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HARD">HARD</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1 font-display">
                Time Limit (Seconds)
              </label>
              <input
                type="number"
                required
                value={quiz.timeLimitSeconds}
                onChange={(e) => setQuiz({ ...quiz, timeLimitSeconds: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1 font-display">
                Passing Score (%)
              </label>
              <input
                type="number"
                required
                value={quiz.passingScore}
                onChange={(e) => setQuiz({ ...quiz, passingScore: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1 font-display">
                Publication Status
              </label>
              <select
                value={quiz.status}
                onChange={(e: any) => setQuiz({ ...quiz, status: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
              >
                <option value="DRAFT">DRAFT</option>
                <option value="PUBLISHED">PUBLISHED</option>
                <option value="ARCHIVED">ARCHIVED</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="btn-game btn-game-teal px-6 py-2.5 text-xs flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>

      {/* Section 2: Questions List & Add Question Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Question Panel */}
        <div className="game-card p-6 space-y-4 lg:col-span-1 h-fit">
          <h3 className="font-display font-extrabold text-lg text-white">Add New Question</h3>

          <form onSubmit={handleAddQuestion} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1 font-display">
                Question Type
              </label>
              <select
                value={qType}
                onChange={(e: any) => {
                  const val = e.target.value;
                  setQType(val);
                  if (val === 'TRUE_FALSE') {
                    setQOptions([
                      { text: 'True', isCorrect: true },
                      { text: 'False', isCorrect: false },
                    ]);
                  }
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
              >
                <option value="SINGLE_CHOICE">Single Choice MCQ</option>
                <option value="MULTI_CHOICE">Multi Choice MCQ</option>
                <option value="TRUE_FALSE">True / False</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1 font-display">
                Question Prompt
              </label>
              <textarea
                required
                rows={3}
                value={qText}
                onChange={(e) => setQText(e.target.value)}
                placeholder="Enter question text here..."
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1 font-display">
                Points Value
              </label>
              <input
                type="number"
                required
                value={qPoints}
                onChange={(e) => setQPoints(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Options list editor */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 font-display">
                Answer Options & Correct Key
              </label>

              {qOptions.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={opt.isCorrect}
                    onChange={(e) => {
                      const copy = [...qOptions];
                      if (qType === 'SINGLE_CHOICE' || qType === 'TRUE_FALSE') {
                        copy.forEach((o, i) => (o.isCorrect = i === idx));
                      } else {
                        copy[idx].isCorrect = e.target.checked;
                      }
                      setQOptions(copy);
                    }}
                    className="w-4 h-4 accent-purple-500 cursor-pointer"
                  />
                  <input
                    type="text"
                    required
                    value={opt.text}
                    onChange={(e) => {
                      const copy = [...qOptions];
                      copy[idx].text = e.target.value;
                      setQOptions(copy);
                    }}
                    placeholder={`Option ${idx + 1}`}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
                  />
                  {qOptions.length > 2 && (
                    <button
                      type="button"
                      onClick={() => setQOptions(qOptions.filter((_, i) => i !== idx))}
                      className="text-rose-400 p-1 hover:bg-slate-800 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}

              {qType !== 'TRUE_FALSE' && (
                <button
                  type="button"
                  onClick={() => setQOptions([...qOptions, { text: '', isCorrect: false }])}
                  className="text-xs text-purple-400 hover:underline font-bold flex items-center gap-1 pt-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Option
                </button>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1 font-display">
                Explanation (Optional)
              </label>
              <input
                type="text"
                value={qExplanation}
                onChange={(e) => setQExplanation(e.target.value)}
                placeholder="Explanation shown after quiz completion"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>

            <button type="submit" className="w-full btn-game btn-game-teal py-3 text-xs flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Add Question to Quiz
            </button>
          </form>
        </div>

        {/* Existing Questions List */}
        <div className="game-card p-6 space-y-4 lg:col-span-2">
          <h3 className="font-display font-extrabold text-lg text-white">
            Existing Questions ({questions.length})
          </h3>

          {questions.length === 0 ? (
            <p className="text-xs text-slate-400">No questions added yet. Use the form on the left or click Bulk Import.</p>
          ) : (
            <div className="space-y-3">
              {questions.map((q, idx) => (
                <div key={q.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-xs text-purple-400">Q{idx + 1}.</span>
                      <h4 className="font-display font-bold text-sm text-slate-100">{q.text}</h4>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-bold text-amber-400 font-display">+{q.points} pts</span>
                      <button
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="text-rose-400 p-1 hover:bg-slate-800 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {q.options?.map((opt: Option) => (
                      <div
                        key={opt.id}
                        className={`p-2 rounded-xl border text-[11px] font-semibold ${
                          opt.isCorrect
                            ? 'bg-emerald-950/60 border-emerald-700 text-emerald-200'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        {opt.text} {opt.isCorrect && '✓'}
                      </div>
                    ))}
                  </div>

                  {q.explanation && (
                    <p className="text-[11px] text-slate-400 italic">
                      <span className="font-bold text-purple-400">Note: </span>{q.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bulk Import Modal */}
      <BulkImportModal
        quizId={id!}
        isOpen={bulkImportOpen}
        onClose={() => setBulkImportOpen(false)}
        onSuccess={fetchQuizDetail}
      />
    </div>
  );
};
