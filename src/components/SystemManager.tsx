'use client';

import { useSystemStore } from '@/store/systemStore';
import BootScreen from './system/BootScreen';
import SetupScreen from './system/SetupScreen';
import LoginScreen from './system/LoginScreen';
import LockScreen from './system/LockScreen';
import Desktop from './desktop/Desktop';

export default function SystemManager() {
  const phase = useSystemStore((state) => state.phase);

  return (
    <div className="w-screen h-screen overflow-hidden bg-black selection:bg-blue-500/30">
      {phase === 'booting' && <BootScreen />}
      {phase === 'setup' && <SetupScreen />}
      {phase === 'login' && <LoginScreen />}
      {phase === 'locked' && <LockScreen />}
      {phase === 'desktop' && <Desktop />}
    </div>
  );
}
