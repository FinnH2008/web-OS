import { create } from 'zustand';

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: number;
}

interface NotificationState {
  notifications: Notification[];
  addNotification: (title: string, message: string) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  addNotification: (title, message) => set((state) => {
      const newNotif = {
          id: `notif-${Date.now()}`,
          title,
          message,
          timestamp: Date.now(),
      };
      return { notifications: [newNotif, ...state.notifications] };
  }),
  removeNotification: (id) => set((state) => ({
      notifications: state.notifications.filter(n => n.id !== id),
  })),
  clearAll: () => set({ notifications: [] }),
}));
