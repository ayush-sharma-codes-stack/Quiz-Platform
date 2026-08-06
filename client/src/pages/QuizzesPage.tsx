import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, Clock, Target, HelpCircle, ArrowRight, BookOpen } from 'lucide-react';
import { apiRequest } from '../services/api';
import { Quiz } from '../types';

export const QuizzesPage: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchQuizzes();
  }, [search, selectedCategory, selectedDifficulty]);

  const fetchQuizzes = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedCategory !== 'ALL') params.append('category', selectedCategory);
      if (selectedDifficulty !== 'ALL') params.append('difficulty', selectedDifficulty);

      const res = await apiRequest(`/quizzes?${params.toString()}`);
      setQuizzes(res.quizzes || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch quizzes');
    } finally {
      setIsLoading(false);
    }
  };

  const categories = ['ALL', 'Development', 'Security', 'Science', 'General'];
  const difficulties = ['ALL', 'EASY', 'MEDIUM', 'HARD'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-teal-400" /> Quiz Arena Catalog
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Choose a quiz challenge, test your knowledge, and earn XP & badges
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="game-card p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search quizzes by title, description, or category..."
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-slate-800/80">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase font-display">
            <Filter className="w-4 h-4 text-purple-400" /> Categories:
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl font-display font-bold text-xs transition-all ${
                  selectedCategory === cat
                    ? 'bg-purple-900/60 border border-purple-500 text-purple-200 shadow-md'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase font-display ml-auto">
            Difficulty:
          </div>
          <div className="flex flex-wrap gap-2">
            {difficulties.map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-3 py-1.5 rounded-xl font-display font-bold text-xs transition-all ${
                  selectedDifficulty === diff
                    ? 'bg-teal-900/60 border border-teal-500 text-teal-200 shadow-md'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quiz Grid */}
      {isLoading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-4 border-teal-400 border-t-transparent rounded-full animate-spin" />
          <p className="font-display font-bold text-sm text-slate-400">Loading quiz catalog...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 text-rose-400 font-bold">{error}</div>
      ) : quizzes.length === 0 ? (
        <div className="game-card text-center py-16">
          <BookOpen className="w-16 h-16 text-slate-600 mx-auto mb-3" />
          <h3 className="font-display font-bold text-xl text-slate-200">No quizzes match your filters</h3>
          <p className="text-sm text-slate-400 mt-1 mb-4">
            Try adjusting your search keywords or category filters.
          </p>
          <button
            onClick={() => { setSearch(''); setSelectedCategory('ALL'); setSelectedDifficulty('ALL'); }}
            className="btn-game btn-game-purple px-6 py-2.5 text-xs"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz, idx) => (
            <motion.div
              key={quiz.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="game-card flex flex-col justify-between border-slate-800 hover:border-purple-600/50 transition-all duration-200 hover:-translate-y-1 group"
            >
              <div>
                {/* Thumbnail Header */}
                <div className="relative h-44 rounded-2xl overflow-hidden mb-4 bg-slate-950 border border-slate-800">
                  {quiz.thumbnail ? (
                    <img
                      src={quiz.thumbnail}
                      alt={quiz.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-purple-950 to-slate-900 flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-purple-400/40" />
                    </div>
                  )}

                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700 text-xs font-bold text-purple-300 font-display">
                      {quiz.category}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-extrabold font-display border backdrop-blur-md ${
                        quiz.difficulty === 'EASY'
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700'
                          : quiz.difficulty === 'MEDIUM'
                          ? 'bg-amber-950/80 text-amber-300 border-amber-700'
                          : 'bg-rose-950/80 text-rose-300 border-rose-700'
                      }`}
                    >
                      {quiz.difficulty}
                    </span>
                  </div>
                </div>

                <h3 className="font-display font-extrabold text-xl text-slate-100 group-hover:text-purple-300 transition-colors mb-2">
                  {quiz.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                  {quiz.description}
                </p>
              </div>

              <div>
                {/* Metrics row */}
                <div className="grid grid-cols-3 gap-2 py-3 mb-4 border-y border-slate-800/80 text-center">
                  <div>
                    <div className="text-slate-400 text-[10px] font-bold uppercase font-display flex items-center justify-center gap-1">
                      <Clock className="w-3 h-3" /> Time
                    </div>
                    <span className="font-display font-bold text-xs text-slate-200">
                      {Math.ceil(quiz.timeLimitSeconds / 60)} mins
                    </span>
                  </div>

                  <div>
                    <div className="text-slate-400 text-[10px] font-bold uppercase font-display flex items-center justify-center gap-1">
                      <HelpCircle className="w-3 h-3" /> Questions
                    </div>
                    <span className="font-display font-bold text-xs text-slate-200">
                      {quiz._count?.questions || 0}
                    </span>
                  </div>

                  <div>
                    <div className="text-slate-400 text-[10px] font-bold uppercase font-display flex items-center justify-center gap-1">
                      <Target className="w-3 h-3 text-amber-400" /> Passing
                    </div>
                    <span className="font-display font-bold text-xs text-amber-400">
                      {quiz.passingScore}%
                    </span>
                  </div>
                </div>

                <Link
                  to={`/quizzes/${quiz.id}`}
                  className="w-full btn-game btn-game-purple py-3 text-xs flex items-center justify-center gap-2"
                >
                  Start Assessment <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
