'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useSystemStore } from '@/store/systemStore';
import { ChevronRight } from 'lucide-react';

export default function SetupScreen() {
  const setUser = useSystemStore((state) => state.setUser);
  const setPhase = useSystemStore((state) => state.setPhase);
  const [username, setUsername] = useState('');
  const [step, setStep] = useState(1);

  const handleNext = () => {
    if (step === 1 && username.trim().length > 0) {
      setUser({ username: username.trim() });
      setStep(2);
    } else if (step === 2) {
      setPhase('desktop'); // Skip login for first setup, go straight to desktop
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-900 to-slate-900 flex items-center justify-center text-white z-50">

      {/* Animated Background blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
            animate={{ x: [0, 50, 0], y: [0, -50, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
            animate={{ x: [0, -50, 0], y: [0, 50, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
      </div>

      <motion.div
        key={step}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="w-full max-w-md p-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl relative z-10"
      >
        {step === 1 ? (
          <>
            <h2 className="text-3xl font-semibold mb-2">Welcome</h2>
            <p className="text-white/60 mb-8">Let&apos;s set up your Virtual DexTop.</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  What should we call you?
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                  className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="Enter your name"
                  autoFocus
                />
              </div>
            </div>

            <div className="mt-10 flex justify-end">
              <button
                onClick={handleNext}
                disabled={username.trim().length === 0}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 rounded-full transition-colors"
              >
                Continue <ChevronRight size={18} />
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
            <h2 className="text-2xl font-semibold mb-2">All Set, {username}!</h2>
            <p className="text-white/60 mb-8">Your workspace is ready.</p>
            <button
              onClick={handleNext}
              className="px-8 py-3 bg-white text-black hover:bg-gray-200 rounded-full font-medium transition-colors"
            >
              Start using DexTop
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
