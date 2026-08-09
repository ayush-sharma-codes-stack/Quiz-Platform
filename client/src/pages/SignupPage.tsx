import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Gamepad2, User, Mail, Lock, Shield, ArrowRight, AlertCircle } from 'lucide-react';
import { apiRequest } from '../services/api';
import { useAuthStore } from '../store/authStore';

export const SignupPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'STUDENT' | 'ADMIN'>('STUDENT');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await apiRequest('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, role }),
      });

      login(res.user, res.accessToken);
      if (res.user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      if (err.errors && err.errors.length > 0) {
        setError(err.errors.map((e: any) => e.message).join(', '));
      } else {
        setError(err.message || 'Signup failed. Check your input formatting.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative">
      {/* Decorative background glow orbs */}
      <div className="absolute top-20 right-1/4 w-64 h-64 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-1/4 w-48 h-48 bg-purple-600/15 rounded-full blur-2xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md game-card border-2 border-slate-700/80 p-8 shadow-game-teal relative z-10"
      >
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-teal-400 to-purple-600 p-1.5 shadow-game-teal mb-5">
            <div className="w-full h-full bg-slate-950 rounded-[20px] flex items-center justify-center">
              <Gamepad2 className="w-9 h-9 text-purple-400" />
            </div>
          </div>
          <h2 className="font-display font-black text-3xl text-white tracking-tight">Create Player Profile</h2>
          <p className="text-sm font-semibold text-slate-300 mt-1">Join the gamified assessment arena</p>
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
              Full Name
            </label>
            <div className="relative">
              <User className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Player"
                className="w-full bg-slate-950/90 border-2 border-slate-800 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
              />
            </div>
          </div>

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
                className="w-full bg-slate-950/90 border-2 border-slate-800 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-2 font-display">
              Password (≥8 chars, 1 number, 1 special char)
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950/90 border-2 border-slate-800 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
              />
            </div>
          </div>

          {/* Role selector */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-2 font-display">
              Select Role
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('STUDENT')}
                className={`btn-game py-3 px-4 text-xs flex items-center justify-center gap-2 ${
                  role === 'STUDENT' ? 'btn-game-purple' : 'btn-game-gray opacity-70'
                }`}
              >
                <User className="w-4 h-4" /> Student
              </button>

              <button
                type="button"
                onClick={() => setRole('ADMIN')}
                className={`btn-game py-3 px-4 text-xs flex items-center justify-center gap-2 ${
                  role === 'ADMIN' ? 'btn-game-teal' : 'btn-game-gray opacity-70'
                }`}
              >
                <Shield className="w-4 h-4" /> Admin
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-game btn-game-teal py-4 text-sm mt-4 flex items-center justify-center gap-2"
          >
            {isLoading ? 'Creating Profile...' : 'Start Quest'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400 font-semibold">
          Already registered?{' '}
          <Link to="/login" className="font-black text-teal-400 hover:underline">
            Log in here
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
