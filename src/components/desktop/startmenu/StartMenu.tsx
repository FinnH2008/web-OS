'use client';

import { useSystemStore } from '@/store/systemStore';
import { useWindowStore, type WindowData } from '@/store/windowStore';
import { useAppStore } from '@/store/appStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Search, Folder, Terminal, FileText, Calculator, Activity, Globe, Music, ShoppingBag, Settings, Power } from 'lucide-react';

const APP_ICONS: Record<string, React.ElementType> = {
    'file-manager': Folder,
    'browser': Globe,
    'terminal': Terminal,
    'editor': FileText,
    'calculator': Calculator,
    'monitor': Activity,
    'media-player': Music,
    'app-store': ShoppingBag,
    'settings': Settings,
};

const APP_COLORS: Record<string, string> = {
    'file-manager': 'text-blue-400',
    'browser': 'text-blue-300',
    'terminal': 'text-green-400',
    'editor': 'text-yellow-400',
    'calculator': 'text-orange-400',
    'monitor': 'text-red-400',
    'media-player': 'text-purple-400',
    'app-store': 'text-pink-400',
    'settings': 'text-gray-300',
};

export default function StartMenu({ show, onClose }: { show: boolean, onClose: () => void }) {
    const { user, lockSystem } = useSystemStore();
    const { openWindow } = useWindowStore();
    const { installedApps } = useAppStore();
    const [search, setSearch] = useState('');

    const handleAppClick = (appId: string) => {
        openWindow({ type: appId as WindowData['type'], title: appId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') });
        onClose();
        setSearch('');
    };

    const filteredApps = installedApps.filter(id => id.toLowerCase().includes(search.toLowerCase()));

    return (
        <AnimatePresence>
            {show && (
                <>
                    {/* Invisible overlay to close on click outside */}
                    <div className="fixed inset-0 z-[45]" onClick={onClose} />

                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed bottom-20 left-1/2 -translate-x-1/2 w-[600px] h-[650px] bg-black/50 backdrop-blur-3xl border border-white/20 rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.6)] z-[50] flex flex-col overflow-hidden font-sans"
                    >
                        {/* Search Bar */}
                        <div className="p-6 pb-2">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Type here to search"
                                    className="w-full bg-white/10 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/20 transition-all text-lg"
                                    autoFocus
                                />
                            </div>
                        </div>

                        {/* Pinned/All Apps */}
                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-white/90 font-semibold px-2">Pinned</h3>
                                <button className="text-white/50 text-sm hover:text-white transition-colors px-2 rounded hover:bg-white/5">
                                    All apps {'>'}
                                </button>
                            </div>

                            <div className="grid grid-cols-6 gap-x-2 gap-y-6">
                                {filteredApps.map(id => {
                                    const Icon = APP_ICONS[id];
                                    const color = APP_COLORS[id];
                                    const title = id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

                                    return (
                                        <button
                                            key={id}
                                            onClick={() => handleAppClick(id)}
                                            className="flex flex-col items-center gap-2 p-2 rounded-xl hover:bg-white/10 transition-colors group"
                                        >
                                            <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow group-hover:scale-105 transform duration-200">
                                                {Icon && <Icon className={`w-7 h-7 ${color} drop-shadow-md`} />}
                                            </div>
                                            <span className="text-xs text-white/80 group-hover:text-white truncate w-full text-center">
                                                {title}
                                            </span>
                                        </button>
                                    )
                                })}
                            </div>

                            {/* Recommended / Recent Files placeholder */}
                            <div className="mt-10">
                                <h3 className="text-white/90 font-semibold px-2 mb-4">Recommended</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {/* Mock items */}
                                    <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                                        <FileText className="w-8 h-8 text-blue-300" />
                                        <div>
                                            <div className="text-sm text-white/90">Getting Started.md</div>
                                            <div className="text-xs text-white/40">1h ago</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* User Profile Footer */}
                        <div className="h-16 bg-black/40 border-t border-white/10 flex items-center justify-between px-6">
                            <div className="flex items-center gap-3 hover:bg-white/5 p-2 rounded-xl cursor-pointer transition-colors">
                                {user?.avatar ? (
                                    <img src={user.avatar} alt="" className="w-8 h-8 rounded-full" />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold text-white">
                                        {user?.username?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                )}
                                <span className="text-sm font-medium text-white/90">{user?.username}</span>
                            </div>

                            <button
                                onClick={() => lockSystem()}
                                className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-red-400 transition-colors"
                                title="Power off / Log out"
                            >
                                <Power className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
