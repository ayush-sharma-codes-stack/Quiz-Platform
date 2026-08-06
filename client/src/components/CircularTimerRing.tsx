import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
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
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  let strokeColor = '#10B981'; // Green
  if (percentage <= 50 && percentage > 20) {
    strokeColor = '#F59E0B'; // Amber
  } else if (percentage <= 20) {
    strokeColor = '#EF4444'; // Red
  }

  const minutes = Math.floor(timeLeftSeconds / 60);
  const seconds = timeLeftSeconds % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div
      className={`relative inline-flex items-center justify-center p-2 rounded-full transition-all duration-300 ${
        isDanger10
          ? 'animate-pulse-fast bg-rose-950/60 ring-4 ring-rose-500/50 shadow-lg shadow-rose-500/30'
          : isWarning30
          ? 'animate-pulse bg-amber-950/40 ring-2 ring-amber-500/40 shadow-md shadow-amber-500/20'
          : 'bg-slate-900/80 ring-1 ring-slate-800'
      }`}
    >
      <svg className="w-24 h-24 transform -rotate-90">
        {/* Background track */}
        <circle
          cx="48"
          cy="48"
          r={radius}
          className="stroke-slate-800"
          strokeWidth="8"
          fill="transparent"
        />
        {/* Progress Ring */}
        <motion.circle
          cx="48"
          cy="48"
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
        <Clock className={`w-4 h-4 mb-0.5 ${isDanger10 ? 'text-rose-400 animate-bounce' : 'text-slate-400'}`} />
        <span
          className={`font-display font-bold text-sm tracking-wider ${
            isDanger10 ? 'text-rose-400 scale-110' : isWarning30 ? 'text-amber-400' : 'text-slate-100'
          }`}
        >
          {formattedTime}
        </span>
      </div>
    </div>
  );
};
