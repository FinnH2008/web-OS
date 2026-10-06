'use client';

import { motion } from 'framer-motion';
import { useSystemStore } from '@/store/systemStore';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export default function LoginScreen() {
  const user = useSystemStore((state) => state.user);
  const setPhase = useSystemStore((state) => state.setPhase);

  const [inputPassword, setInputPassword] = useState('');
  const [error, setError] = useState(false);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // If user has a password set, verify it
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
      className="fixed inset-0 bg-cover bg-center flex items-center justify-center z-50 font-sans"
      style={{ backgroundImage: `url('/wallpapers/default.jpg')` }}
    >
      {/* Heavy blur overlay for login screen */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-3xl" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center"
      >
        <div className="w-32 h-32 bg-white/10 border border-white/20 rounded-full flex items-center justify-center backdrop-blur-md shadow-2xl mb-6 overflow-hidden">
          {user?.avatar ? (
             <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
          ) : (
             <span className="text-5xl font-light text-white">
               {user?.username?.charAt(0).toUpperCase() || 'U'}
             </span>
          )}
        </div>

        <h2 className="text-3xl font-medium text-white mb-8 drop-shadow-md">
          {user?.username || 'User'}
        </h2>

        {user?.password ? (
            <form onSubmit={handleLogin} className="flex flex-col items-center gap-4">
                <div className="relative">
                    <input
                        type="password"
                        value={inputPassword}
                        onChange={(e) => { setInputPassword(e.target.value); setError(false); }}
                        placeholder="Password"
                        className={`w-64 px-4 py-2.5 bg-black/40 border rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-md transition-all ${
                            error ? 'border-red-500 ring-2 ring-red-500/50' : 'border-white/20'
                        }`}
                        autoFocus
                    />
                    <button
                        type="submit"
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-white/50 hover:text-white transition-colors"
                    >
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
                {error && (
                    <motion.span
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm font-medium"
                    >
                        Incorrect password.
                    </motion.span>
                )}
            </form>
        ) : (
            <button
              onClick={() => handleLogin()}
              className="px-8 py-3 bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-full backdrop-blur-md transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              Sign In
            </button>
        )}
      </motion.div>
    </div>
  );
}
