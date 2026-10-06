import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SystemPhase = 'booting' | 'setup' | 'login' | 'desktop';

interface SystemState {
  phase: SystemPhase;
  user: {
    username: string;
    avatar?: string;
    password?: string;
  } | null;
  settings: {
    theme: 'dark' | 'light';
    wallpaper: string;
    language: string;
    region: string;
    domain: string;
    telemetryEnabled: boolean;
    wifiEnabled: boolean;
    bluetoothEnabled: boolean;
    accentColor: string;
    volume: number;
    brightness: number;
  };
  setPhase: (phase: SystemPhase) => void;
  setUser: (user: { username?: string; avatar?: string; password?: string }) => void;
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
        language: 'en-US',
        region: 'US',
        domain: 'WORKGROUP',
        telemetryEnabled: true,
        wifiEnabled: true,
        bluetoothEnabled: true,
        accentColor: 'blue',
        volume: 80,
        brightness: 100,
      },
      setPhase: (phase) => set({ phase }),
      setUser: (user) => set((state) => ({ user: state.user ? { ...state.user, ...user } : { username: user.username || 'User', ...user } })),
      setSettings: (newSettings) => set((state) => ({ settings: { ...state.settings, ...newSettings } })),
      resetSystem: () => set({ phase: 'setup', user: null }),
    }),
    {
      name: 'system-storage',
    }
  )
);
