'use client';

import { useEffect, useState, useRef } from 'react';
import { useNotificationStore } from '@/store/notificationStore';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell } from 'lucide-react';

export default function NotificationToast() {
    const { notifications } = useNotificationStore();
    const [visibleNotifications, setVisibleNotifications] = useState<string[]>([]);
    const lastProcessedIdRef = useRef<string | null>(null);

    // Derived state / direct sync instead of effect calling setState for layout changes
    // But since we want to trigger timeouts, we can use a ref to track what we've seen
    // and queue the update in the next tick to avoid synchronous React warnings.

    useEffect(() => {
        if (notifications.length > 0) {
            const latestNotif = notifications[0];
            if (latestNotif.id !== lastProcessedIdRef.current) {
                lastProcessedIdRef.current = latestNotif.id;

                // Use setTimeout to avoid synchronous setState inside useEffect warning
                setTimeout(() => {
                    setVisibleNotifications(prev => {
                        if (prev.includes(latestNotif.id)) return prev;
                        return [latestNotif.id, ...prev].slice(0, 3);
                    });

                    setTimeout(() => {
                        setVisibleNotifications(prev => prev.filter(id => id !== latestNotif.id));
                    }, 5000);
                }, 0);
            }
        }
    }, [notifications]);

    return (
        <div className="fixed top-12 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
            <AnimatePresence>
                {visibleNotifications.map(id => {
                    const notif = notifications.find(n => n.id === id);
                    if (!notif) return null;

                    return (
                        <motion.div
                            key={id}
                            initial={{ opacity: 0, x: 50, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 50, scale: 0.95 }}
                            className="w-80 bg-black/80 backdrop-blur-2xl border border-white/20 rounded-2xl p-4 shadow-2xl pointer-events-auto relative"
                        >
                            <button
                                onClick={() => setVisibleNotifications(prev => prev.filter(vid => vid !== id))}
                                className="absolute top-3 right-3 text-white/50 hover:text-white transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                            <div className="flex gap-3">
                                <div className="mt-0.5">
                                    <Bell className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <div className="font-semibold text-white/90 text-sm mb-1">{notif.title}</div>
                                    <div className="text-white/70 text-xs leading-relaxed">{notif.message}</div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
}
