'use client';

import { useSystemStore } from '@/store/systemStore';
import { useWindowStore, type WindowData } from '@/store/windowStore';
import { useAppStore } from '@/store/appStore';
import { AnimatePresence } from 'framer-motion';
import {
  Folder,
  Terminal,
  FileText,
  Settings,
  Calculator,
  RefreshCw,
  Plus,
  Info,
  Activity,
  Globe,
  Music,
  ShoppingBag
} from 'lucide-react';
import WindowComponent from '../window/WindowComponent';
import FileManager from '@/apps/FileManager';
import TerminalApp from '@/apps/TerminalApp';
import TextEditor from '@/apps/TextEditor';
import SettingsApp from '@/apps/SettingsApp';
import CalculatorApp from '@/apps/CalculatorApp';
import SystemMonitorApp from '@/apps/SystemMonitorApp';
import BrowserApp from '@/apps/BrowserApp';
import MediaPlayerApp from '@/apps/MediaPlayerApp';
import AppStoreApp from '@/apps/AppStoreApp';
import NotificationToast from '../ui/NotificationToast';
import DesktopIcon from './DesktopIcon';
import Taskbar from './taskbar/Taskbar';
import StartMenu from './startmenu/StartMenu';
import { useContextMenu } from '@/hooks/useContextMenu';
import ContextMenu from '../ui/ContextMenu';
import { useEffect, useMemo, useState } from 'react';

const ALL_APPS = [
  { id: 'file-manager', title: 'Files', icon: Folder, color: 'text-blue-400' },
  { id: 'browser', title: 'Browser', icon: Globe, color: 'text-blue-300' },
  { id: 'terminal', title: 'Terminal', icon: Terminal, color: 'text-green-400' },
  { id: 'editor', title: 'Notes', icon: FileText, color: 'text-yellow-400' },
  { id: 'calculator', title: 'Calculator', icon: Calculator, color: 'text-orange-400' },
  { id: 'monitor', title: 'Activity', icon: Activity, color: 'text-red-400' },
  { id: 'media-player', title: 'Media', icon: Music, color: 'text-purple-400' },
  { id: 'app-store', title: 'Store', icon: ShoppingBag, color: 'text-pink-400' },
  { id: 'settings', title: 'Settings', icon: Settings, color: 'text-gray-300' },
] as const;

export default function Desktop() {
    const settings = useSystemStore(state => state.settings);
    const { windows, openWindow, activeWindowId, focusWindow, closeWindow } = useWindowStore();
    const { installedApps } = useAppStore();

    const { clicked, setClicked, points, handleContextMenu } = useContextMenu();
    const [startMenuOpen, setStartMenuOpen] = useState(false);

    const activeApps = useMemo(() => {
        return ALL_APPS.filter(app => installedApps.includes(app.id));
    }, [installedApps]);

    const handleAppClick = (appId: string, title: string) => {
        openWindow({ type: appId as WindowData['type'], title });
    };

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'w') {
                e.preventDefault();
                if (activeWindowId) {
                    closeWindow(activeWindowId);
                }
            }
            if (e.key === 'Meta') { // Windows/Command key toggles start menu
                 setStartMenuOpen(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeWindowId, closeWindow]);

    const renderAppContent = (type: string) => {
        switch (type) {
            case 'file-manager': return <FileManager />;
            case 'browser': return <BrowserApp />;
            case 'terminal': return <TerminalApp />;
            case 'editor': return <TextEditor />;
            case 'settings': return <SettingsApp />;
            case 'calculator': return <CalculatorApp />;
            case 'monitor': return <SystemMonitorApp />;
            case 'media-player': return <MediaPlayerApp />;
            case 'app-store': return <AppStoreApp />;
            default: return <div className="p-4">App not found</div>;
        }
    };

    const desktopContextMenuItems = [
        { label: 'New Folder', action: () => handleAppClick('file-manager', 'Files'), icon: <Plus size={14}/> },
        { divider: true, action: ()=>{}, label: '' },
        { label: 'DexStore', action: () => handleAppClick('app-store', 'Store'), icon: <ShoppingBag size={14}/> },
        { label: 'System Monitor', action: () => handleAppClick('monitor', 'Activity'), icon: <Activity size={14}/> },
        { label: 'Change Wallpaper', action: () => handleAppClick('settings', 'Settings'), icon: <Settings size={14}/> },
        { label: 'Refresh', action: () => window.location.reload(), icon: <RefreshCw size={14}/> },
        { divider: true, action: ()=>{}, label: '' },
        { label: 'About DexTop', action: () => alert('Virtual DexTop OS v1.0\nHybrid Architecture Edition.'), icon: <Info size={14}/> },
    ];

    return (
        <div
            className="w-full h-full bg-cover bg-center relative overflow-hidden flex flex-col"
            style={{ backgroundImage: `url(${settings.wallpaper})` }}
            onContextMenu={(e) => handleContextMenu(e, 'desktop')}
        >
            <NotificationToast />

            <div
                className="flex-1 relative" // No padding bottom so windows can maximize properly (Rnd handles calc)
                onClick={() => { focusWindow('desktop-background'); setStartMenuOpen(false); }}
            >
                {/* Desktop Icons Draggable */}
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-auto">
                    {activeApps.map((app, index) => (
                        <DesktopIcon
                            key={`desktop-${app.id}`}
                            app={app}
                            index={index}
                            onDoubleClick={() => handleAppClick(app.id, app.title)}
                        />
                    ))}
                </div>

                {/* Windows Layer */}
                <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
                    <AnimatePresence>
                        {windows.map((win) => (
                            <WindowComponent key={win.id} windowData={win}>
                                {renderAppContent(win.type)}
                            </WindowComponent>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Overlays Layer */}
            <div className="absolute inset-0 pointer-events-none z-50">
                <StartMenu show={startMenuOpen} onClose={() => setStartMenuOpen(false)} />
            </div>

            {/* Taskbar Layer */}
            <Taskbar toggleStartMenu={() => setStartMenuOpen(!startMenuOpen)} />

            <ContextMenu
                show={clicked}
                x={points.x}
                y={points.y}
                items={desktopContextMenuItems}
                onClose={() => setClicked(false)}
            />
        </div>
    )
}
