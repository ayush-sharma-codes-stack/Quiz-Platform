import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gamepad2,
  Trophy,
  LayoutDashboard,
  Users,
  BarChart3,
  LogOut,
  User,
  Flame,
  Zap,
  Menu,
  X,
  History,
  BookOpen,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { ThemeToggle } from './ThemeToggle';
import { SoundToggle } from './SoundToggle';

export const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = user?.role === 'ADMIN';

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to={isAdmin ? '/admin/dashboard' : '/dashboard'} className="flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-teal-400 p-0.5 shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Gamepad2 className="w-7 h-7 text-teal-400 group-hover:rotate-12 transition-transform" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-display font-extrabold text-2xl tracking-tight text-white flex items-center gap-1">
              Quiz<span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-purple-400">Arena</span>
            </span>
            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase -mt-1">
              {isAdmin ? 'Command Center' : 'Online Assessment'}
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        {isAuthenticated && (
          <nav className="hidden md:flex items-center gap-2">
            {!isAdmin ? (
              <>
                <Link
                  to="/dashboard"
                  className={`px-4 py-2 rounded-2xl font-display font-bold text-sm transition-all flex items-center gap-2 ${
                    isActive('/dashboard')
                      ? 'bg-purple-950/60 text-purple-300 border border-purple-800/60 shadow-md shadow-purple-950'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" /> Profile
                </Link>
                <Link
                  to="/quizzes"
                  className={`px-4 py-2 rounded-2xl font-display font-bold text-sm transition-all flex items-center gap-2 ${
                    isActive('/quizzes')
                      ? 'bg-purple-950/60 text-purple-300 border border-purple-800/60 shadow-md shadow-purple-950'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <BookOpen className="w-4 h-4" /> Quizzes
                </Link>
                <Link
                  to="/leaderboard"
                  className={`px-4 py-2 rounded-2xl font-display font-bold text-sm transition-all flex items-center gap-2 ${
                    isActive('/leaderboard')
                      ? 'bg-purple-950/60 text-purple-300 border border-purple-800/60 shadow-md shadow-purple-950'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Trophy className="w-4 h-4 text-amber-400" /> Leaderboard
                </Link>
                <Link
                  to="/history"
                  className={`px-4 py-2 rounded-2xl font-display font-bold text-sm transition-all flex items-center gap-2 ${
                    isActive('/history')
                      ? 'bg-purple-950/60 text-purple-300 border border-purple-800/60 shadow-md shadow-purple-950'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <History className="w-4 h-4" /> History
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/admin/dashboard"
                  className={`px-4 py-2 rounded-2xl font-display font-bold text-sm transition-all flex items-center gap-2 ${
                    isActive('/admin/dashboard')
                      ? 'bg-purple-950/60 text-purple-300 border border-purple-800/60 shadow-md shadow-purple-950'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
                <Link
                  to="/admin/quizzes"
                  className={`px-4 py-2 rounded-2xl font-display font-bold text-sm transition-all flex items-center gap-2 ${
                    isActive('/admin/quizzes')
                      ? 'bg-purple-950/60 text-purple-300 border border-purple-800/60 shadow-md shadow-purple-950'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <BookOpen className="w-4 h-4" /> Manage Quizzes
                </Link>
                <Link
                  to="/admin/users"
                  className={`px-4 py-2 rounded-2xl font-display font-bold text-sm transition-all flex items-center gap-2 ${
                    isActive('/admin/users')
                      ? 'bg-purple-950/60 text-purple-300 border border-purple-800/60 shadow-md shadow-purple-950'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Users className="w-4 h-4" /> Manage Users
                </Link>
                <Link
                  to="/admin/analytics"
                  className={`px-4 py-2 rounded-2xl font-display font-bold text-sm transition-all flex items-center gap-2 ${
                    isActive('/admin/analytics')
                      ? 'bg-purple-950/60 text-purple-300 border border-purple-800/60 shadow-md shadow-purple-950'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" /> Analytics
                </Link>
              </>
            )}
          </nav>
        )}

        {/* Right Section: Toggles + Player Status HUD + Avatar */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <SoundToggle />

          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 p-1.5 pr-3 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-purple-600/50 transition-all cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center font-display font-bold text-white shadow-md">
                  {user.name.charAt(0).toUpperCase()}
                </div>

                <div className="hidden sm:flex flex-col text-left">
                  <span className="font-display font-bold text-xs text-white leading-tight">
                    {user.name}
                  </span>
                  <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400">
                    <span className="text-amber-400 flex items-center gap-0.5">
                      <Zap className="w-3 h-3 fill-amber-400" /> {user.xp} XP
                    </span>
                    {user.streak > 0 && (
                      <span className="text-rose-400 flex items-center gap-0.5">
                        <Flame className="w-3 h-3 fill-rose-500 text-rose-500" /> {user.streak}d
                      </span>
                    )}
                  </div>
                </div>
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-3 w-56 bg-slate-900 border border-slate-800 rounded-3xl p-3 shadow-2xl z-50"
                  >
                    <div className="px-3 py-2 border-b border-slate-800 mb-2">
                      <p className="font-display font-bold text-sm text-slate-200">{user.name}</p>
                      <p className="text-xs text-slate-400 truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800">
                        {user.role}
                      </span>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white"
                    >
                      <User className="w-4 h-4 text-purple-400" /> Player Profile
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/40"
                    >
                      <LogOut className="w-4 h-4" /> Log Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn-game btn-game-gray px-4 py-2 text-xs">
                Log In
              </Link>
              <Link to="/signup" className="btn-game btn-game-purple px-4 py-2 text-xs">
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950/95 backdrop-blur-xl px-4 py-6 space-y-3">
          {isAuthenticated && !isAdmin && (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-2xl font-display font-bold text-sm bg-slate-900 text-slate-200"
              >
                Profile & Badges
              </Link>
              <Link
                to="/quizzes"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-2xl font-display font-bold text-sm bg-slate-900 text-slate-200"
              >
                Browse Quizzes
              </Link>
              <Link
                to="/leaderboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-2xl font-display font-bold text-sm bg-slate-900 text-slate-200"
              >
                Global Leaderboard
              </Link>
              <Link
                to="/history"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-2xl font-display font-bold text-sm bg-slate-900 text-slate-200"
              >
                Attempt History
              </Link>
            </>
          )}

          {isAuthenticated && isAdmin && (
            <>
              <Link
                to="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-2xl font-display font-bold text-sm bg-slate-900 text-slate-200"
              >
                Command Center
              </Link>
              <Link
                to="/admin/quizzes"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-2xl font-display font-bold text-sm bg-slate-900 text-slate-200"
              >
                Manage Quizzes
              </Link>
              <Link
                to="/admin/users"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-2xl font-display font-bold text-sm bg-slate-900 text-slate-200"
              >
                Manage Users
              </Link>
              <Link
                to="/admin/analytics"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-2xl font-display font-bold text-sm bg-slate-900 text-slate-200"
              >
                Analytics
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};
