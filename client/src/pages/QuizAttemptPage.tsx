import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check, Send, AlertTriangle } from 'lucide-react';
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
    resetAttempt,
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
        <p className="font-display font-bold text-slate-300">No active quiz attempt session found.</p>
        <button onClick={() => navigate('/quizzes')} className="btn-game btn-game-purple px-6 py-2.5 text-xs">
          Return to Catalog
        </button>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const selectedOptionIds = userAnswers[currentQuestion.id] || [];
  const totalQuestions = quiz.questions.length;
  const progressPercentage = Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Quiz Header Arena Bar */}
      <div className="game-card p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 font-display">
            {quiz.category} Assessment
          </span>
          <h2 className="font-display font-bold text-lg text-slate-100">{quiz.title}</h2>
        </div>

        {/* Circular Countdown Ring */}
        <CircularTimerRing
          timeLeftSeconds={timeLeftSeconds}
          totalTimeSeconds={quiz.timeLimitSeconds}
        />
      </div>

      {/* Progress XP Bar */}
      <div className="space-y-1">
        <div className="flex justify-between items-center text-xs font-bold font-display">
          <span className="text-purple-400">Question {currentQuestionIndex + 1} of {totalQuestions}</span>
          <span className="text-slate-400">{progressPercentage}% Completed</span>
        </div>

        <div className="w-full h-3 bg-slate-900 border border-slate-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-600 via-indigo-500 to-teal-400 rounded-full"
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
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="game-card p-8 border-slate-800 space-y-6 min-h-[350px] flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full bg-purple-950/80 border border-purple-800 text-xs font-bold text-purple-300 font-display">
                {currentQuestion.type === 'SINGLE_CHOICE'
                  ? 'Single Choice'
                  : currentQuestion.type === 'MULTI_CHOICE'
                  ? 'Select All That Apply'
                  : 'True or False'}
              </span>
              <span className="text-xs font-extrabold text-amber-400 font-display">
                +{currentQuestion.points} Points
              </span>
            </div>

            <h3 className="font-display font-bold text-xl sm:text-2xl text-slate-100 leading-snug">
              {currentQuestion.text}
            </h3>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 gap-3">
            {currentQuestion.options.map((opt) => {
              const isSelected = selectedOptionIds.includes(opt.id);

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    soundFx.playCorrect();
                    toggleOptionSelection(currentQuestion.id, opt.id, currentQuestion.type);
                  }}
                  className={`w-full p-4 rounded-2xl border text-left font-display font-semibold text-sm transition-all duration-150 flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-purple-900/60 to-indigo-900/60 border-purple-500 text-white shadow-lg shadow-purple-950 ring-2 ring-purple-500/50'
                      : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <span className="flex-1 pr-4">{opt.text}</span>
                  <div
                    className={`w-6 h-6 rounded-xl flex items-center justify-center border transition-all ${
                      isSelected
                        ? 'bg-purple-500 border-purple-400 text-slate-950 scale-110'
                        : 'border-slate-700 bg-slate-900'
                    }`}
                  >
                    {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>
                </button>
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
          className={`btn-game btn-game-gray px-5 py-3 text-xs flex items-center gap-1 ${
            currentQuestionIndex === 0 ? 'opacity-40 cursor-not-allowed' : ''
          }`}
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>

        {currentQuestionIndex < totalQuestions - 1 ? (
          <button
            onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
            className="btn-game btn-game-purple px-6 py-3 text-xs flex items-center gap-1"
          >
            Next Question <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => setConfirmSubmitOpen(true)}
            className="btn-game btn-game-teal px-8 py-3 text-xs flex items-center gap-2"
          >
            Submit Quiz <Send className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Submit Confirmation Modal */}
      {confirmSubmitOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full text-center space-y-4 shadow-2xl">
            <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto" />
            <h3 className="font-display font-bold text-xl text-slate-100">Ready to Finalize?</h3>
            <p className="text-xs text-slate-400">
              You have answered {Object.keys(userAnswers).length} of {totalQuestions} questions. Are you sure you want to submit your assessment now?
            </p>

            {submitError && <p className="text-xs text-rose-400 font-bold">{submitError}</p>}

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
                className="flex-1 btn-game btn-game-teal py-3 text-xs flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Scoring...' : 'Confirm Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
