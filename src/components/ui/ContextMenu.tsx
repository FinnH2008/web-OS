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
  const adjustedX = x + 220 > (typeof window !== 'undefined' ? window.innerWidth : 1000) ? x - 220 : x;
  const adjustedY = y + (items.length * 40) > (typeof window !== 'undefined' ? window.innerHeight : 800) ? y - (items.length * 40) : y;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -5 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -5 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="fixed z-[100] w-56 bg-white/10 backdrop-blur-3xl border border-white/20 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] py-1.5 overflow-hidden"
          style={{ top: adjustedY, left: adjustedX }}
          onClick={(e) => e.stopPropagation()}
          onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); }}
        >
          {items.map((item, index) => (
            item.divider ? (
                <div key={`div-${index}`} className="h-px bg-white/10 my-1 mx-3" />
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
                className={`w-[calc(100%-16px)] mx-2 text-left px-3 py-1.5 text-sm flex items-center gap-3 rounded-lg transition-colors ${
                    item.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-500/80 hover:text-white text-white/90'
                }`}
                >
                {item.icon && <span className="w-4 h-4 flex items-center justify-center opacity-80">{item.icon}</span>}
                {item.label}
                </button>
            )
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
