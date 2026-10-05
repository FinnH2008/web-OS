'use client';

import { motion } from 'framer-motion';
import { useSystemStore } from '@/store/systemStore';

export default function LoginScreen() {
  const user = useSystemStore((state) => state.user);
  const setPhase = useSystemStore((state) => state.setPhase);

  const handleLogin = () => {
    // Currently passwordless as requested
    setPhase('desktop');
  };

  return (
    <div
      className="fixed inset-0 bg-cover bg-center flex items-center justify-center z-50"
      style={{ backgroundImage: `url('/wallpapers/default.jpg')` }}
    >
      {/* Heavy blur overlay for login screen */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xl" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
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

        <button
          onClick={handleLogin}
          className="px-8 py-3 bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-full backdrop-blur-md transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          Enter Workspace
        </button>
      </motion.div>
    </div>
  );
}
