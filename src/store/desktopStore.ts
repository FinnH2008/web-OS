import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DesktopIconPosition {
  id: string;
  x: number;
  y: number;
}

interface DesktopState {
  iconPositions: DesktopIconPosition[];
  updateIconPosition: (id: string, x: number, y: number) => void;
}

export const useDesktopStore = create<DesktopState>()(
  persist(
    (set) => ({
      iconPositions: [],
      updateIconPosition: (id, x, y) => set((state) => {
          const exists = state.iconPositions.find(p => p.id === id);
          if (exists) {
              return { iconPositions: state.iconPositions.map(p => p.id === id ? { ...p, x, y } : p) };
          }
          return { iconPositions: [...state.iconPositions, { id, x, y }] };
      }),
    }),
    {
      name: 'desktop-storage',
    }
  )
);
