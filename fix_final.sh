#!/bin/bash
sed -i '1d' src/components/desktop/startmenu/StartMenu.tsx
sed -i "s/import { useWindowStore } from '@\/store\/windowStore';/import { useWindowStore, type WindowData } from '@\/store\/windowStore';/" src/components/desktop/startmenu/StartMenu.tsx

mkdir -p src/hooks src/components/ui

cat << 'HOOK_EOF' > src/hooks/useContextMenu.ts
'use client';

import { useEffect, useState, useCallback } from 'react';

export function useContextMenu() {
  const [clicked, setClicked] = useState(false);
  const [points, setPoints] = useState({ x: 0, y: 0 });
  const [contextData, setContextData] = useState<unknown>(null);

  const handleContextMenu = useCallback((e: React.MouseEvent, data?: unknown) => {
    e.preventDefault();
    e.stopPropagation();
    setClicked(true);
    setPoints({ x: e.pageX, y: e.pageY });
    setContextData(data || null);
  }, []);

  const handleClick = useCallback(() => {
    setClicked(false);
  }, []);

  useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [handleClick]);

  return {
    clicked,
    setClicked,
    points,
    handleContextMenu,
    contextData,
  };
}
HOOK_EOF

cat << 'UI_EOF' > src/components/ui/ContextMenu.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface ContextMenuProps {
  show: boolean;
  x: number;
  y: number;
  items: { label: string; action: () => void; icon?: React.ReactNode; divider?: boolean; disabled?: boolean }[];
  onClose: () => void;
}

export default function ContextMenu({ show, x, y, items, onClose }: ContextMenuProps) {
  const adjustedX = x + 200 > (typeof window !== 'undefined' ? window.innerWidth : 1000) ? x - 200 : x;
  const adjustedY = y + (items.length * 40) > (typeof window !== 'undefined' ? window.innerHeight : 800) ? y - (items.length * 40) : y;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.1 }}
          className="fixed z-[100] w-56 bg-black/60 backdrop-blur-3xl border border-white/20 rounded-xl shadow-2xl py-1 overflow-hidden"
          style={{ top: adjustedY, left: adjustedX }}
          onClick={(e) => e.stopPropagation()}
          onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); }}
        >
          {items.map((item, index) => (
            item.divider ? (
                <div key={`div-${index}`} className="h-px bg-white/10 my-1 mx-2" />
            ) : (
                <button
                key={index}
                onClick={() => {
                    if (!item.disabled) {
                        item.action();
                        onClose();
                    }
                }}
                disabled={item.disabled}
                className={`w-full text-left px-4 py-1.5 text-sm flex items-center gap-2 transition-colors ${
                    item.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10 text-white/90'
                }`}
                >
                {item.icon && <span className="w-4 h-4 flex items-center justify-center">{item.icon}</span>}
                {item.label}
                </button>
            )
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
UI_EOF
