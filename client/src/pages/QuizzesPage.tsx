import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, Clock, Target, HelpCircle, ArrowRight, BookOpen, Sparkles, Gamepad2, X } from 'lucide-react';
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
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white flex items-center gap-3 tracking-tight">
            <Gamepad2 className="w-9 h-9 text-amber-400" /> Quiz Arena Catalog
          </h1>
          <p className="text-slate-300 font-semibold text-sm mt-1">
            Pick your quest, test your developer skills, and earn XP multipliers & trophies
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="game-card p-5 space-y-4 border-2 border-slate-700/80 shadow-game-purple-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search quests by title, keywords, or technology..."
              className="w-full bg-slate-950/90 border-2 border-slate-800 rounded-2xl pl-12 pr-10 py-3.5 text-sm text-white font-semibold placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors shadow-inner"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-3 border-t-2 border-slate-800">
          <div className="flex items-center gap-2 text-xs font-black text-slate-300 uppercase font-display tracking-wider">
            <Filter className="w-4 h-4 text-purple-400" /> Categories:
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`btn-game text-xs px-3.5 py-1.5 ${
                  selectedCategory === cat
                    ? 'btn-game-purple'
                    : 'btn-game-gray opacity-80 hover:opacity-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs font-black text-slate-300 uppercase font-display tracking-wider lg:ml-auto">
            Difficulty:
          </div>
          <div className="flex flex-wrap gap-2">
            {difficulties.map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`btn-game text-xs px-3.5 py-1.5 ${
                  selectedDifficulty === diff
                    ? 'btn-game-teal'
                    : 'btn-game-gray opacity-80 hover:opacity-100'
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
          <div className="w-12 h-12 border-4 border-teal-400 border-t-transparent rounded-full animate-spin shadow-game-glow-teal" />
          <p className="font-display font-black text-base text-teal-300 animate-pulse">Scanning Quiz Catalog...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 text-rose-400 font-black text-lg">{error}</div>
      ) : quizzes.length === 0 ? (
        <div className="game-card text-center py-16 border-dashed border-slate-700">
          <BookOpen className="w-16 h-16 text-slate-600 mx-auto mb-3 animate-bounce-subtle" />
          <h3 className="font-display font-black text-2xl text-white">No quests match your criteria</h3>
          <p className="text-sm text-slate-400 font-semibold mt-1 mb-5">
            Try adjusting your search keywords or category filters.
          </p>
          <button
            onClick={() => { setSearch(''); setSelectedCategory('ALL'); setSelectedDifficulty('ALL'); }}
            className="btn-game btn-game-purple px-6 py-3 text-xs"
          >
            Reset Filters
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
              whileHover={{ y: -6 }}
              className="game-card flex flex-col justify-between border-2 border-slate-800 hover:border-purple-500/80 shadow-game-purple-sm transition-all duration-200 group"
            >
              <div>
                {/* Thumbnail Header */}
                <div className="relative h-48 rounded-2xl overflow-hidden mb-4 bg-slate-950 border-2 border-slate-800">
                  {quiz.thumbnail ? (
                    <img
                      src={quiz.thumbnail}
                      alt={quiz.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-purple-950 via-slate-900 to-slate-950 flex items-center justify-center">
                      <Gamepad2 className="w-14 h-14 text-purple-400/40 group-hover:rotate-12 transition-transform" />
                    </div>
                  )}

                  <div className="absolute top-3 left-3">
                    <span className="badge-3d bg-slate-950/90 text-purple-300 border-purple-800 backdrop-blur-md">
                      {quiz.category}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <span
                      className={`badge-3d backdrop-blur-md ${
                        quiz.difficulty === 'EASY'
                          ? 'bg-emerald-950/90 text-emerald-300 border-emerald-700'
                          : quiz.difficulty === 'MEDIUM'
                          ? 'bg-amber-950/90 text-amber-300 border-amber-700'
                          : 'bg-rose-950/90 text-rose-300 border-rose-700'
                      }`}
                    >
                      {quiz.difficulty}
                    </span>
                  </div>
                </div>

                <h3 className="font-display font-black text-xl text-white group-hover:text-amber-300 transition-colors mb-2 tracking-tight">
                  {quiz.title}
                </h3>
                <p className="text-xs text-slate-300 font-semibold line-clamp-2 leading-relaxed mb-4">
                  {quiz.description}
                </p>
              </div>

              <div>
                {/* Metrics row */}
                <div className="grid grid-cols-3 gap-2 py-3 mb-4 border-y-2 border-slate-800 text-center bg-slate-950/50 rounded-xl">
                  <div>
                    <div className="text-slate-400 text-[10px] font-black uppercase font-display flex items-center justify-center gap-1">
                      <Clock className="w-3 h-3" /> Time
                    </div>
                    <span className="font-display font-black text-xs text-white">
                      {Math.ceil(quiz.timeLimitSeconds / 60)} m
                    </span>
                  </div>

                  <div>
                    <div className="text-slate-400 text-[10px] font-black uppercase font-display flex items-center justify-center gap-1">
                      <HelpCircle className="w-3 h-3 text-teal-400" /> Quests
                    </div>
                    <span className="font-display font-black text-xs text-white">
                      {quiz._count?.questions || 0} Qs
                    </span>
                  </div>

                  <div>
                    <div className="text-slate-400 text-[10px] font-black uppercase font-display flex items-center justify-center gap-1">
                      <Target className="w-3 h-3 text-amber-400" /> Pass
                    </div>
                    <span className="font-display font-black text-xs text-amber-400">
                      {quiz.passingScore}%
                    </span>
                  </div>
                </div>

                <Link
                  to={`/quizzes/${quiz.id}`}
                  className="w-full btn-game btn-game-purple py-3.5 text-xs flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" /> Start Quest <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
