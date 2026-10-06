'use client';

import { useNotificationStore } from '@/store/notificationStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Trash2, X } from 'lucide-react';

export default function NotificationCenter({ show, onClose }: { show: boolean, onClose: () => void }) {
    const { notifications, removeNotification, clearAll } = useNotificationStore();

    return (
        <AnimatePresence>
            {show && (
                <>
                    <div className="fixed inset-0 z-40" onClick={onClose} />
                    <motion.div
                        initial={{ opacity: 0, x: 300 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 300 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="absolute top-8 right-0 bottom-0 w-80 bg-black/60 backdrop-blur-3xl border-l border-white/20 shadow-2xl z-50 flex flex-col font-sans"
                    >
                        <div className="p-4 border-b border-white/10 flex items-center justify-between">
                            <h2 className="text-white font-medium flex items-center gap-2">
                                <Bell className="w-4 h-4" /> Notifications
                            </h2>
                            <div className="flex items-center gap-2">
                                {notifications.length > 0 && (
                                    <button
                                        onClick={clearAll}
                                        className="text-white/50 hover:text-white transition-colors"
                                        title="Clear All"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {notifications.length === 0 ? (
                                <div className="text-center text-white/40 mt-10">
                                    No new notifications
                                </div>
                            ) : (
                                notifications.map(notif => (
                                    <div key={notif.id} className="bg-white/5 border border-white/10 rounded-xl p-4 relative group">
                                        <button
                                            onClick={() => removeNotification(notif.id)}
                                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-white/50 hover:text-white transition-all"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                        <h3 className="font-semibold text-white/90 text-sm mb-1">{notif.title}</h3>
                                        <p className="text-white/60 text-xs leading-relaxed">{notif.message}</p>
                                        <div className="text-white/30 text-[10px] mt-2">
                                            {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
