'use client';

import { useSystemStore } from '@/store/systemStore';
import { useWindowStore } from '@/store/windowStore';
import { useAppStore } from '@/store/appStore';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Wifi, Battery, Search, ChevronUp, Bell, Grid, Settings,
    Folder, Terminal, FileText, Calculator, Activity, Globe, Music, ShoppingBag
} from 'lucide-react';
import ControlCenter from '../menubar/ControlCenter';
import NotificationCenter from '../menubar/NotificationCenter';

const APP_ICONS: Record<string, any> = {
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

export default function Taskbar({ toggleStartMenu }: { toggleStartMenu: () => void }) {
    const { settings } = useSystemStore();
    const { windows, openWindow, activeWindowId, focusWindow, minimizeWindow } = useWindowStore();
    const { installedApps } = useAppStore();

    const [time, setTime] = useState<string>('');
    const [date, setDate] = useState<string>('');
    const [showControlCenter, setShowControlCenter] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setTime(now.toLocaleTimeString(settings.language, { hour: '2-digit', minute: '2-digit' }));
            setDate(now.toLocaleDateString(settings.language, { day: '2-digit', month: '2-digit', year: 'numeric' }));
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, [settings.language]);

    // Define which apps to show in the dock (installed ones)
    const pinnedApps = installedApps.map(id => ({
        id,
        icon: APP_ICONS[id] || Grid,
        color: APP_COLORS[id] || 'text-white'
    }));

    const handleAppClick = (appId: string) => {
        const isOpen = windows.some(w => w.type === appId);
        const isActive = windows.some(w => w.type === appId && w.id === activeWindowId);

        if (isActive) {
            const activeWin = windows.find(w => w.type === appId && w.id === activeWindowId);
            if(activeWin) minimizeWindow(activeWin.id);
        } else if (isOpen) {
            // Focus the first open instance
            const win = windows.find(w => w.type === appId);
            if(win) focusWindow(win.id);
        } else {
            openWindow({ type: appId as any, title: appId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') });
        }
    };

    return (
        <div className="absolute bottom-3 left-3 right-3 h-14 z-[60] flex items-center justify-between px-2 font-sans pointer-events-none">

            {/* Background container to allow pointer events on specific areas */}
            <div className="absolute inset-0 flex justify-center pointer-events-none">
                {/* Center Dock Container */}
                <div className="h-full bg-white/5 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex items-center gap-1.5 px-3 pointer-events-auto">

                    {/* Start Button */}
                    <motion.button
                        whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={toggleStartMenu}
                        className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Grid className="w-5 h-5 text-blue-400 group-hover:text-blue-300 relative z-10 transition-colors" />
                    </motion.button>

                    <div className="w-px h-6 bg-white/10 mx-1" />

                    {/* Apps */}
                    {pinnedApps.map((app) => {
                        const isOpen = windows.some(w => w.type === app.id);
                        const isActive = windows.some(w => w.type === app.id && w.id === activeWindowId);
                        const isMinimized = isOpen && windows.find(w => w.type === app.id)?.isMinimized;

                        return (
                            <div key={`taskbar-${app.id}`} className="relative group flex flex-col items-center">
                                {/* Tooltip */}
                                <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white text-xs px-3 py-1.5 rounded-lg backdrop-blur-md border border-white/10 whitespace-nowrap shadow-xl pointer-events-none z-50">
                                    {app.id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.15, y: -4 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleAppClick(app.id)}
                                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 relative ${
                                        isActive && !isMinimized ? 'bg-white/10 shadow-inner' : 'hover:bg-white/5'
                                    }`}
                                >
                                    <app.icon className={`w-5 h-5 ${app.color} drop-shadow-md relative z-10 transition-transform ${isOpen && !isActive ? 'opacity-80' : ''}`} />
                                </motion.button>

                                {/* Active/Open Indicator (Windows 11 style pill) */}
                                {isOpen && (
                                    <motion.div
                                        layoutId={`indicator-${app.id}`}
                                        className={`absolute bottom-0 h-1 rounded-t-sm transition-all duration-300 ${
                                            isActive && !isMinimized ? 'w-4 bg-blue-400' : 'w-1.5 bg-white/40 group-hover:w-3 group-hover:bg-white/60'
                                        }`}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Right System Tray */}
            <div className="h-full ml-auto bg-black/40 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-xl flex items-center gap-1 px-2 pointer-events-auto text-white/90">
                <motion.button
                    whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                    onClick={() => setShowControlCenter(!showControlCenter)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors"
                >
                    <ChevronUp className="w-3.5 h-3.5 opacity-50" />
                    {settings.wifiEnabled && <Wifi className="w-4 h-4" />}
                    <Battery className="w-4 h-4" />
                </motion.button>

                <motion.button
                    whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="flex flex-col items-end justify-center px-3 py-1.5 rounded-xl transition-colors relative"
                >
                    <div className="text-xs font-medium leading-tight">{time}</div>
                    <div className="text-[10px] opacity-70 leading-tight">{date}</div>
                </motion.button>

                <motion.button
                     whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                     onClick={() => setShowNotifications(!showNotifications)}
                     className="p-2 rounded-xl transition-colors relative"
                >
                    <Bell className="w-4 h-4" />
                </motion.button>
            </div>

            {/* Floating Panels attached to taskbar */}
            {/* Control Center needs to be adjusted to pop UP instead of DOWN now */}
            <div className="absolute bottom-16 right-0 pointer-events-auto">
                <ControlCenter show={showControlCenter} onClose={() => setShowControlCenter(false)} />
            </div>
            <div className="absolute bottom-16 right-0 pointer-events-auto">
                <NotificationCenter show={showNotifications} onClose={() => setShowNotifications(false)} />
            </div>

        </div>
    );
}
