import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Target, HelpCircle, Trophy, Play, ArrowLeft, ShieldAlert } from 'lucide-react';
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
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
        <p className="font-display font-bold text-sm text-slate-400">Preparing assessment arena...</p>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="max-w-md mx-auto my-16 p-6 rounded-3xl bg-slate-900 border border-slate-800 text-center">
        <ShieldAlert className="w-12 h-12 text-rose-400 mx-auto mb-3" />
        <h3 className="font-display font-bold text-lg text-slate-100">Assessment Unavailable</h3>
        <p className="text-xs text-slate-400 mt-1 mb-4">{error || 'Quiz not found'}</p>
        <Link to="/quizzes" className="btn-game btn-game-gray px-6 py-2 text-xs">
          Back to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <Link to="/quizzes" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Quizzes
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="game-card p-8 border-slate-800 space-y-6"
      >
        {/* Banner */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-purple-950/80 border border-purple-800 text-xs font-bold text-purple-300 font-display">
                {quiz.category}
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 font-display">
                {quiz.difficulty} Difficulty
              </span>
            </div>

            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white">
              {quiz.title}
            </h1>
          </div>

          {bestAttempt && (
            <div className="bg-amber-950/40 border border-amber-800/60 rounded-2xl p-4 flex items-center gap-3 shrink-0">
              <Trophy className="w-8 h-8 text-amber-400 fill-amber-400" />
              <div>
                <p className="text-[10px] font-bold text-amber-300 uppercase tracking-wider font-display">Your Personal Best</p>
                <p className="font-display font-extrabold text-xl text-amber-400">{bestAttempt.percentage}%</p>
              </div>
            </div>
          )}
        </div>

        <p className="text-sm text-slate-300 leading-relaxed font-body">
          {quiz.description}
        </p>

        {/* Assessment Specs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
            <Clock className="w-6 h-6 text-purple-400 mx-auto mb-1" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-display">Time Limit</span>
            <span className="font-display font-bold text-lg text-slate-100">{Math.ceil(quiz.timeLimitSeconds / 60)} Minutes</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
            <HelpCircle className="w-6 h-6 text-teal-400 mx-auto mb-1" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-display">Total Questions</span>
            <span className="font-display font-bold text-lg text-slate-100">{quiz.questions?.length || 0} Questions</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
            <Target className="w-6 h-6 text-amber-400 mx-auto mb-1" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-display">Passing Score</span>
            <span className="font-display font-bold text-lg text-amber-400">{quiz.passingScore}%</span>
          </div>
        </div>

        {/* Rules */}
        <div className="p-5 rounded-2xl bg-purple-950/20 border border-purple-900/50 space-y-2 text-xs text-purple-200">
          <h4 className="font-display font-bold text-sm text-purple-300">Assessment Rules:</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>The timer begins as soon as you click <strong>Start Quiz Attempt</strong>.</li>
            <li>Questions are presented one by one. Answers auto-save in real-time.</li>
            <li>Timer warns at 30 seconds and 10 seconds remaining with pulsing visual indicators.</li>
            <li>Auto-submits automatically when the countdown timer hits 0:00.</li>
          </ul>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStartAttempt}
          disabled={isStarting}
          className="w-full btn-game btn-game-teal py-4 text-base font-extrabold flex items-center justify-center gap-3 shadow-xl"
        >
          {isStarting ? 'Entering Arena...' : 'Start Quiz Attempt'} <Play className="w-5 h-5 fill-slate-950" />
        </button>
      </motion.div>
    </div>
  );
};
