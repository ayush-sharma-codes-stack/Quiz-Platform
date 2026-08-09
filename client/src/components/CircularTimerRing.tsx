import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Zap } from 'lucide-react';
import { soundFx } from '../utils/sound';

interface CircularTimerRingProps {
  timeLeftSeconds: number;
  totalTimeSeconds: number;
}

export const CircularTimerRing: React.FC<CircularTimerRingProps> = ({
  timeLeftSeconds,
  totalTimeSeconds,
}) => {
  const percentage = Math.max(0, Math.min(100, (timeLeftSeconds / totalTimeSeconds) * 100));

  const isWarning30 = timeLeftSeconds <= 30 && timeLeftSeconds > 10;
  const isDanger10 = timeLeftSeconds <= 10 && timeLeftSeconds > 0;

  useEffect(() => {
    if (isDanger10) {
      soundFx.playTimerTick();
    }
  }, [timeLeftSeconds, isDanger10]);

  // SVG parameters
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  let strokeColor = '#10B981'; // Green
  let glowClass = 'shadow-game-glow-teal';
  if (percentage <= 50 && percentage > 20) {
    strokeColor = '#F59E0B'; // Amber
    glowClass = 'shadow-game-glow-amber';
  } else if (percentage <= 20) {
    strokeColor = '#EF4444'; // Red
    glowClass = 'shadow-game-glow-coral';
  }

  const minutes = Math.floor(timeLeftSeconds / 60);
  const seconds = timeLeftSeconds % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div
      className={`relative inline-flex items-center justify-center p-3 rounded-full transition-all duration-300 backdrop-blur-2xl border-4 ${
        isDanger10
          ? 'animate-pulse-fast bg-rose-950/80 border-rose-500 shadow-game-glow-coral ring-4 ring-rose-500/50'
          : isWarning30
          ? 'animate-pulse bg-amber-950/60 border-amber-500 shadow-game-glow-amber'
          : `bg-slate-900/90 border-slate-700/80 ${glowClass}`
      }`}
    >
      <svg className="w-28 h-28 transform -rotate-90">
        {/* Outer Bevel Track */}
        <circle
          cx="56"
          cy="56"
          r={radius}
          className="stroke-slate-950"
          strokeWidth="10"
          fill="transparent"
        />
        {/* Track */}
        <circle
          cx="56"
          cy="56"
          r={radius}
          className="stroke-slate-800"
          strokeWidth="8"
          fill="transparent"
        />
        {/* Progress Ring */}
        <motion.circle
          cx="56"
          cy="56"
          r={radius}
          stroke={strokeColor}
          strokeWidth="8"
          strokeLinecap="round"
          fill="transparent"
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: 'linear' }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {isDanger10 ? (
          <Zap className="w-5 h-5 text-rose-400 animate-bounce mb-0.5" />
        ) : (
          <Clock className={`w-4 h-4 mb-0.5 ${isWarning30 ? 'text-amber-400' : 'text-slate-400'}`} />
        )}
        <span
          className={`font-display font-black text-base tracking-wider drop-shadow-md ${
            isDanger10 ? 'text-rose-400 scale-110' : isWarning30 ? 'text-amber-400' : 'text-white'
          }`}
        >
          {formattedTime}
        </span>
      </div>
    </div>
  );
};
