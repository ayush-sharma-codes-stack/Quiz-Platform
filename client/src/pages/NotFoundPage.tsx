import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Gamepad2, Home, AlertTriangle } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-8 max-w-lg"
      >
        {/* Glitch Effect 404 */}
        <div className="relative">
          <div className="font-display font-black text-[10rem] sm:text-[12rem] leading-none text-transparent bg-clip-text bg-gradient-to-b from-slate-700 via-slate-600 to-slate-800 select-none">
            404
          </div>
          <div className="absolute inset-0 font-display font-black text-[10rem] sm:text-[12rem] leading-none text-transparent bg-clip-text bg-gradient-to-b from-purple-500 via-teal-400 to-purple-600 opacity-40 animate-pulse select-none">
            404
          </div>
        </div>

        {/* Icon + Message */}
        <div className="space-y-3">
          <div className="flex justify-center">
            <div className="relative">
              <Gamepad2 className="w-20 h-20 text-purple-500/60" />
              <AlertTriangle className="w-8 h-8 text-amber-400 absolute -bottom-2 -right-2 animate-bounce" />
            </div>
          </div>

          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white">
            GAME OVER
          </h1>
          <h2 className="font-display font-bold text-xl text-slate-300">
            — Page Not Found —
          </h2>
          <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
            This zone doesn't exist in our universe. The level you're looking for has been
            deleted, moved, or never existed at all.
          </p>
        </div>

        {/* Error Code Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-rose-950/60 border border-rose-800/60 text-rose-300 font-display font-bold text-sm">
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          Error Code: 404 — Not Found
        </div>

        {/* Back to Base Button */}
        <div className="pt-4">
          <Link
            to="/"
            className="inline-flex btn-game btn-game-purple px-8 py-4 text-base items-center gap-3 shadow-2xl"
          >
            <Home className="w-5 h-5" /> Return to Base
          </Link>
        </div>

        {/* Decorative pixel grid background */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-purple-900/10 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-teal-900/10 blur-3xl" />
        </div>
      </motion.div>
    </div>
  );
};
