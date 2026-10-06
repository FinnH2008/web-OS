'use client';

import { useSystemStore } from '@/store/systemStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, Bluetooth, Sun, Volume2, Settings } from 'lucide-react';
import { useWindowStore } from '@/store/windowStore';

export default function ControlCenter({ show, onClose }: { show: boolean, onClose: () => void }) {
    const { settings, setSettings } = useSystemStore();
    const { openWindow } = useWindowStore();

    const handleOpenSettings = () => {
        openWindow({ type: 'settings', title: 'Settings' });
        onClose();
    };

    return (
        <AnimatePresence>
            {show && (
                <>
                    <div className="fixed inset-0 z-40" onClick={onClose} />
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-10 right-2 w-80 bg-black/60 backdrop-blur-3xl border border-white/20 rounded-3xl shadow-2xl p-4 z-50 text-white font-sans"
                    >
                        {/* Quick Toggles */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <button
                                onClick={() => setSettings({ wifiEnabled: !settings.wifiEnabled })}
                                className={`p-4 rounded-2xl flex flex-col items-start gap-2 transition-all ${settings.wifiEnabled ? 'bg-blue-500' : 'bg-white/10 hover:bg-white/20'}`}
                            >
                                <Wifi className={`w-5 h-5 ${settings.wifiEnabled ? 'text-white' : 'text-white/60'}`} />
                                <div className="text-left">
                                    <div className="font-medium text-sm">Wi-Fi</div>
                                    <div className={`text-xs ${settings.wifiEnabled ? 'text-white/80' : 'text-white/40'}`}>
                                        {settings.wifiEnabled ? 'DexNet' : 'Off'}
                                    </div>
                                </div>
                            </button>
                            <button
                                onClick={() => setSettings({ bluetoothEnabled: !settings.bluetoothEnabled })}
                                className={`p-4 rounded-2xl flex flex-col items-start gap-2 transition-all ${settings.bluetoothEnabled ? 'bg-blue-500' : 'bg-white/10 hover:bg-white/20'}`}
                            >
                                <Bluetooth className={`w-5 h-5 ${settings.bluetoothEnabled ? 'text-white' : 'text-white/60'}`} />
                                <div className="text-left">
                                    <div className="font-medium text-sm">Bluetooth</div>
                                    <div className={`text-xs ${settings.bluetoothEnabled ? 'text-white/80' : 'text-white/40'}`}>
                                        {settings.bluetoothEnabled ? 'On' : 'Off'}
                                    </div>
                                </div>
                            </button>
                        </div>

                        {/* Sliders */}
                        <div className="space-y-4 bg-white/5 rounded-2xl p-4 border border-white/5 mb-4">
                            <div className="flex items-center gap-3">
                                <Sun className="w-5 h-5 text-white/60" />
                                <input
                                    type="range"
                                    min="10" max="100"
                                    value={settings.brightness}
                                    onChange={(e) => setSettings({ brightness: parseInt(e.target.value) })}
                                    className="flex-1 accent-white h-1.5 bg-white/20 rounded-full appearance-none outline-none"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <Volume2 className="w-5 h-5 text-white/60" />
                                <input
                                    type="range"
                                    min="0" max="100"
                                    value={settings.volume}
                                    onChange={(e) => setSettings({ volume: parseInt(e.target.value) })}
                                    className="flex-1 accent-white h-1.5 bg-white/20 rounded-full appearance-none outline-none"
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end">
                            <button
                                onClick={handleOpenSettings}
                                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                            >
                                <Settings className="w-4 h-4 text-white/80" />
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
