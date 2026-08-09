import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Gamepad2, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { apiRequest } from '../services/api';
import { useAuthStore } from '../store/authStore';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      login(res.user, res.accessToken);

      if (res.user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative">
      {/* Decorative background glow orbs */}
      <div className="absolute top-20 left-1/4 w-64 h-64 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-48 h-48 bg-teal-500/15 rounded-full blur-2xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md game-card border-2 border-slate-700/80 p-8 shadow-game-purple relative z-10"
      >
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-purple-600 to-teal-400 p-1.5 shadow-game-purple mb-5">
            <div className="w-full h-full bg-slate-950 rounded-[20px] flex items-center justify-center">
              <Gamepad2 className="w-9 h-9 text-teal-400" />
            </div>
          </div>
          <h2 className="font-display font-black text-3xl text-white tracking-tight">Welcome Back!</h2>
          <p className="text-sm font-semibold text-slate-300 mt-1">Log in to continue your quiz quest</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-950/80 border-2 border-rose-700/60 text-rose-300 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-2 font-display">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="player@example.com"
                className="w-full bg-slate-950/90 border-2 border-slate-800 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-300 font-display">
                Password
              </label>
              <Link to="/forgot-password" className="text-xs font-black text-purple-400 hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950/90 border-2 border-slate-800 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-game btn-game-purple py-4 text-sm mt-4 flex items-center justify-center gap-2"
          >
            {isLoading ? 'Logging in...' : 'Enter the Arena'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-slate-400 font-semibold">
          Don't have an account?{' '}
          <Link to="/signup" className="font-black text-purple-400 hover:underline">
            Sign up now
          </Link>
        </div>

        {/* Demo Credentials Quick-Fill */}
        <div className="mt-6 pt-6 border-t-2 border-slate-800/80">
          <p className="text-[11px] font-black uppercase tracking-wider text-slate-400 text-center mb-3">
            ⚡ Quick Demo Logins
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => { setEmail('student@quizplatform.com'); setPassword('Student123!'); }}
              className="flex-1 py-2.5 px-3 rounded-xl bg-purple-950/50 hover:bg-purple-950 text-[11px] font-black text-purple-300 border-2 border-purple-800/50 transition-colors"
            >
              Demo Student
            </button>
            <button
              type="button"
              onClick={() => { setEmail('admin@quizplatform.com'); setPassword('Admin123!'); }}
              className="flex-1 py-2.5 px-3 rounded-xl bg-teal-950/50 hover:bg-teal-950 text-[11px] font-black text-teal-300 border-2 border-teal-800/50 transition-colors"
            >
              Demo Admin
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
