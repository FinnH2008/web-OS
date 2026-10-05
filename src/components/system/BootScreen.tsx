'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useSystemStore } from '@/store/systemStore';

export default function BootScreen() {
  const setPhase = useSystemStore((state) => state.setPhase);
  const user = useSystemStore((state) => state.user);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            if (user) {
              setPhase('login');
            } else {
              setPhase('setup');
            }
          }, 500);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [setPhase, user]);

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center text-white z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="flex flex-col items-center"
      >
        {/* Abstract Logo */}
        <div className="w-24 h-24 relative mb-8">
          <motion.div
            className="absolute inset-0 border-4 border-blue-500 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-2 border-4 border-purple-500 rounded-full border-t-transparent"
            animate={{ rotate: -360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
           <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
             VD
           </div>
        </div>

        <h1 className="text-3xl font-light tracking-[0.2em] mb-12 opacity-80">
          VIRTUAL DEXTOP
        </h1>

        <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.2 }}
          />
        </div>
      </motion.div>
    </div>
  );
}
