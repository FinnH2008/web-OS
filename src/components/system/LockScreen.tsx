'use client';

import { motion } from 'framer-motion';
import { useSystemStore } from '@/store/systemStore';
import { useState, useEffect } from 'react';
import { ArrowRight, Lock } from 'lucide-react';

export default function LockScreen() {
  const user = useSystemStore((state) => state.user);
  const setPhase = useSystemStore((state) => state.setPhase);
  const language = useSystemStore((state) => state.settings.language);
  const wallpaper = useSystemStore((state) => state.settings.wallpaper);

  const [inputPassword, setInputPassword] = useState('');
  const [error, setError] = useState(false);
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setTime(now.toLocaleTimeString(language, { hour: '2-digit', minute: '2-digit' }));
            setDate(now.toLocaleDateString(language, { weekday: 'long', month: 'long', day: 'numeric' }));
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
  }, [language]);

  const handleUnlock = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (user?.password) {
        if (inputPassword === user.password) {
            setError(false);
            setPhase('desktop');
        } else {
            setError(true);
            setInputPassword('');
        }
    } else {
        setPhase('desktop');
    }
  };

  return (
    <div
      className="fixed inset-0 bg-cover bg-center flex flex-col items-center justify-center z-[100] font-sans"
      style={{ backgroundImage: `url('${wallpaper}')` }}
    >
      <div className="absolute inset-0 bg-black/20 backdrop-blur-md" />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex flex-col items-center mb-16"
      >
          <div className="text-6xl font-light text-white drop-shadow-lg mb-2 tracking-wider">{time}</div>
          <div className="text-xl text-white/80 drop-shadow-md">{date}</div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center"
      >
        <div className="w-24 h-24 bg-white/10 border border-white/20 rounded-full flex items-center justify-center backdrop-blur-md shadow-2xl mb-4 overflow-hidden">
          {user?.avatar ? (
             <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
          ) : (
             <span className="text-3xl font-light text-white">
               {user?.username?.charAt(0).toUpperCase() || 'U'}
             </span>
          )}
        </div>

        <h2 className="text-2xl font-medium text-white mb-6 drop-shadow-md">
          {user?.username || 'User'}
        </h2>

        <form onSubmit={handleUnlock} className="flex flex-col items-center gap-4">
            <div className="relative group">
                <input
                    type="password"
                    value={inputPassword}
                    onChange={(e) => { setInputPassword(e.target.value); setError(false); }}
                    placeholder="Password"
                    className={`w-64 px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-2xl transition-all ${
                        error ? 'border-red-500 ring-2 ring-red-500/50 bg-red-500/10' : 'border-white/20 hover:bg-white/20'
                    }`}
                    autoFocus
                />
                <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
                >
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
            {error ? (
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-400 text-sm font-medium bg-black/40 px-3 py-1 rounded-full"
                >
                    Incorrect password.
                </motion.span>
            ) : (
                <div className="flex items-center gap-2 text-white/50 text-sm">
                    <Lock className="w-3 h-3" /> System Locked
                </div>
            )}
        </form>
      </motion.div>
    </div>
  );
}
