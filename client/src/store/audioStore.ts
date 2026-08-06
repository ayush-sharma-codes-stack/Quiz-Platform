import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { soundFx } from '../utils/sound';

interface AudioState {
  soundEnabled: boolean;
  toggleSound: () => void;
}

export const useAudioStore = create<AudioState>()(
  persist(
    (set, get) => ({
      soundEnabled: true,
      toggleSound: () => {
        const next = !get().soundEnabled;
        soundFx.enabled = next;
        set({ soundEnabled: next });
      },
    }),
    {
      name: 'quiz_audio_storage',
    }
  )
);
