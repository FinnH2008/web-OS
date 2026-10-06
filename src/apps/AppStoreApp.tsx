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
