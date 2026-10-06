import { create } from 'zustand';

export interface WindowData {
  id: string;
  title: string;
  type: 'file-manager' | 'terminal' | 'editor' | 'settings' | 'calculator' | 'monitor' | 'browser' | 'media-player' | 'app-store';
  content?: Record<string, unknown>;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  snapPosition?: 'left' | 'right' | 'top' | 'none'; // Added snap positioning
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number | string; height: number | string };
  previousState?: { position: { x: number; y: number }; size: { width: number | string; height: number | string } }; // for restoring from snap
}

interface WindowState {
  windows: WindowData[];
  activeWindowId: string | null;
  openWindow: (window: Omit<WindowData, 'id' | 'isOpen' | 'isMinimized' | 'isMaximized' | 'zIndex' | 'position' | 'size'>) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  snapWindow: (id: string, position: 'left' | 'right' | 'top') => void;
  focusWindow: (id: string) => void;
  updateWindowPosition: (id: string, position: { x: number; y: number }) => void;
  updateWindowSize: (id: string, size: { width: number; height: number }) => void;
}

const getNextZIndex = (windows: WindowData[]) => {
  if (windows.length === 0) return 1;
  return Math.max(...windows.map((w) => w.zIndex)) + 1;
};

export const useWindowStore = create<WindowState>((set) => ({
  windows: [],
  activeWindowId: null,

  openWindow: (windowData) => set((state) => {
    const existingWindow = state.windows.find(w => w.type === windowData.type && windowData.type !== 'browser');
    const newZIndex = getNextZIndex(state.windows);

    if (existingWindow) {
        return {
            windows: state.windows.map(w => w.id === existingWindow.id ? {
                ...w,
                isMinimized: false,
                zIndex: newZIndex,
                title: windowData.title,
                content: windowData.content
            } : w),
            activeWindowId: existingWindow.id
        }
    }

    const newWindow: WindowData = {
      ...windowData,
      id: `${windowData.type}-${Date.now()}`,
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      snapPosition: 'none',
      zIndex: newZIndex,
      position: { x: window.innerWidth / 2 - 400 + (state.windows.length * 20), y: window.innerHeight / 2 - 300 + (state.windows.length * 20) },
      size: { width: 800, height: 600 },
    };

    return {
      windows: [...state.windows, newWindow],
      activeWindowId: newWindow.id,
    };
  }),

  closeWindow: (id) => set((state) => ({
    windows: state.windows.filter((w) => w.id !== id),
    activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
  })),

  minimizeWindow: (id) => set((state) => ({
    windows: state.windows.map((w) => (w.id === id ? { ...w, isMinimized: true } : w)),
    activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
  })),

  maximizeWindow: (id) => set((state) => {
      const newZIndex = getNextZIndex(state.windows);
      return {
        windows: state.windows.map((w) => (w.id === id ? { ...w, isMaximized: true, isMinimized: false, snapPosition: 'none', zIndex: newZIndex } : w)),
        activeWindowId: id,
      }
  }),

  restoreWindow: (id) => set((state) => {
      const newZIndex = getNextZIndex(state.windows);
      return {
        windows: state.windows.map((w) => {
             if (w.id === id) {
                 return {
                     ...w,
                     isMaximized: false,
                     isMinimized: false,
                     snapPosition: 'none',
                     zIndex: newZIndex,
                     size: w.previousState ? w.previousState.size : w.size,
                     position: w.previousState ? w.previousState.position : w.position
                 };
             }
             return w;
        }),
        activeWindowId: id,
      }
  }),

  snapWindow: (id, position) => set((state) => {
      const newZIndex = getNextZIndex(state.windows);
      return {
          windows: state.windows.map(w => {
              if (w.id === id) {
                  // Save current state before snapping if we aren't already snapped/maximized
                  const previousState = (w.snapPosition === 'none' && !w.isMaximized) ? { position: w.position, size: w.size } : w.previousState;
                  return {
                      ...w,
                      isMaximized: position === 'top',
                      snapPosition: position,
                      previousState,
                      zIndex: newZIndex
                  };
              }
              return w;
          }),
          activeWindowId: id,
      }
  }),

  focusWindow: (id) => set((state) => {
    if (id === 'desktop-background') {
        return { activeWindowId: null };
    }
    const windowToFocus = state.windows.find(w => w.id === id);
    if(!windowToFocus) return state;

    const highestZ = getNextZIndex(state.windows) -1;
    if(windowToFocus.zIndex === highestZ) return { activeWindowId: id };

    return {
      windows: state.windows.map((w) => (w.id === id ? { ...w, zIndex: highestZ + 1 } : w)),
      activeWindowId: id,
    }
  }),

  updateWindowPosition: (id, position) => set((state) => ({
    windows: state.windows.map((w) => (w.id === id ? { ...w, position, snapPosition: 'none' } : w)),
  })),

  updateWindowSize: (id, size) => set((state) => ({
    windows: state.windows.map((w) => (w.id === id ? { ...w, size, snapPosition: 'none' } : w)),
  })),
}));
