import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, ArrowRight, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';
import { apiRequest } from '../services/api';

export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const tokenParam = searchParams.get('token') || '';

  const [token, setToken] = useState(tokenParam);
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await apiRequest('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, newPassword }),
      });

      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      if (err.errors && err.errors.length > 0) {
        setError(err.errors.map((e: any) => e.message).join(', '));
      } else {
        setError(err.message || 'Reset token expired or invalid.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative">
      <div className="absolute top-24 right-1/3 w-56 h-56 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md game-card border-2 border-slate-700/80 p-8 shadow-game-teal relative z-10"
      >
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-20 h-20 rounded-3xl bg-teal-500/20 border-2 border-teal-500/40 flex items-center justify-center text-teal-400 mb-5 shadow-game-teal-sm">
            <ShieldCheck className="w-9 h-9" />
          </div>
          <h2 className="font-display font-black text-3xl text-white tracking-tight">Set New Password</h2>
          <p className="text-sm font-semibold text-slate-300 mt-1">Enter your new secure password below</p>
        </div>

        {error && (
          <div className="mb-4 p-4 rounded-2xl bg-rose-950/80 border-2 border-rose-700/60 text-rose-300 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="p-6 rounded-2xl bg-emerald-950/80 border-2 border-emerald-700/60 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="font-display font-black text-xl text-emerald-200">Password Reset Complete!</h3>
            <p className="text-sm font-semibold text-slate-300">Redirecting to login page...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-2 font-display">
                Reset Token
              </label>
              <input
                type="text"
                required
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Paste token here"
                className="w-full bg-slate-950/90 border-2 border-slate-800 rounded-2xl px-4 py-3.5 text-xs font-mono font-bold text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-2 font-display">
                New Password (≥8 chars, 1 number, 1 special char)
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950/90 border-2 border-slate-800 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-game btn-game-teal py-3.5 text-sm flex items-center justify-center gap-2"
            >
              {isLoading ? 'Updating...' : 'Update Password'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-xs text-slate-400 font-semibold">
          <Link to="/login" className="font-black text-teal-400 hover:underline">
            Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
