import { create } from 'zustand';

export interface WindowData {
  id: string;
  title: string;
  type: 'file-manager' | 'terminal' | 'editor' | 'settings' | 'calculator';
  content?: Record<string, unknown>;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

interface WindowState {
  windows: WindowData[];
  activeWindowId: string | null;
  openWindow: (window: Omit<WindowData, 'id' | 'isOpen' | 'isMinimized' | 'isMaximized' | 'zIndex' | 'position' | 'size'>) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
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
    // Check if a window of this type is already open (could be refined for multiple instances)
    const existingWindow = state.windows.find(w => w.type === windowData.type);
    const newZIndex = getNextZIndex(state.windows);

    if (existingWindow) {
        return {
            windows: state.windows.map(w => w.id === existingWindow.id ? { ...w, isMinimized: false, zIndex: newZIndex } : w),
            activeWindowId: existingWindow.id
        }
    }

    const newWindow: WindowData = {
      ...windowData,
      id: `${windowData.type}-${Date.now()}`,
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      zIndex: newZIndex,
      position: { x: window.innerWidth / 2 - 400, y: window.innerHeight / 2 - 300 },
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
        windows: state.windows.map((w) => (w.id === id ? { ...w, isMaximized: true, isMinimized: false, zIndex: newZIndex } : w)),
        activeWindowId: id,
      }
  }),

  restoreWindow: (id) => set((state) => {
      const newZIndex = getNextZIndex(state.windows);
      return {
        windows: state.windows.map((w) => (w.id === id ? { ...w, isMaximized: false, isMinimized: false, zIndex: newZIndex } : w)),
        activeWindowId: id,
      }
  }),

  focusWindow: (id) => set((state) => {
    const windowToFocus = state.windows.find(w => w.id === id);
    if(!windowToFocus) return state;

    // only update if not already highest
    const highestZ = getNextZIndex(state.windows) -1;
    if(windowToFocus.zIndex === highestZ) return { activeWindowId: id };

    return {
      windows: state.windows.map((w) => (w.id === id ? { ...w, zIndex: highestZ + 1 } : w)),
      activeWindowId: id,
    }
  }),

  updateWindowPosition: (id, position) => set((state) => ({
    windows: state.windows.map((w) => (w.id === id ? { ...w, position } : w)),
  })),

  updateWindowSize: (id, size) => set((state) => ({
    windows: state.windows.map((w) => (w.id === id ? { ...w, size } : w)),
  })),
}));
