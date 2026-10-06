#!/bin/bash
mkdir -p src/apps
cat << 'APP_EOF' > src/apps/SystemMonitorApp.tsx
'use client';

import { useState, useEffect } from 'react';
import { useWindowStore } from '@/store/windowStore';
import { Activity, Cpu, HardDrive } from 'lucide-react';

export default function SystemMonitorApp() {
    const { windows } = useWindowStore();
    const [cpuUsage, setCpuUsage] = useState(0);
    const [ramUsage, setRamUsage] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCpuUsage(() => {
                const base = windows.length * 5;
                const jitter = Math.random() * 10 - 5;
                return Math.min(100, Math.max(0, Math.round(base + jitter)));
            });
            setRamUsage(() => {
                const base = windows.length * 150 + 1024;
                const jitter = Math.random() * 50 - 25;
                return Math.round(base + jitter);
            });
        }, 1500);
        return () => clearInterval(interval);
    }, [windows.length]);

    return (
        <div className="h-full flex flex-col bg-black/40 text-white p-4 overflow-y-auto">
            <h2 className="text-lg font-medium mb-4 flex items-center gap-2 border-b border-white/10 pb-2">
                <Activity className="w-5 h-5 text-blue-400" /> Activity Monitor
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-white/60 text-sm">
                        <Cpu className="w-4 h-4" /> CPU Load
                    </div>
                    <div className="text-3xl font-light">{cpuUsage}%</div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-1">
                        <div
                            className={`h-full transition-all duration-1000 ${cpuUsage > 80 ? 'bg-red-500' : cpuUsage > 50 ? 'bg-yellow-500' : 'bg-green-500'}`}
                            style={{ width: `${cpuUsage}%` }}
                        />
                    </div>
                </div>

                <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-white/60 text-sm">
                        <HardDrive className="w-4 h-4" /> RAM Usage
                    </div>
                    <div className="text-3xl font-light">{(ramUsage / 1024).toFixed(1)} GB</div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-1">
                        <div
                            className="h-full bg-blue-500 transition-all duration-1000"
                            style={{ width: `${(ramUsage / 8192) * 100}%` }}
                        />
                    </div>
                    <div className="text-xs text-white/40 mt-1">out of 8.0 GB</div>
                </div>
            </div>

            <h3 className="text-sm font-medium text-white/60 mb-2 uppercase tracking-wider">Active Processes</h3>
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden text-sm">
                <div className="grid grid-cols-12 gap-2 p-2 border-b border-white/10 bg-white/5 font-medium text-white/80">
                    <div className="col-span-6">Process Name</div>
                    <div className="col-span-3 text-right">CPU</div>
                    <div className="col-span-3 text-right">Memory</div>
                </div>
                <div className="divide-y divide-white/5">
                    <div className="grid grid-cols-12 gap-2 p-2 hover:bg-white/5 transition-colors">
                        <div className="col-span-6 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-400" /> Virtual DexTop Core
                        </div>
                        <div className="col-span-3 text-right text-white/60">{(cpuUsage * 0.4).toFixed(1)}%</div>
                        <div className="col-span-3 text-right text-white/60">1.2 GB</div>
                    </div>
                    {windows.map(win => (
                        <div key={win.id} className="grid grid-cols-12 gap-2 p-2 hover:bg-white/5 transition-colors">
                            <div className="col-span-6 flex items-center gap-2 truncate">
                                <div className="w-2 h-2 rounded-full bg-green-400" /> {win.title} ({win.type})
                            </div>
                            <div className="col-span-3 text-right text-white/60">{(cpuUsage / (windows.length || 1) * 0.5).toFixed(1)}%</div>
                            <div className="col-span-3 text-right text-white/60">~150 MB</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
APP_EOF

cat << 'APP_EOF' > src/apps/BrowserApp.tsx
'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Home, Search } from 'lucide-react';

export default function BrowserApp() {
    const [url, setUrl] = useState('https://www.wikipedia.org');
    const [input, setInput] = useState('https://www.wikipedia.org');
    const [loading, setLoading] = useState(true);

    const handleNavigate = (e: React.FormEvent) => {
        e.preventDefault();
        let target = input.trim();
        if (!target.startsWith('http://') && !target.startsWith('https://')) {
            target = `https://${target}`;
        }
        setUrl(target);
        setInput(target);
        setLoading(true);
    };

    return (
        <div className="flex flex-col h-full bg-white text-black">
            <div className="flex flex-col border-b border-gray-300 bg-gray-100">
                <div className="flex items-end px-2 pt-2 gap-1 h-8">
                    <div className="bg-white px-4 py-1 rounded-t-lg border-t border-l border-r border-gray-300 text-xs flex items-center gap-2 max-w-[200px]">
                        <span className="truncate">{url}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 p-2 bg-white border-t border-gray-200">
                    <button className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600 transition-colors disabled:opacity-50">
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600 transition-colors disabled:opacity-50" disabled>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                        className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600 transition-colors"
                        onClick={() => setLoading(true)}
                    >
                        <RotateCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                        className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600 transition-colors"
                        onClick={() => { setUrl('https://www.wikipedia.org'); setInput('https://www.wikipedia.org'); }}
                    >
                        <Home className="w-4 h-4" />
                    </button>

                    <form onSubmit={handleNavigate} className="flex-1 flex items-center relative">
                        <div className="absolute left-3 text-gray-400">
                            <Search className="w-3.5 h-3.5" />
                        </div>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="w-full bg-gray-100 border border-gray-300 rounded-full pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                            placeholder="Search or enter web address"
                        />
                    </form>
                </div>
            </div>

            <div className="flex-1 bg-white relative">
                <iframe
                    src={url}
                    className="w-full h-full border-none"
                    onLoad={() => setLoading(false)}
                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                    title="Browser Viewport"
                />
            </div>
        </div>
    );
}
APP_EOF

cat << 'APP_EOF' > src/apps/MediaPlayerApp.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Music, ListMusic } from 'lucide-react';

const playlist = [
    { id: 1, title: 'Lo-Fi Chill Beats', artist: 'Creator One', duration: '3:45', url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3' },
    { id: 2, title: 'Synthwave Night Drive', artist: 'Neon Rider', duration: '4:12', url: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=synthwave-80s-116645.mp3' },
    { id: 3, title: 'Ambient Space', artist: 'Void', duration: '5:30', url: 'https://cdn.pixabay.com/download/audio/2022/12/28/audio_65cb1fb2a1.mp3?filename=ambient-space-129665.mp3' }
];

export default function MediaPlayerApp() {
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const audioRef = useRef<HTMLAudioElement>(null);

    const track = playlist[currentTrackIndex];

    useEffect(() => {
        if (isPlaying) {
            audioRef.current?.play().catch(e => console.error("Audio play failed:", e));
        } else {
            audioRef.current?.pause();
        }
    }, [isPlaying, currentTrackIndex]);

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            const current = audioRef.current.currentTime;
            const duration = audioRef.current.duration;
            if (duration) {
                setProgress((current / duration) * 100);
            }
        }
    };

    const handleNext = () => {
        setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
        setIsPlaying(true);
    };

    const handlePrev = () => {
        setCurrentTrackIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
        setIsPlaying(true);
    };

    const handleEnded = () => {
        handleNext();
    };

    return (
        <div className="h-full flex flex-col bg-black/40 text-white font-sans">
            <audio
                ref={audioRef}
                src={track.url}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleEnded}
            />

            <div className="p-6 bg-gradient-to-b from-white/10 to-transparent border-b border-white/10 flex items-center gap-6">
                <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl">
                    <Music className="w-10 h-10 text-white/50" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-white/90">{track.title}</h2>
                    <p className="text-white/60 text-lg">{track.artist}</p>
                </div>
            </div>

            <div className="p-6 border-b border-white/10">
                <div className="w-full h-1.5 bg-white/10 rounded-full mb-6 overflow-hidden cursor-pointer">
                    <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className="flex items-center justify-center gap-8">
                    <button onClick={handlePrev} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white">
                        <SkipBack className="w-6 h-6 fill-current" />
                    </button>
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-xl"
                    >
                        {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
                    </button>
                    <button onClick={handleNext} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white">
                        <SkipForward className="w-6 h-6 fill-current" />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                <h3 className="text-sm font-medium text-white/50 mb-4 uppercase tracking-wider flex items-center gap-2">
                    <ListMusic className="w-4 h-4" /> Up Next
                </h3>
                <div className="space-y-1">
                    {playlist.map((t, idx) => (
                        <div
                            key={t.id}
                            onClick={() => { setCurrentTrackIndex(idx); setIsPlaying(true); }}
                            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                                idx === currentTrackIndex ? 'bg-white/10 border border-white/10' : 'hover:bg-white/5 border border-transparent'
                            }`}
                        >
                            <div className="flex items-center gap-4">
                                <span className="text-white/30 text-sm font-mono w-4 text-center">{idx + 1}</span>
                                <div>
                                    <div className={`font-medium ${idx === currentTrackIndex ? 'text-blue-400' : 'text-white/90'}`}>{t.title}</div>
                                    <div className="text-xs text-white/50">{t.artist}</div>
                                </div>
                            </div>
                            <div className="text-sm text-white/50">{t.duration}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
APP_EOF

cat << 'APP_EOF' > src/apps/AppStoreApp.tsx
'use client';

import { useAppStore } from '@/store/appStore';
import { Download, Check, Trash2, ShoppingBag } from 'lucide-react';
import { useNotificationStore } from "@/store/notificationStore";

const availableApps = [
    { id: 'media-player', title: 'Media Player', description: 'Play your favorite audio and video files.', icon: '🎵', category: 'Entertainment', size: '12 MB' },
];

export default function AppStoreApp() {
    const { installedApps, installApp, uninstallApp } = useAppStore();

    return (
        <div className="h-full flex flex-col bg-black/40 text-white font-sans overflow-y-auto">
            <div className="p-8 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-b border-white/10 flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
                        <ShoppingBag className="w-8 h-8 text-blue-400" /> DexStore
                    </h2>
                    <p className="text-white/60">Discover and install applications for your Virtual DexTop.</p>
                </div>
            </div>

            <div className="p-6">
                <h3 className="text-lg font-medium mb-6">Available Applications</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availableApps.map(app => {
                        const isInstalled = installedApps.includes(app.id);

                        return (
                            <div key={app.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex gap-4 hover:bg-white/10 transition-colors group relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

                                <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center text-3xl shadow-inner border border-white/5">
                                    {app.icon}
                                </div>

                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-semibold text-lg text-white/90">{app.title}</h4>
                                            <div className="text-xs text-blue-300 mb-2">{app.category} • {app.size}</div>
                                        </div>
                                    </div>
                                    <p className="text-sm text-white/60 mb-4 line-clamp-2">{app.description}</p>

                                    {isInstalled ? (
                                        <div className="flex gap-2">
                                            <button className="flex-1 py-1.5 px-3 bg-white/10 text-white/60 rounded-lg text-sm font-medium flex items-center justify-center gap-2 cursor-default border border-white/5">
                                                <Check className="w-4 h-4" /> Installed
                                            </button>
                                            <button
                                                onClick={() => uninstallApp(app.id)}
                                                className="py-1.5 px-3 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-lg text-sm font-medium transition-colors border border-red-500/20"
                                                title="Uninstall"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => { installApp(app.id); useNotificationStore.getState().addNotification("App Installed", `${app.title} has been installed successfully.`); }}
                                            className="w-full py-1.5 px-3 bg-blue-500 hover:bg-blue-400 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors shadow-lg"
                                        >
                                            <Download className="w-4 h-4" /> Install
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
APP_EOF
