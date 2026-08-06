import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useAudioStore } from '../store/audioStore';

export const SoundToggle: React.FC = () => {
  const { soundEnabled, toggleSound } = useAudioStore();

  return (
    <button
      onClick={toggleSound}
      className={`p-2.5 rounded-2xl border shadow-sm transition-all duration-150 active:scale-95 cursor-pointer ${
        soundEnabled
          ? 'bg-purple-900/40 text-purple-400 border-purple-700/50 hover:bg-purple-900/60'
          : 'bg-slate-800/80 text-slate-400 border-slate-700/60 hover:bg-slate-700'
      }`}
      title={soundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
      aria-label="Toggle Sound"
    >
      {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
    </button>
  );
};
