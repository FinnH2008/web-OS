'use client';

import { useNotificationStore } from "@/store/notificationStore";
import { useSystemStore } from '@/store/systemStore';
import { Palette, Image as ImageIcon, Wifi, Bluetooth, User, Shield, Monitor, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';

const wallpapers = [
    '/wallpapers/default.jpg',
    'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop'
];

const colors = [
    { name: 'blue', value: 'bg-blue-500' },
    { name: 'purple', value: 'bg-purple-500' },
    { name: 'green', value: 'bg-green-500' },
    { name: 'orange', value: 'bg-orange-500' },
    { name: 'pink', value: 'bg-pink-500' },
];

export default function SettingsApp() {
    const { settings, setSettings, user, setUser } = useSystemStore();
    const [activeTab, setActiveTab] = useState('personalization');

    // User state
    const [username, setUsernameInput] = useState(user?.username || '');
    const [password, setPasswordInput] = useState('');

    const handleSaveUser = () => {
        if (username.trim()) {
            setUser({ username: username.trim(), password: password || undefined });
            useNotificationStore.getState().addNotification('Account Updated', 'Your account settings have been saved successfully.'); // Replace with toast later
        }
    };

    const tabs = [
        { id: 'network', label: 'Network & Bluetooth', icon: Wifi },
        { id: 'personalization', label: 'Personalization', icon: Palette },
        { id: 'account', label: 'Account', icon: User },
        { id: 'system', label: 'System', icon: Monitor },
    ];

    return (
        <div className="h-full flex bg-black/40 text-white font-sans">
            {/* Sidebar */}
            <div className="w-64 bg-black/20 border-r border-white/10 p-4 space-y-1">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
                            activeTab === tab.id ? 'bg-white/10 text-white shadow-sm' : 'text-white/60 hover:bg-white/5 hover:text-white'
                        }`}
                    >
                        <tab.icon className="w-5 h-5" />
                        <span className="font-medium text-sm">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-2xl">

                    {activeTab === 'network' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-2xl font-semibold tracking-tight">Network & Bluetooth</h2>

                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-full ${settings.wifiEnabled ? 'bg-blue-500/20 text-blue-400' : 'bg-white/10 text-white/50'}`}>
                                            <Wifi className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-lg">Wi-Fi</h3>
                                            <p className="text-sm text-white/50">{settings.wifiEnabled ? 'Connected to DexNet_5G' : 'Disconnected'}</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" checked={settings.wifiEnabled} onChange={(e) => setSettings({ wifiEnabled: e.target.checked })} className="sr-only peer" />
                                        <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                                    </label>
                                </div>

                                <div className="h-px bg-white/10 w-full" />

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-full ${settings.bluetoothEnabled ? 'bg-blue-500/20 text-blue-400' : 'bg-white/10 text-white/50'}`}>
                                            <Bluetooth className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-lg">Bluetooth</h3>
                                            <p className="text-sm text-white/50">{settings.bluetoothEnabled ? 'Discoverable as "DexTop-Client"' : 'Off'}</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" checked={settings.bluetoothEnabled} onChange={(e) => setSettings({ bluetoothEnabled: e.target.checked })} className="sr-only peer" />
                                        <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'personalization' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-2xl font-semibold tracking-tight">Personalization</h2>

                            <div className="space-y-4">
                                <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider flex items-center gap-2">
                                    <ImageIcon className="w-4 h-4" /> Wallpaper
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {wallpapers.map((wp, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => setSettings({ wallpaper: wp })}
                                            className={`relative aspect-video rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                                                settings.wallpaper === wp ? 'border-blue-500 scale-[1.02] shadow-xl shadow-blue-500/20' : 'border-transparent hover:border-white/30'
                                            }`}
                                        >
                                            <img src={wp} alt={`Wallpaper ${idx + 1}`} className="w-full h-full object-cover" />
                                            {settings.wallpaper === wp && (
                                                <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider flex items-center gap-2">
                                    <Palette className="w-4 h-4" /> Accent Color
                                </h3>
                                <div className="flex gap-4">
                                    {colors.map(color => (
                                        <button
                                            key={color.name}
                                            onClick={() => setSettings({ accentColor: color.name })}
                                            className={`w-10 h-10 rounded-full ${color.value} transition-transform ${
                                                settings.accentColor === color.name ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-black' : 'hover:scale-110 opacity-70 hover:opacity-100'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider flex items-center gap-2">
                                    <SlidersHorizontal className="w-4 h-4" /> System Theme
                                </h3>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setSettings({ theme: 'dark' })}
                                        className={`px-6 py-3 rounded-xl border ${settings.theme === 'dark' ? 'bg-blue-500/20 border-blue-500 text-white' : 'bg-white/5 border-white/10 text-white/60'}`}
                                    >Dark</button>
                                    <button
                                        onClick={() => setSettings({ theme: 'light' })}
                                        className={`px-6 py-3 rounded-xl border ${settings.theme === 'light' ? 'bg-blue-500/20 border-blue-500 text-white' : 'bg-white/5 border-white/10 text-white/60'}`}
                                    >Light</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'account' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-2xl font-semibold tracking-tight">Account Settings</h2>

                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
                                <div>
                                    <label className="block text-sm text-white/60 mb-2">Display Name</label>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsernameInput(e.target.value)}
                                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-white/60 mb-2">Password (Leave blank for no password)</label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPasswordInput(e.target.value)}
                                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors"
                                        placeholder="Enter new password"
                                    />
                                </div>
                                <button
                                    onClick={handleSaveUser}
                                    className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors font-medium shadow-lg"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'system' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-2xl font-semibold tracking-tight">System Information</h2>

                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                                <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg">
                                        VD
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">Virtual DexTop OS</h3>
                                        <p className="text-white/60">Version 1.0.0 (Thin Client Edition)</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="text-white/50">Domain/Workgroup</div>
                                    <div className="font-medium text-right">{settings.domain}</div>

                                    <div className="text-white/50">Language</div>
                                    <div className="font-medium text-right">{settings.language}</div>

                                    <div className="text-white/50">Processor</div>
                                    <div className="font-medium text-right">Simulated WebAssembly Core</div>

                                    <div className="text-white/50">Memory</div>
                                    <div className="font-medium text-right">8.00 GB (Simulated)</div>
                                </div>
                            </div>

                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                <h3 className="font-medium mb-4 flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-green-400" /> Privacy & Security
                                </h3>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-medium">Diagnostic Data</div>
                                        <div className="text-sm text-white/50">Send anonymous usage statistics</div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" checked={settings.telemetryEnabled} onChange={(e) => setSettings({ telemetryEnabled: e.target.checked })} className="sr-only peer" />
                                        <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
