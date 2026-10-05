import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SystemPhase = 'booting' | 'setup' | 'login' | 'desktop';

interface SystemState {
  phase: SystemPhase;
  user: {
    username: string;
    avatar?: string;
  } | null;
  settings: {
    theme: 'dark' | 'light';
    wallpaper: string;
  };
  setPhase: (phase: SystemPhase) => void;
  setUser: (username: string) => void;
  setSettings: (settings: Partial<SystemState['settings']>) => void;
  resetSystem: () => void;
}

export const useSystemStore = create<SystemState>()(
  persist(
    (set) => ({
      phase: 'booting',
      user: null,
      settings: {
        theme: 'dark',
        wallpaper: '/wallpapers/default.jpg',
      },
      setPhase: (phase) => set({ phase }),
      setUser: (username) => set((state) => ({ user: { ...state.user, username } })),
      setSettings: (newSettings) => set((state) => ({ settings: { ...state.settings, ...newSettings } })),
      resetSystem: () => set({ phase: 'setup', user: null }),
    }),
    {
      name: 'system-storage',
    }
  )
);
