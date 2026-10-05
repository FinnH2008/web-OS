'use client';

import { useSystemStore } from '@/store/systemStore';
import { useWindowStore } from '@/store/windowStore';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Folder,
  Terminal,
  FileText,
  Settings,
  Calculator,
  Power
} from 'lucide-react';
import WindowComponent from '../window/WindowComponent';
import FileManager from '@/apps/FileManager';
import TerminalApp from '@/apps/TerminalApp';
import TextEditor from '@/apps/TextEditor';
import SettingsApp from '@/apps/SettingsApp';
import CalculatorApp from '@/apps/CalculatorApp';

const apps = [
  { id: 'file-manager', title: 'Files', icon: Folder, color: 'text-blue-400' },
  { id: 'terminal', title: 'Terminal', icon: Terminal, color: 'text-green-400' },
  { id: 'editor', title: 'Notes', icon: FileText, color: 'text-yellow-400' },
  { id: 'calculator', title: 'Calculator', icon: Calculator, color: 'text-orange-400' },
  { id: 'settings', title: 'Settings', icon: Settings, color: 'text-gray-300' },
] as const;

export default function Desktop() {
    const settings = useSystemStore(state => state.settings);
    const setPhase = useSystemStore(state => state.setPhase);
    const { windows, openWindow, activeWindowId } = useWindowStore();

    const handleAppClick = (appId: typeof apps[number]['id'], title: string) => {
        openWindow({ type: appId, title });
    };

    const renderAppContent = (type: string) => {
        switch (type) {
            case 'file-manager': return <FileManager />;
            case 'terminal': return <TerminalApp />;
            case 'editor': return <TextEditor />;
            case 'settings': return <SettingsApp />;
            case 'calculator': return <CalculatorApp />;
            default: return <div className="p-4">App not found</div>;
        }
    };

    return (
        <div
            className="w-full h-full bg-cover bg-center relative overflow-hidden"
            style={{ backgroundImage: `url(${settings.wallpaper})` }}
        >
            {/* Desktop Icons Grid */}
            <div className="absolute inset-0 p-4 grid grid-flow-col auto-rows-max gap-4 z-0 content-start">
                {apps.map((app) => (
                    <div
                        key={`desktop-${app.id}`}
                        className="flex flex-col items-center justify-center w-20 p-2 rounded-xl hover:bg-white/10 cursor-pointer transition-colors group"
                        onDoubleClick={() => handleAppClick(app.id, app.title)}
                    >
                        <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 group-hover:border-white/40 shadow-lg mb-2">
                            <app.icon className={`w-6 h-6 ${app.color}`} />
                        </div>
                        <span className="text-white text-xs text-center drop-shadow-md bg-black/20 px-2 py-0.5 rounded-full">
                            {app.title}
                        </span>
                    </div>
                ))}
            </div>

            {/* Windows */}
            <div className="absolute inset-0 pointer-events-none z-10">
                <AnimatePresence>
                    {windows.map((win) => (
                        <WindowComponent key={win.id} windowData={win}>
                            {renderAppContent(win.type)}
                        </WindowComponent>
                    ))}
                </AnimatePresence>
            </div>

            {/* Dock (Liquid Glass Style) */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50">
                <div className="flex items-center gap-2 p-2 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl">
                    {apps.map((app) => {
                        const isOpen = windows.some(w => w.type === app.id);
                        const isActive = windows.some(w => w.type === app.id && w.id === activeWindowId);

                        return (
                            <div key={`dock-${app.id}`} className="relative group flex flex-col items-center">
                                <motion.button
                                    whileHover={{ scale: 1.15, y: -5 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleAppClick(app.id, app.title)}
                                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${isActive ? 'bg-white/20 border-white/40 shadow-inner' : 'bg-transparent border-transparent hover:bg-white/10'}`}
                                >
                                    <app.icon className={`w-6 h-6 ${app.color}`} />
                                </motion.button>
                                {/* Active Indicator */}
                                {isOpen && (
                                    <div className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-white/80" />
                                )}
                            </div>
                        );
                    })}

                    <div className="w-px h-8 bg-white/20 mx-2" />

                    <motion.button
                        whileHover={{ scale: 1.15, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setPhase('login')}
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-red-400 hover:bg-white/10 transition-colors"
                        title="Log Out"
                    >
                        <Power className="w-6 h-6" />
                    </motion.button>
                </div>
            </div>
        </div>
    )
}
