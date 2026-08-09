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
  Sparkles,
  ChevronDown,
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

  // Calculate Level based on XP (e.g. 100 XP per level)
  const currentLevel = user ? Math.floor(user.xp / 100) + 1 : 1;

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 dark:bg-slate-950/90 backdrop-blur-2xl border-b-2 border-slate-800/90 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to={isAdmin ? '/admin/dashboard' : '/dashboard'} className="flex items-center gap-3 group">
          <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-500 to-amber-400 p-1 shadow-game-purple group-hover:scale-105 transition-transform duration-200">
            <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center border border-white/20">
              <Gamepad2 className="w-7 h-7 text-amber-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-slate-950 animate-ping" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-slate-950" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-extrabold text-2xl tracking-tight text-white flex items-center gap-1">
              Quiz<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-purple-400 to-teal-400">Arena</span>
            </span>
            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase -mt-1 flex items-center gap-1">
              {isAdmin ? (
                <span className="text-rose-400 flex items-center gap-0.5"><Sparkles className="w-2.5 h-2.5" /> Admin HQ</span>
              ) : (
                <span className="text-teal-400">Gamified Arcade</span>
              )}
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links (Tactile 3D Buttons) */}
        {isAuthenticated && (
          <nav className="hidden md:flex items-center gap-2">
            {!isAdmin ? (
              <>
                <Link
                  to="/dashboard"
                  className={`btn-game text-xs px-4 py-2.5 gap-2 ${
                    isActive('/dashboard')
                      ? 'btn-game-purple shadow-game-purple'
                      : 'btn-game-gray opacity-90 hover:opacity-100'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" /> Profile & Stats
                </Link>
                <Link
                  to="/quizzes"
                  className={`btn-game text-xs px-4 py-2.5 gap-2 ${
                    isActive('/quizzes')
                      ? 'btn-game-teal shadow-game-teal'
                      : 'btn-game-gray opacity-90 hover:opacity-100'
                  }`}
                >
                  <BookOpen className="w-4 h-4" /> Quizzes
                </Link>
                <Link
                  to="/leaderboard"
                  className={`btn-game text-xs px-4 py-2.5 gap-2 ${
                    isActive('/leaderboard')
                      ? 'btn-game-amber shadow-game-amber'
                      : 'btn-game-gray opacity-90 hover:opacity-100'
                  }`}
                >
                  <Trophy className="w-4 h-4 text-slate-950" /> Leaderboard
                </Link>
                <Link
                  to="/history"
                  className={`btn-game text-xs px-4 py-2.5 gap-2 ${
                    isActive('/history')
                      ? 'btn-game-indigo shadow-game-indigo'
                      : 'btn-game-gray opacity-90 hover:opacity-100'
                  }`}
                >
                  <History className="w-4 h-4" /> History
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/admin/dashboard"
                  className={`btn-game text-xs px-4 py-2.5 gap-2 ${
                    isActive('/admin/dashboard')
                      ? 'btn-game-purple shadow-game-purple'
                      : 'btn-game-gray opacity-90 hover:opacity-100'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" /> HQ Dashboard
                </Link>
                <Link
                  to="/admin/quizzes"
                  className={`btn-game text-xs px-4 py-2.5 gap-2 ${
                    isActive('/admin/quizzes')
                      ? 'btn-game-teal shadow-game-teal'
                      : 'btn-game-gray opacity-90 hover:opacity-100'
                  }`}
                >
                  <BookOpen className="w-4 h-4" /> Manage Quizzes
                </Link>
                <Link
                  to="/admin/users"
                  className={`btn-game text-xs px-4 py-2.5 gap-2 ${
                    isActive('/admin/users')
                      ? 'btn-game-amber shadow-game-amber'
                      : 'btn-game-gray opacity-90 hover:opacity-100'
                  }`}
                >
                  <Users className="w-4 h-4" /> Manage Users
                </Link>
                <Link
                  to="/admin/analytics"
                  className={`btn-game text-xs px-4 py-2.5 gap-2 ${
                    isActive('/admin/analytics')
                      ? 'btn-game-pink shadow-game-pink'
                      : 'btn-game-gray opacity-90 hover:opacity-100'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" /> Analytics
                </Link>
              </>
            )}
          </nav>
        )}

        {/* Right Section: Controls + Player Status HUD */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <SoundToggle />

          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 p-1.5 pr-3 rounded-2xl bg-slate-900 border-2 border-slate-700/80 hover:border-purple-500 shadow-md transition-all duration-200 cursor-pointer group"
              >
                {/* 3D Avatar Badge */}
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-amber-500 flex items-center justify-center font-display font-black text-white text-base shadow-game-purple-sm border border-white/30 group-hover:scale-105 transition-transform">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  {/* Level Pill */}
                  <span className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 font-display font-extrabold text-[9px] px-1 rounded-md border border-slate-950 shadow-sm">
                    L{currentLevel}
                  </span>
                </div>

                <div className="hidden sm:flex flex-col text-left">
                  <span className="font-display font-extrabold text-xs text-white leading-tight flex items-center gap-1">
                    {user.name}
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </span>
                  <div className="flex items-center gap-2 text-[11px] font-bold">
                    <span className="text-amber-400 flex items-center gap-0.5 bg-amber-500/10 px-1.5 py-0.5 rounded-lg border border-amber-500/20">
                      <Zap className="w-3 h-3 fill-amber-400" /> {user.xp} XP
                    </span>
                    {user.streak > 0 && (
                      <span className="text-rose-400 flex items-center gap-0.5 bg-rose-500/10 px-1.5 py-0.5 rounded-lg border border-rose-500/20 animate-pulse">
                        <Flame className="w-3 h-3 fill-rose-500" /> {user.streak}d
                      </span>
                    )}
                  </div>
                </div>
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-3 w-60 bg-slate-900/95 border-2 border-slate-700/80 rounded-3xl p-3 shadow-2xl z-50 backdrop-blur-xl"
                  >
                    <div className="px-3 py-2.5 border-b border-slate-800 mb-2 bg-slate-950/60 rounded-2xl">
                      <p className="font-display font-extrabold text-sm text-white">{user.name}</p>
                      <p className="text-xs text-slate-400 truncate">{user.email}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-lg bg-purple-950 text-purple-300 border border-purple-800 uppercase">
                          {user.role}
                        </span>
                        <span className="text-[10px] font-bold text-amber-400">
                          Level {currentLevel} Adventurer
                        </span>
                      </div>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-2xl text-xs font-bold text-slate-200 hover:bg-purple-600/20 hover:text-purple-300 transition-colors"
                    >
                      <User className="w-4 h-4 text-purple-400" /> Player Profile & Badges
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-2xl text-xs font-bold text-rose-400 hover:bg-rose-950/50 hover:text-rose-300 transition-colors mt-1"
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
            className="md:hidden p-2.5 rounded-2xl bg-slate-900 border-2 border-slate-800 text-slate-300 active:scale-95 transition-transform"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t-2 border-slate-800 bg-slate-950/98 backdrop-blur-2xl px-4 py-6 space-y-3"
          >
            {isAuthenticated && !isAdmin && (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-game btn-game-purple w-full py-3 text-sm flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" /> Profile & Stats
                </Link>
                <Link
                  to="/quizzes"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-game btn-game-teal w-full py-3 text-sm flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4" /> Browse Quizzes
                </Link>
                <Link
                  to="/leaderboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-game btn-game-amber w-full py-3 text-sm flex items-center gap-2"
                >
                  <Trophy className="w-4 h-4" /> Global Leaderboard
                </Link>
                <Link
                  to="/history"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-game btn-game-indigo w-full py-3 text-sm flex items-center gap-2"
                >
                  <History className="w-4 h-4" /> Attempt History
                </Link>
              </>
            )}

            {isAuthenticated && isAdmin && (
              <>
                <Link
                  to="/admin/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-game btn-game-purple w-full py-3 text-sm flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" /> Command Center
                </Link>
                <Link
                  to="/admin/quizzes"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-game btn-game-teal w-full py-3 text-sm flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4" /> Manage Quizzes
                </Link>
                <Link
                  to="/admin/users"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-game btn-game-amber w-full py-3 text-sm flex items-center gap-2"
                >
                  <Users className="w-4 h-4" /> Manage Users
                </Link>
                <Link
                  to="/admin/analytics"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-game btn-game-pink w-full py-3 text-sm flex items-center gap-2"
                >
                  <BarChart3 className="w-4 h-4" /> Analytics
                </Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
