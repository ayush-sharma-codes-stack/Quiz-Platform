import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useThemeStore } from './store/themeStore';
import { useAudioStore } from './store/audioStore';
import { soundFx } from './utils/sound';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Auth Pages
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';

// Student Pages
import { DashboardPage } from './pages/DashboardPage';
import { QuizzesPage } from './pages/QuizzesPage';
import { QuizDetailPage } from './pages/QuizDetailPage';
import { QuizAttemptPage } from './pages/QuizAttemptPage';
import { QuizResultPage } from './pages/QuizResultPage';
import { HistoryPage } from './pages/HistoryPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { ProfilePage } from './pages/ProfilePage';

// Admin Pages
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminQuizzesPage } from './pages/AdminQuizzesPage';
import { AdminQuizEditPage } from './pages/AdminQuizEditPage';
import { AdminUsersPage } from './pages/AdminUsersPage';
import { AdminAnalyticsPage } from './pages/AdminAnalyticsPage';

// 404
import { NotFoundPage } from './pages/NotFoundPage';

// Route Guards
const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
};

const RequireAdmin: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user?.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const GuestOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to={user?.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard'} replace />;
  }

  return <>{children}</>;
};

function AppContent() {
  const { theme } = useThemeStore();
  const { soundEnabled } = useAudioStore();

  // Sync theme class on root element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [theme]);

  // Sync sound FX enabled state
  useEffect(() => {
    soundFx.enabled = soundEnabled;
  }, [soundEnabled]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 dark:bg-slate-950 text-slate-100 font-body">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/quizzes" replace />} />

          {/* Public Auth Routes */}
          <Route path="/login" element={<GuestOnly><LoginPage /></GuestOnly>} />
          <Route path="/signup" element={<GuestOnly><SignupPage /></GuestOnly>} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Public Quiz Browsing (No Auth Required) */}
          <Route path="/quizzes" element={<QuizzesPage />} />

          {/* Student Routes (Auth Required) */}
          <Route
            path="/dashboard"
            element={<RequireAuth><DashboardPage /></RequireAuth>}
          />
          <Route
            path="/quizzes/:id"
            element={<RequireAuth><QuizDetailPage /></RequireAuth>}
          />
          <Route
            path="/quizzes/:id/attempt"
            element={<RequireAuth><QuizAttemptPage /></RequireAuth>}
          />
          <Route
            path="/quizzes/:id/result/:attemptId"
            element={<RequireAuth><QuizResultPage /></RequireAuth>}
          />
          <Route
            path="/history"
            element={<RequireAuth><HistoryPage /></RequireAuth>}
          />
          <Route
            path="/leaderboard"
            element={<RequireAuth><LeaderboardPage /></RequireAuth>}
          />
          <Route
            path="/profile"
            element={<RequireAuth><ProfilePage /></RequireAuth>}
          />

          {/* Admin Routes (Admin Role Required) */}
          <Route
            path="/admin/dashboard"
            element={<RequireAdmin><AdminDashboardPage /></RequireAdmin>}
          />
          <Route
            path="/admin/quizzes"
            element={<RequireAdmin><AdminQuizzesPage /></RequireAdmin>}
          />
          <Route
            path="/admin/quizzes/:id/edit"
            element={<RequireAdmin><AdminQuizEditPage /></RequireAdmin>}
          />
          <Route
            path="/admin/users"
            element={<RequireAdmin><AdminUsersPage /></RequireAdmin>}
          />
          <Route
            path="/admin/analytics"
            element={<RequireAdmin><AdminAnalyticsPage /></RequireAdmin>}
          />

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
