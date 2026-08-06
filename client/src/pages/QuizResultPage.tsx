import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  Zap,
  Award,
  RotateCcw,
  BookOpen,
  ArrowRight,
  HelpCircle,
  Flame,
} from 'lucide-react';
import { apiRequest } from '../services/api';

export const QuizResultPage: React.FC = () => {
  const { id: quizId, attemptId } = useParams<{ id: string; attemptId: string }>();

  const [attemptDetail, setAttemptDetail] = useState<any>(null);
  const [displayedScore, setDisplayedScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (attemptId) fetchAttemptResult();
  }, [attemptId]);

  const fetchAttemptResult = async () => {
    setIsLoading(true);
    try {
      const res = await apiRequest(`/attempts/${attemptId}`);
      const att = res.attempt;
      setAttemptDetail(att);

      // Trigger Confetti on Pass
      if (att.passed) {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
      }

      // Animate score count-up
      let current = 0;
      const target = att.percentage;
      const step = Math.max(1, Math.ceil(target / 40));

      const interval = setInterval(() => {
        current += step;
        if (current >= target) {
          setDisplayedScore(target);
          clearInterval(interval);
        } else {
          setDisplayedScore(current);
        }
      }, 30);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch result');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-teal-400 border-t-transparent rounded-full animate-spin" />
        <p className="font-display font-bold text-sm text-slate-400">Calculating assessment score...</p>
      </div>
    );
  }

  if (error || !attemptDetail) {
    return (
      <div className="max-w-md mx-auto my-16 p-6 rounded-3xl bg-slate-900 border border-slate-800 text-center">
        <p className="text-rose-400 font-bold mb-4">{error || 'Attempt result not found.'}</p>
        <Link to="/quizzes" className="btn-game btn-game-purple px-6 py-2.5 text-xs">
          Back to Catalog
        </Link>
      </div>
    );
  }

  const { quiz, score, totalPoints, percentage, passed, xpEarned, answers } = attemptDetail;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Victory / Result Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`game-card p-8 border text-center space-y-6 relative overflow-hidden ${
          passed
            ? 'bg-gradient-to-b from-slate-900 via-emerald-950/30 to-slate-900 border-emerald-800/60'
            : 'bg-gradient-to-b from-slate-900 via-amber-950/30 to-slate-900 border-amber-800/60'
        }`}
      >
        <div className="inline-flex p-4 rounded-3xl bg-slate-950 border border-slate-800 shadow-xl mb-2">
          {passed ? (
            <Trophy className="w-16 h-16 text-amber-400 fill-amber-400 animate-bounce-subtle" />
          ) : (
            <RotateCcw className="w-16 h-16 text-amber-400" />
          )}
        </div>

        <div className="space-y-1">
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white">
            {passed ? 'Quiz Passed! Victory!' : 'Great Effort! Keep Practicing!'}
          </h1>
          <p className="text-sm text-slate-300">
            {passed
              ? `You've demonstrated great mastery of ${quiz?.title}!`
              : `Every attempt brings you closer to mastery. Review your answers below to sharpen your skills.`}
          </p>
        </div>

        {/* Score Counter */}
        <div className="py-4">
          <div className="font-display font-black text-6xl sm:text-7xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-amber-300 to-purple-400">
            {displayedScore}%
          </div>
          <p className="text-xs font-bold text-slate-400 mt-1 uppercase font-display">
            Score: {score} / {totalPoints} Points (Passing score: {quiz?.passingScore}%)
          </p>
        </div>

        {/* XP Earned Banner */}
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-amber-950/60 border border-amber-700/60 shadow-lg">
          <Zap className="w-6 h-6 text-amber-400 fill-amber-400" />
          <span className="font-display font-extrabold text-lg text-amber-300">
            +{xpEarned} XP Earned!
          </span>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap justify-center gap-4 pt-4 border-t border-slate-800/80">
          <Link to={`/quizzes/${quizId}`} className="btn-game btn-game-gray px-6 py-3 text-xs flex items-center gap-2">
            <RotateCcw className="w-4 h-4" /> Try Again
          </Link>
          <Link to="/leaderboard" className="btn-game btn-game-amber px-6 py-3 text-xs flex items-center gap-2">
            <Trophy className="w-4 h-4" /> View Leaderboard
          </Link>
          <Link to="/quizzes" className="btn-game btn-game-teal px-6 py-3 text-xs flex items-center gap-2">
            More Quizzes <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>

      {/* Answer Review Section */}
      <div className="space-y-4">
        <h2 className="font-display font-extrabold text-2xl text-white flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-purple-400" /> Answer Key & Explanations Review
        </h2>

        <div className="space-y-4">
          {quiz?.questions?.map((q: any, idx: number) => {
            const userAns = answers?.find((a: any) => a.questionId === q.id);
            let selectedOptionIds: string[] = [];
            if (userAns?.selectedOptionIds) {
              try {
                selectedOptionIds = JSON.parse(userAns.selectedOptionIds);
              } catch (e) {}
            }

            const isQuestionCorrect = userAns?.isCorrect;

            return (
              <div
                key={q.id}
                className={`game-card p-6 border ${
                  isQuestionCorrect ? 'border-emerald-800/60 bg-emerald-950/10' : 'border-rose-800/60 bg-rose-950/10'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-sm text-slate-400">Q{idx + 1}.</span>
                    <span className="font-display font-bold text-base text-slate-100">{q.text}</span>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-extrabold font-display flex items-center gap-1 shrink-0 ${
                      isQuestionCorrect
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-rose-950 text-rose-300 border border-rose-800'
                    }`}
                  >
                    {isQuestionCorrect ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> +{userAns?.pointsAwarded} pts
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5 text-rose-400" /> 0 pts
                      </>
                    )}
                  </span>
                </div>

                {/* Options List */}
                <div className="grid grid-cols-1 gap-2 my-3">
                  {q.options?.map((opt: any) => {
                    const isSelected = selectedOptionIds.includes(opt.id);
                    const isCorrect = opt.isCorrect;

                    let optionStyle = 'bg-slate-950 border-slate-800 text-slate-400';
                    if (isCorrect) {
                      optionStyle = 'bg-emerald-950/60 border-emerald-700 text-emerald-200 font-bold';
                    } else if (isSelected && !isCorrect) {
                      optionStyle = 'bg-rose-950/60 border-rose-700 text-rose-200 font-bold';
                    }

                    return (
                      <div
                        key={opt.id}
                        className={`p-3.5 rounded-xl border text-xs flex items-center justify-between ${optionStyle}`}
                      >
                        <span>{opt.text}</span>
                        <div className="flex items-center gap-2">
                          {isSelected && (
                            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-700">
                              Your Choice
                            </span>
                          )}
                          {isCorrect && (
                            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-900 text-emerald-200 border border-emerald-600">
                              Correct Answer
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                {q.explanation && (
                  <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300">
                    <span className="font-bold text-purple-400 font-display">Explanation: </span>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
