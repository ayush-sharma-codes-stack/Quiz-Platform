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
  Sparkles,
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
          particleCount: 150,
          spread: 90,
          origin: { y: 0.5 },
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
        <div className="w-14 h-14 border-4 border-amber-400 border-t-transparent rounded-full animate-spin shadow-game-glow-amber" />
        <p className="font-display font-black text-base text-amber-300 animate-pulse">Calculating Score Celebration...</p>
      </div>
    );
  }

  if (error || !attemptDetail) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 rounded-3xl bg-slate-900 border-2 border-slate-700 text-center shadow-game-coral">
        <p className="text-rose-400 font-extrabold mb-4">{error || 'Attempt result not found.'}</p>
        <Link to="/quizzes" className="btn-game btn-game-purple px-6 py-3 text-xs">
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
        initial={{ opacity: 0, scale: 0.93 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`game-card p-8 border-2 text-center space-y-6 relative overflow-hidden shadow-2xl ${
          passed
            ? 'bg-gradient-to-b from-slate-950 via-emerald-950/60 to-slate-950 border-emerald-500/80 shadow-game-emerald'
            : 'bg-gradient-to-b from-slate-950 via-amber-950/60 to-slate-950 border-amber-500/80 shadow-game-amber'
        }`}
      >
        <div className="inline-flex p-5 rounded-3xl bg-slate-950 border-2 border-slate-700 shadow-game-amber-sm mb-2 relative">
          {passed ? (
            <Trophy className="w-20 h-20 text-amber-400 fill-amber-400 animate-float" />
          ) : (
            <RotateCcw className="w-20 h-20 text-amber-400 animate-spin-slow" />
          )}
          <Sparkles className="w-5 h-5 text-amber-300 absolute -top-2 -right-2 animate-ping" />
        </div>

        <div className="space-y-2">
          <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
            {passed ? 'Quest Passed! Victory!' : 'Great Effort! Keep Practicing!'}
          </h1>
          <p className="text-sm text-slate-300 font-semibold max-w-lg mx-auto">
            {passed
              ? `Congratulations! You've mastered ${quiz?.title} and earned maximum rewards!`
              : `Every attempt sharpens your skills. Review your answers below to conquer the next attempt!`}
          </p>
        </div>

        {/* Score Counter */}
        <div className="py-4 bg-slate-950/60 rounded-3xl border-2 border-slate-800/80 max-w-sm mx-auto shadow-inner">
          <div className="font-display font-black text-6xl sm:text-7xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-teal-400 drop-shadow-lg">
            {displayedScore}%
          </div>
          <p className="text-xs font-black text-slate-300 mt-1 uppercase font-display tracking-wider">
            Score: {score} / {totalPoints} Points (Pass threshold: {quiz?.passingScore}%)
          </p>
        </div>

        {/* XP Earned Banner */}
        <div className="inline-flex items-center gap-3 px-7 py-3.5 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 shadow-game-amber-sm">
          <Zap className="w-7 h-7 text-amber-400 fill-amber-400" />
          <span className="font-display font-black text-xl text-amber-300">
            +{xpEarned} XP Multiplier Awarded!
          </span>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap justify-center gap-4 pt-4 border-t-2 border-slate-800">
          <Link to={`/quizzes/${quizId}`} className="btn-game btn-game-gray px-6 py-3.5 text-xs flex items-center gap-2">
            <RotateCcw className="w-4 h-4" /> Try Again
          </Link>
          <Link to="/leaderboard" className="btn-game btn-game-amber px-6 py-3.5 text-xs flex items-center gap-2 shadow-game-amber">
            <Trophy className="w-4 h-4 text-slate-950" /> Leaderboard
          </Link>
          <Link to="/quizzes" className="btn-game btn-game-teal px-6 py-3.5 text-xs flex items-center gap-2 shadow-game-teal">
            More Quests <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>

      {/* Answer Review Section */}
      <div className="space-y-4">
        <h2 className="font-display font-black text-2xl text-white flex items-center gap-2 tracking-tight">
          <HelpCircle className="w-7 h-7 text-purple-400" /> Quest Breakdown & Explanations
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
                className={`game-card p-6 border-2 transition-all ${
                  isQuestionCorrect ? 'border-emerald-700/60 bg-emerald-950/20' : 'border-rose-700/60 bg-rose-950/20'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="font-display font-black text-sm text-slate-400">Q{idx + 1}.</span>
                    <span className="font-display font-black text-base text-white">{q.text}</span>
                  </div>

                  <span
                    className={`badge-3d shrink-0 ${
                      isQuestionCorrect
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                        : 'bg-rose-950 text-rose-300 border-rose-600'
                    }`}
                  >
                    {isQuestionCorrect ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" /> +{userAns?.pointsAwarded} pts
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-rose-400" /> 0 pts
                      </>
                    )}
                  </span>
                </div>

                {/* Options List */}
                <div className="grid grid-cols-1 gap-2.5 my-4">
                  {q.options?.map((opt: any) => {
                    const isSelected = selectedOptionIds.includes(opt.id);
                    const isCorrect = opt.isCorrect;

                    let optionStyle = 'bg-slate-950/90 border-slate-800 text-slate-300';
                    if (isCorrect) {
                      optionStyle = 'bg-emerald-950/80 border-emerald-600 text-emerald-200 font-black border-2 shadow-sm';
                    } else if (isSelected && !isCorrect) {
                      optionStyle = 'bg-rose-950/80 border-rose-600 text-rose-200 font-black border-2 shadow-sm';
                    }

                    return (
                      <div
                        key={opt.id}
                        className={`p-4 rounded-2xl border text-xs font-semibold flex items-center justify-between ${optionStyle}`}
                      >
                        <span className="leading-relaxed">{opt.text}</span>
                        <div className="flex items-center gap-2">
                          {isSelected && (
                            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-lg bg-slate-900 text-slate-200 border border-slate-700">
                              Your Choice
                            </span>
                          )}
                          {isCorrect && (
                            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-lg bg-emerald-900 text-emerald-200 border border-emerald-500">
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
                  <div className="mt-3 p-4 rounded-2xl bg-slate-950 border-2 border-slate-800/80 text-xs text-slate-200 font-semibold shadow-inner">
                    <span className="font-black text-purple-400 font-display">Explanation: </span>
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
