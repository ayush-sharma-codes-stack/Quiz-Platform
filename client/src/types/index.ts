export type Role = 'ADMIN' | 'STUDENT';
export type QuizDifficulty = 'EASY' | 'MEDIUM' | 'HARD';
export type QuizStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type QuestionType = 'SINGLE_CHOICE' | 'MULTI_CHOICE' | 'TRUE_FALSE';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status?: 'ACTIVE' | 'DEACTIVATED';
  xp: number;
  level: number;
  streak: number;
  createdAt?: string;
  lastAttemptAt?: string;
  badges?: UserBadge[];
  levelProgress?: {
    currentLevel: number;
    xpInCurrentLevel: number;
    xpNeededForNextLevel: number;
    percentage: number;
  };
}

export interface Option {
  id: string;
  questionId?: string;
  text: string;
  isCorrect?: boolean;
}

export interface Question {
  id: string;
  quizId?: string;
  type: QuestionType;
  text: string;
  points: number;
  explanation?: string;
  order: number;
  options: Option[];
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: QuizDifficulty;
  timeLimitSeconds: number;
  passingScore: number;
  thumbnail?: string;
  status: QuizStatus;
  createdById?: string;
  createdBy?: { name: string; email?: string };
  createdAt: string;
  updatedAt?: string;
  questions?: Question[];
  _count?: { questions?: number; attempts?: number };
}

export interface AttemptAnswer {
  id: string;
  questionId: string;
  selectedOptionIds: string;
  isCorrect: boolean;
  pointsAwarded: number;
}

export interface Attempt {
  id: string;
  quizId: string;
  userId: string;
  startedAt: string;
  submittedAt?: string;
  score: number;
  totalPoints: number;
  percentage: number;
  passed: boolean;
  xpEarned: number;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';
  quiz?: Quiz;
  answers?: AttemptAnswer[];
  user?: { name: string; email: string };
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  isEarned?: boolean;
  earnedAt?: string;
}

export interface UserBadge {
  id: string;
  badge: Badge;
  earnedAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  id?: string;
  attemptId?: string;
  name?: string;
  user?: { id: string; name: string; xp: number; level: number };
  role?: string;
  xp?: number;
  level?: number;
  score?: number;
  totalPoints?: number;
  percentage?: number;
  passed?: boolean;
  timeTakenSeconds?: number;
  submittedAt?: string;
  streak?: number;
  quizzesCompleted?: number;
  badge: 'GOLD' | 'SILVER' | 'BRONZE' | 'PLAYER';
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  errors?: any[];
  [key: string]: any;
}
