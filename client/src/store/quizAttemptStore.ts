import { create } from 'zustand';
import { Quiz, Question, Attempt } from '../types';
import { apiRequest } from '../services/api';
import { soundFx } from '../utils/sound';

interface QuizAttemptState {
  quiz: Quiz | null;
  attempt: Attempt | null;
  currentQuestionIndex: number;
  userAnswers: Record<string, string[]>; // questionId -> selectedOptionIds[]
  timeLeftSeconds: number;
  isSubmitting: boolean;

  setAttempt: (quiz: Quiz, attempt: Attempt) => void;
  toggleOptionSelection: (questionId: string, optionId: string, type: string) => void;
  setCurrentQuestionIndex: (index: number) => void;
  setTimeLeftSeconds: (time: number | ((prev: number) => number)) => void;
  saveCurrentAnswer: () => Promise<void>;
  submitQuizAttempt: () => Promise<{ attempt: Attempt; user: any; xpEarned: number; newBadges: any[] }>;
  resetAttempt: () => void;
}

export const useQuizAttemptStore = create<QuizAttemptState>((set, get) => ({
  quiz: null,
  attempt: null,
  currentQuestionIndex: 0,
  userAnswers: {},
  timeLeftSeconds: 0,
  isSubmitting: false,

  setAttempt: (quiz, attempt) => {
    // calculate remaining time based on startedAt
    const elapsedSeconds = Math.max(0, Math.floor((Date.now() - new Date(attempt.startedAt).getTime()) / 1000));
    const remaining = Math.max(0, quiz.timeLimitSeconds - elapsedSeconds);

    set({
      quiz,
      attempt,
      currentQuestionIndex: 0,
      userAnswers: {},
      timeLeftSeconds: remaining,
      isSubmitting: false,
    });
  },

  toggleOptionSelection: (questionId, optionId, type) => {
    const { userAnswers } = get();
    const current = userAnswers[questionId] || [];

    let updated: string[];
    if (type === 'SINGLE_CHOICE' || type === 'TRUE_FALSE') {
      updated = [optionId];
    } else {
      // MULTI_CHOICE
      if (current.includes(optionId)) {
        updated = current.filter((id) => id !== optionId);
      } else {
        updated = [...current, optionId];
      }
    }

    set({
      userAnswers: {
        ...userAnswers,
        [questionId]: updated,
      },
    });

    // Auto trigger background save
    get().saveCurrentAnswer();
  },

  setCurrentQuestionIndex: (index) => {
    const { quiz } = get();
    if (!quiz || !quiz.questions) return;
    if (index >= 0 && index < quiz.questions.length) {
      set({ currentQuestionIndex: index });
    }
  },

  setTimeLeftSeconds: (timeOrFn) => {
    set((state) => ({
      timeLeftSeconds: typeof timeOrFn === 'function' ? timeOrFn(state.timeLeftSeconds) : timeOrFn,
    }));
  },

  saveCurrentAnswer: async () => {
    const { attempt, quiz, currentQuestionIndex, userAnswers } = get();
    if (!attempt || !quiz || !quiz.questions) return;

    const currentQuestion = quiz.questions[currentQuestionIndex];
    if (!currentQuestion) return;

    const selectedOptionIds = userAnswers[currentQuestion.id] || [];
    if (selectedOptionIds.length === 0) return;

    try {
      await apiRequest(`/attempts/${attempt.id}/answer`, {
        method: 'POST',
        body: JSON.stringify({
          questionId: currentQuestion.id,
          selectedOptionIds,
        }),
      });
    } catch (e) {
      console.error('Background answer save error:', e);
    }
  },

  submitQuizAttempt: async () => {
    const { attempt } = get();
    if (!attempt) throw new Error('No active quiz attempt found.');

    set({ isSubmitting: true });

    try {
      const res = await apiRequest(`/attempts/${attempt.id}/submit`, {
        method: 'POST',
      });

      if (res.attempt?.passed) {
        soundFx.playLevelUp();
      } else {
        soundFx.playIncorrect();
      }

      set({ isSubmitting: false });
      return res;
    } catch (error) {
      set({ isSubmitting: false });
      throw error;
    }
  },

  resetAttempt: () => {
    set({
      quiz: null,
      attempt: null,
      currentQuestionIndex: 0,
      userAnswers: {},
      timeLeftSeconds: 0,
      isSubmitting: false,
    });
  },
}));
