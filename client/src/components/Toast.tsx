import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  type?: 'success' | 'error';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'error', onClose }) => {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-6 right-6 z-50 max-w-md"
        >
          <div
            className={`flex items-center gap-3 p-4 rounded-2xl border shadow-2xl backdrop-blur-xl ${
              type === 'error'
                ? 'bg-rose-950/90 border-rose-700 text-rose-100 shadow-rose-900/40'
                : 'bg-emerald-950/90 border-emerald-700 text-emerald-100 shadow-emerald-900/40'
            }`}
          >
            {type === 'error' ? (
              <AlertCircle className="w-6 h-6 text-rose-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            )}
            <div className="flex-1 text-sm font-medium pr-2">{message}</div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-white/10 text-slate-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
