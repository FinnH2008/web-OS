'use client';

import { useSystemStore } from '@/store/systemStore';
import { useWindowStore } from '@/store/windowStore';
import { useState, useEffect } from 'react';
import { Wifi, Battery, Search, SlidersHorizontal } from 'lucide-react';
import ControlCenter from './ControlCenter';
import NotificationCenter from './NotificationCenter';

export default function TopMenuBar() {
    const { user, settings, setPhase } = useSystemStore();
    const { activeWindowId, windows } = useWindowStore();

    const [time, setTime] = useState<string>('');
    const [showControlCenter, setShowControlCenter] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setTime(now.toLocaleTimeString(settings.language, { hour: '2-digit', minute: '2-digit' }));
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, [settings.language]);

    const activeWindow = windows.find(w => w.id === activeWindowId);
    const activeAppTitle = activeWindow ? activeWindow.title : 'Virtual DexTop';

    return (
        <div className="h-8 w-full bg-black/20 backdrop-blur-3xl border-b border-white/10 flex items-center justify-between px-4 text-xs font-medium text-white/90 shadow-sm z-50 relative select-none">

            {/* Left side - Contextual App Menu */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 pr-4 border-r border-white/20">
                    <span className="font-bold tracking-wide">{activeAppTitle}</span>
                </div>
                {activeWindow && (
                    <div className="flex gap-4">
                        <span className="hover:text-white cursor-pointer transition-colors opacity-80 hover:opacity-100">File</span>
                        <span className="hover:text-white cursor-pointer transition-colors opacity-80 hover:opacity-100">Edit</span>
                        <span className="hover:text-white cursor-pointer transition-colors opacity-80 hover:opacity-100">View</span>
                        <span className="hover:text-white cursor-pointer transition-colors opacity-80 hover:opacity-100">Help</span>
                    </div>
                )}
            </div>

            {/* Right side - System Tray */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 opacity-80">
                    <Search className="w-3.5 h-3.5 hover:text-white cursor-pointer transition-colors" />

                    <button onClick={() => { setShowControlCenter(!showControlCenter); setShowNotifications(false); }} className="hover:text-white transition-colors relative flex items-center gap-2">
                        {settings.wifiEnabled && <Wifi className="w-3.5 h-3.5" />}
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-1">
                        <Battery className="w-4 h-4" />
                        <span>100%</span>
                    </div>
                </div>

                <div
                    className="flex items-center gap-2 pl-4 border-l border-white/20 cursor-pointer hover:text-white transition-colors"
                    onClick={() => { setShowNotifications(!showNotifications); setShowControlCenter(false); }}
                >
                    <span>{time}</span>
                </div>

                <div
                    className="flex items-center gap-2 pl-4 border-l border-white/20 cursor-pointer group relative"
                    onClick={() => setPhase('login')}
                    title="Log Out"
                >
                    <span className="truncate max-w-[100px]">{user?.username}</span>
                    {user?.avatar && (
                        <img src={user.avatar} alt="User" className="w-5 h-5 rounded-full bg-white/20" />
                    )}
                </div>
            </div>

            <ControlCenter show={showControlCenter} onClose={() => setShowControlCenter(false)} />
            <NotificationCenter show={showNotifications} onClose={() => setShowNotifications(false)} />
        </div>
    );
}
