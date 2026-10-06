'use client';

import { useSystemStore } from '@/store/systemStore';
import { useWindowStore, type WindowData } from '@/store/windowStore';
import { useAppStore } from '@/store/appStore';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Wifi, Battery, ChevronUp, Bell, Grid, Settings,
    Folder, Terminal, FileText, Calculator, Activity, Globe, Music, ShoppingBag
} from 'lucide-react';
import ControlCenter from '../menubar/ControlCenter';
import NotificationCenter from '../menubar/NotificationCenter';

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
            openWindow({ type: appId as WindowData['type'], title: appId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') });
        }
    };

    return (
        <>
            {/* The actual taskbar container, spanning full width at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-14 bg-black/30 backdrop-blur-2xl border-t border-white/10 z-[60] flex items-center justify-between px-2 font-sans select-none">

                {/* Left section - Empty or quick launch depending on design, here empty to center dock */}
                <div className="flex-1"></div>

                {/* Center Dock Container */}
                <div className="flex-1 flex justify-center items-center h-full">
                    <div className="flex items-center gap-1.5 h-12 px-2 bg-white/5 border border-white/10 rounded-2xl shadow-lg">
                        {/* Start Button */}
                        <motion.button
                            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
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
                                    <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white text-xs px-3 py-1.5 rounded-lg backdrop-blur-md border border-white/10 whitespace-nowrap shadow-xl pointer-events-none z-[100]">
                                        {app.id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.15, y: -2 }}
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

                {/* Right System Tray Container */}
                <div className="flex-1 flex justify-end items-center h-full">
                    <div className="flex items-center gap-1 px-2 h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors text-white/90">
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => { setShowControlCenter(!showControlCenter); setShowNotifications(false); }}
                            className="flex items-center gap-2 px-2 h-full rounded-lg transition-colors"
                        >
                            <ChevronUp className="w-3 h-3 opacity-50" />
                            {settings.wifiEnabled && <Wifi className="w-3.5 h-3.5" />}
                            <Battery className="w-3.5 h-3.5" />
                        </motion.button>

                        <div className="w-px h-4 bg-white/20 mx-1" />

                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => { setShowNotifications(!showNotifications); setShowControlCenter(false); }}
                            className="flex items-center gap-3 px-2 h-full rounded-lg transition-colors"
                        >
                            <div className="flex flex-col items-end justify-center">
                                <div className="text-[11px] font-medium leading-tight">{time}</div>
                                <div className="text-[9px] opacity-70 leading-tight">{date}</div>
                            </div>
                            <Bell className="w-3.5 h-3.5 opacity-80" />
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Floating Panels attached to taskbar - rendered outside taskbar div to prevent clipping */}
            <div className="absolute bottom-16 right-2 z-[70]">
                <ControlCenter show={showControlCenter} onClose={() => setShowControlCenter(false)} />
            </div>
            <div className="absolute bottom-16 right-2 z-[70]">
                <NotificationCenter show={showNotifications} onClose={() => setShowNotifications(false)} />
            </div>
        </>
    );
}
