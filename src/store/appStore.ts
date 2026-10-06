import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppStoreState {
  installedApps: string[]; // array of app IDs
  installApp: (id: string) => void;
  uninstallApp: (id: string) => void;
  isAppInstalled: (id: string) => boolean;
}

export const useAppStore = create<AppStoreState>()(
  persist(
    (set, get) => ({
      installedApps: ['file-manager', 'terminal', 'editor', 'settings', 'calculator', 'monitor', 'browser', 'app-store'],
      installApp: (id) => set((state) => ({ installedApps: [...new Set([...state.installedApps, id])] })),
      uninstallApp: (id) => set((state) => ({ installedApps: state.installedApps.filter(appId => appId !== id) })),
      isAppInstalled: (id) => get().installedApps.includes(id),
    }),
    {
      name: 'app-store-storage',
    }
  )
);
