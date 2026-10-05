'use client';

import { useSystemStore } from '@/store/systemStore';
import { Palette, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';

const wallpapers = [
    '/wallpapers/default.jpg',
    'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop'
];

export default function SettingsApp() {
    const { settings, setSettings, user, setUser } = useSystemStore();
    const [username, setUsernameInput] = useState(user?.username || '');

    const handleSaveUser = () => {
        if (username.trim()) {
            setUser(username.trim());
        }
    };

    return (
        <div className="h-full flex flex-col bg-black/40 text-white overflow-y-auto">
            <div className="p-6 max-w-2xl mx-auto w-full space-y-8">

                {/* Profile Section */}
                <section>
                    <h2 className="text-xl font-medium mb-4 flex items-center gap-2 border-b border-white/10 pb-2">
                        Profile
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-white/60 mb-1">Username</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsernameInput(e.target.value)}
                                    className="px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500 w-64"
                                />
                                <button
                                    onClick={handleSaveUser}
                                    className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/40 text-blue-300 rounded-lg transition-colors"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Appearance Section */}
                <section>
                    <h2 className="text-xl font-medium mb-4 flex items-center gap-2 border-b border-white/10 pb-2">
                        <Palette className="w-5 h-5" /> Appearance
                    </h2>

                    <div>
                        <label className="block text-sm text-white/60 mb-3 flex items-center gap-2">
                            <ImageIcon className="w-4 h-4" /> Wallpaper
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            {wallpapers.map((wp, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => setSettings({ wallpaper: wp })}
                                    className={`relative aspect-video rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                                        settings.wallpaper === wp ? 'border-blue-500 scale-[1.02]' : 'border-transparent hover:border-white/30'
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
                </section>

            </div>
        </div>
    );
}
