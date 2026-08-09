import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, CheckCircle2, AlertCircle, KeyRound } from 'lucide-react';
import { apiRequest } from '../services/api';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setIsLoading(true);

    try {
      const res = await apiRequest('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });

      setMessage(res.message);
      if (res.resetToken) {
        setResetToken(res.resetToken);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to process forgot password request.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative">
      <div className="absolute top-24 left-1/3 w-56 h-56 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md game-card border-2 border-slate-700/80 p-8 shadow-game-amber relative z-10"
      >
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-20 h-20 rounded-3xl bg-amber-500/20 border-2 border-amber-500/40 flex items-center justify-center text-amber-400 mb-5 shadow-game-amber-sm">
            <KeyRound className="w-9 h-9" />
          </div>
          <h2 className="font-display font-black text-3xl text-white tracking-tight">Reset Password</h2>
          <p className="text-sm font-semibold text-slate-300 mt-1">
            Enter your email to receive a password reset token
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 rounded-2xl bg-rose-950/80 border-2 border-rose-700/60 text-rose-300 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="mb-4 p-4 rounded-2xl bg-emerald-950/80 border-2 border-emerald-700/60 text-emerald-300 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {resetToken ? (
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 mb-4">
            <p className="text-xs font-bold text-amber-400">Generated Demo Reset Token:</p>
            <textarea
              readOnly
              value={resetToken}
              className="w-full h-20 bg-slate-900 p-2 text-xs font-mono text-slate-300 rounded-xl border border-slate-800"
            />
            <Link
              to={`/reset-password?token=${encodeURIComponent(resetToken)}`}
              className="btn-game btn-game-amber w-full py-3 text-xs flex items-center justify-center gap-2"
            >
              Proceed to Reset Password <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-2 font-display">
                Registered Email
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="player@example.com"
                  className="w-full bg-slate-950/90 border-2 border-slate-800 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-game btn-game-amber py-3.5 text-sm flex items-center justify-center gap-2"
            >
              {isLoading ? 'Generating Link...' : 'Generate Reset Token'}
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-xs text-slate-400 font-semibold">
          Remember your password?{' '}
          <Link to="/login" className="font-black text-amber-400 hover:underline">
            Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
