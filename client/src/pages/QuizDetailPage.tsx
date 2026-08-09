import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Target, HelpCircle, Trophy, Play, ArrowLeft, ShieldAlert, Sparkles, Zap, Award } from 'lucide-react';
import { apiRequest } from '../services/api';
import { Quiz } from '../types';
import { useQuizAttemptStore } from '../store/quizAttemptStore';

export const QuizDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [bestAttempt, setBestAttempt] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setAttempt = useQuizAttemptStore((s) => s.setAttempt);

  useEffect(() => {
    if (id) fetchQuizDetail();
  }, [id]);

  const fetchQuizDetail = async () => {
    setIsLoading(true);
    try {
      const res = await apiRequest(`/quizzes/${id}`);
      setQuiz(res.quiz);
      setBestAttempt(res.bestAttempt);
    } catch (err: any) {
      setError(err.message || 'Failed to load quiz details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartAttempt = async () => {
    if (!id || !quiz) return;
    setIsStarting(true);
    setError(null);

    try {
      const res = await apiRequest('/attempts', {
        method: 'POST',
        body: JSON.stringify({ quizId: id }),
      });

      setAttempt(quiz, res.attempt);
      navigate(`/quizzes/${id}/attempt`);
    } catch (err: any) {
      setError(err.message || 'Could not start quiz attempt');
      setIsStarting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <div className="w-14 h-14 border-4 border-purple-500 border-t-transparent rounded-full animate-spin shadow-game-glow-purple" />
        <p className="font-display font-black text-base text-purple-300 animate-pulse">Preparing Mission Briefing...</p>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 rounded-3xl bg-slate-900 border-2 border-slate-700 text-center shadow-game-coral">
        <ShieldAlert className="w-14 h-14 text-rose-400 mx-auto mb-3 animate-bounce-subtle" />
        <h3 className="font-display font-black text-xl text-white">Mission Unavailable</h3>
        <p className="text-xs text-slate-400 font-semibold mt-1 mb-5">{error || 'Quiz not found'}</p>
        <Link to="/quizzes" className="btn-game btn-game-gray px-6 py-3 text-xs">
          Back to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <Link to="/quizzes" className="btn-game btn-game-gray text-xs px-4 py-2 inline-flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" /> Back to Quizzes
      </Link>

      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="game-card p-8 border-2 border-slate-700/80 space-y-6 shadow-game-purple"
      >
        {/* Banner */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b-2 border-slate-800">
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="badge-3d bg-purple-950 text-purple-300 border-purple-700">
                {quiz.category}
              </span>
              <span className={`badge-3d ${
                quiz.difficulty === 'EASY'
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                  : quiz.difficulty === 'MEDIUM'
                  ? 'bg-amber-950 text-amber-300 border-amber-700'
                  : 'bg-rose-950 text-rose-300 border-rose-700'
              }`}>
                {quiz.difficulty} Difficulty
              </span>
            </div>

            <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
              {quiz.title}
            </h1>
          </div>

          {bestAttempt && (
            <div className="bg-amber-950/60 border-2 border-amber-600 rounded-2xl p-4 flex items-center gap-3 shrink-0 shadow-game-amber-sm">
              <Trophy className="w-9 h-9 text-amber-400 fill-amber-400 animate-bounce-subtle" />
              <div>
                <p className="text-[10px] font-black text-amber-300 uppercase tracking-wider font-display">Personal High Score</p>
                <p className="font-display font-black text-2xl text-amber-400">{bestAttempt.percentage}%</p>
              </div>
            </div>
          )}
        </div>

        <p className="text-sm text-slate-200 font-semibold leading-relaxed font-body">
          {quiz.description}
        </p>

        {/* Assessment Specs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-3xl bg-slate-950/90 border-2 border-slate-800 text-center shadow-inner">
            <Clock className="w-7 h-7 text-purple-400 mx-auto mb-1.5" />
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block font-display">Time Limit</span>
            <span className="font-display font-black text-xl text-white">{Math.ceil(quiz.timeLimitSeconds / 60)} Minutes</span>
          </div>

          <div className="p-5 rounded-3xl bg-slate-950/90 border-2 border-slate-800 text-center shadow-inner">
            <HelpCircle className="w-7 h-7 text-teal-400 mx-auto mb-1.5" />
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block font-display">Total Quests</span>
            <span className="font-display font-black text-xl text-white">{quiz.questions?.length || 0} Questions</span>
          </div>

          <div className="p-5 rounded-3xl bg-slate-950/90 border-2 border-slate-800 text-center shadow-inner">
            <Target className="w-7 h-7 text-amber-400 mx-auto mb-1.5" />
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block font-display">Target Mastery</span>
            <span className="font-display font-black text-xl text-amber-400">{quiz.passingScore}%</span>
          </div>
        </div>

        {/* Rules */}
        <div className="p-5 rounded-3xl bg-purple-950/40 border-2 border-purple-800/80 space-y-2 text-xs text-purple-200 shadow-inner">
          <h4 className="font-display font-black text-sm text-purple-300 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" /> Arena Rules & Guidelines:
          </h4>
          <ul className="list-disc pl-5 space-y-1.5 font-semibold">
            <li>The countdown timer starts as soon as you hit <strong>Launch Quest Attempt</strong>.</li>
            <li>Questions are presented sequentially. Selected answers save automatically.</li>
            <li>Timer turns amber at 30 seconds and flashes red at 10 seconds remaining.</li>
            <li>Your attempt will automatically submit if the timer expires.</li>
          </ul>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStartAttempt}
          disabled={isStarting}
          className="w-full btn-game btn-game-teal py-4 text-base font-black flex items-center justify-center gap-3 shadow-game-teal group"
        >
          {isStarting ? (
            <span className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              Entering Arena...
            </span>
          ) : (
            <>
              <Sparkles className="w-5 h-5 fill-slate-950" /> Launch Quest Attempt <Play className="w-5 h-5 fill-slate-950 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
};
