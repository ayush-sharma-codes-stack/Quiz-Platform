import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check, Send, AlertTriangle, Sparkles, Rocket } from 'lucide-react';
import { useQuizAttemptStore } from '../store/quizAttemptStore';
import { CircularTimerRing } from '../components/CircularTimerRing';
import { soundFx } from '../utils/sound';

export const QuizAttemptPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    quiz,
    attempt,
    currentQuestionIndex,
    userAnswers,
    timeLeftSeconds,
    isSubmitting,
    toggleOptionSelection,
    setCurrentQuestionIndex,
    setTimeLeftSeconds,
    submitQuizAttempt,
  } = useQuizAttemptStore();

  const [confirmSubmitOpen, setConfirmSubmitOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Timer countdown loop
  useEffect(() => {
    if (!quiz || !attempt) return;

    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quiz, attempt]);

  const handleAutoSubmit = async () => {
    try {
      const res = await submitQuizAttempt();
      navigate(`/quizzes/${id}/result/${res.attempt.id}`);
    } catch (e: any) {
      setSubmitError('Auto-submit completed with warnings.');
    }
  };

  const handleManualSubmit = async () => {
    setSubmitError(null);
    try {
      const res = await submitQuizAttempt();
      navigate(`/quizzes/${id}/result/${res.attempt.id}`);
    } catch (e: any) {
      setSubmitError(e.message || 'Failed to submit quiz attempt.');
    }
  };

  if (!quiz || !attempt || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <p className="font-display font-black text-lg text-white">No active arena session found.</p>
        <button onClick={() => navigate('/quizzes')} className="btn-game btn-game-purple px-6 py-3 text-xs">
          Return to Catalog
        </button>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const selectedOptionIds = userAnswers[currentQuestion.id] || [];
  const totalQuestions = quiz.questions.length;
  const progressPercentage = Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100);

  const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F'];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Quiz Header Arena Bar */}
      <div className="game-card p-5 border-2 border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-game-purple">
        <div className="space-y-1 text-center sm:text-left">
          <span className="badge-3d bg-purple-950 text-purple-300 border-purple-700">
            {quiz.category} Assessment
          </span>
          <h2 className="font-display font-black text-xl text-white tracking-tight">{quiz.title}</h2>
        </div>

        {/* Circular Countdown Ring */}
        <CircularTimerRing
          timeLeftSeconds={timeLeftSeconds}
          totalTimeSeconds={quiz.timeLimitSeconds}
        />
      </div>

      {/* Progress XP Bar with Rocket Runner */}
      <div className="space-y-2 bg-slate-900/90 border-2 border-slate-800 p-4 rounded-3xl backdrop-blur-xl shadow-inner">
        <div className="flex justify-between items-center text-xs font-black font-display tracking-wider">
          <span className="text-purple-300 flex items-center gap-1.5">
            <Rocket className="w-4 h-4 text-amber-400 animate-pulse" /> Quest {currentQuestionIndex + 1} of {totalQuestions}
          </span>
          <span className="text-teal-400 font-extrabold">{progressPercentage}% Completed</span>
        </div>

        <div className="w-full h-4 bg-slate-950 rounded-full overflow-hidden border-2 border-slate-800 p-0.5 relative">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-600 via-indigo-500 to-teal-400 rounded-full shadow-game-glow-teal"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Active Question Card Slider */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 25 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -25 }}
          transition={{ duration: 0.2 }}
          className="game-card p-8 border-2 border-slate-700/80 space-y-6 min-h-[380px] flex flex-col justify-between shadow-game-purple-sm"
        >
          <div>
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <span className="badge-3d bg-purple-950 text-purple-200 border-purple-700">
                {currentQuestion.type === 'SINGLE_CHOICE'
                  ? 'Single Choice'
                  : currentQuestion.type === 'MULTI_CHOICE'
                  ? 'Select All That Apply'
                  : 'True or False'}
              </span>
              <span className="badge-3d bg-amber-950 text-amber-300 border-amber-600 font-black">
                <Sparkles className="w-3.5 h-3.5" /> +{currentQuestion.points} Points
              </span>
            </div>

            <h3 className="font-display font-black text-xl sm:text-2xl text-white leading-snug tracking-tight">
              {currentQuestion.text}
            </h3>
          </div>

          {/* 3D Option Tiles Grid */}
          <div className="grid grid-cols-1 gap-3.5">
            {currentQuestion.options.map((opt, idx) => {
              const isSelected = selectedOptionIds.includes(opt.id);
              const letter = optionLetters[idx % optionLetters.length];

              return (
                <motion.button
                  key={opt.id}
                  type="button"
                  whileHover={{ scale: 1.01, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    soundFx.playCorrect();
                    toggleOptionSelection(currentQuestion.id, opt.id, currentQuestion.type);
                  }}
                  className={`w-full p-4 rounded-2xl border-2 text-left font-display font-bold text-sm transition-all duration-150 flex items-center justify-between cursor-pointer select-none ${
                    isSelected
                      ? 'bg-gradient-to-r from-purple-900/90 via-indigo-900/90 to-purple-950 border-purple-400 text-white shadow-game-purple border-b-4'
                      : 'bg-slate-950/90 border-slate-800 text-slate-200 hover:border-purple-500/50 hover:bg-slate-900 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3.5 flex-1 pr-4">
                    {/* Letter Badge */}
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm border-2 transition-colors ${
                        isSelected
                          ? 'bg-amber-400 text-slate-950 border-yellow-200 shadow-sm'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {letter}
                    </div>
                    <span className="leading-relaxed">{opt.text}</span>
                  </div>

                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center border-2 transition-all ${
                      isSelected
                        ? 'bg-emerald-500 border-emerald-300 text-slate-950 scale-110 shadow-game-emerald-sm'
                        : 'border-slate-700 bg-slate-900 text-transparent'
                    }`}
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
          disabled={currentQuestionIndex === 0}
          className={`btn-game btn-game-gray px-5 py-3 text-xs flex items-center gap-1.5 ${
            currentQuestionIndex === 0 ? 'opacity-40 cursor-not-allowed' : ''
          }`}
        >
          <ChevronLeft className="w-4 h-4" /> Previous Quest
        </button>

        {currentQuestionIndex < totalQuestions - 1 ? (
          <button
            onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
            className="btn-game btn-game-purple px-7 py-3.5 text-xs flex items-center gap-2 shadow-game-purple"
          >
            Next Quest <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => setConfirmSubmitOpen(true)}
            className="btn-game btn-game-teal px-8 py-3.5 text-xs flex items-center gap-2 shadow-game-teal"
          >
            Submit Quest Attempt <Send className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Submit Confirmation Modal */}
      {confirmSubmitOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-900 border-2 border-slate-700 rounded-3xl p-7 max-w-md w-full text-center space-y-4 shadow-game-purple"
          >
            <AlertTriangle className="w-14 h-14 text-amber-400 mx-auto animate-bounce-subtle" />
            <h3 className="font-display font-black text-2xl text-white">Finalize Quest Attempt?</h3>
            <p className="text-xs text-slate-300 font-semibold leading-relaxed">
              You have answered {Object.keys(userAnswers).length} of {totalQuestions} questions. Are you ready to submit and view your score celebration?
            </p>

            {submitError && <p className="text-xs text-rose-400 font-black">{submitError}</p>}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmSubmitOpen(false)}
                className="flex-1 btn-game btn-game-gray py-3 text-xs"
              >
                Keep Reviewing
              </button>
              <button
                type="button"
                onClick={handleManualSubmit}
                disabled={isSubmitting}
                className="flex-1 btn-game btn-game-teal py-3 text-xs flex items-center justify-center gap-2 shadow-game-teal"
              >
                {isSubmitting ? 'Scoring...' : 'Confirm Submit'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
