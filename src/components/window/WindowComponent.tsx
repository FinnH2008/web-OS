'use client';

import { useWindowStore, WindowData } from '@/store/windowStore';
import { motion } from 'framer-motion';
import { Minus, Square, X } from 'lucide-react';
import { Rnd } from 'react-rnd';

interface WindowComponentProps {
  windowData: WindowData;
  children: React.ReactNode;
}

export default function WindowComponent({ windowData, children }: WindowComponentProps) {
  const {
      closeWindow,
      minimizeWindow,
      maximizeWindow,
      restoreWindow,
      focusWindow,
      updateWindowPosition,
      updateWindowSize,
      activeWindowId
  } = useWindowStore();

  if (windowData.isMinimized) return null;

  const isActive = activeWindowId === windowData.id;

  const handleMaximizeToggle = () => {
      if (windowData.isMaximized) {
          restoreWindow(windowData.id);
      } else {
          maximizeWindow(windowData.id);
      }
  };

  return (
    <Rnd
      size={windowData.isMaximized ? { width: '100%', height: 'calc(100% - 80px)' } : { width: windowData.size.width, height: windowData.size.height }}
      position={windowData.isMaximized ? { x: 0, y: 0 } : { x: windowData.position.x, y: windowData.position.y }}
      onDragStop={(e, d) => {
        if (!windowData.isMaximized) {
            updateWindowPosition(windowData.id, { x: d.x, y: d.y });
        }
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        if (!windowData.isMaximized) {
            updateWindowSize(windowData.id, {
                width: parseInt(ref.style.width),
                height: parseInt(ref.style.height),
            });
            updateWindowPosition(windowData.id, position);
        }
      }}
      minWidth={300}
      minHeight={200}
      bounds="parent"
      dragHandleClassName="window-drag-handle"
      disableDragging={windowData.isMaximized}
      enableResizing={!windowData.isMaximized}
      style={{ zIndex: windowData.zIndex }}
      className="pointer-events-auto absolute"
      onMouseDown={() => focusWindow(windowData.id)}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        className={`w-full h-full flex flex-col rounded-xl overflow-hidden backdrop-blur-3xl transition-shadow ${
            isActive
                ? 'shadow-2xl border border-white/30 bg-black/40'
                : 'shadow-lg border border-white/10 bg-black/20'
        }`}
      >
        {/* Title Bar */}
        <div
            className="window-drag-handle h-10 flex items-center justify-between px-4 bg-white/5 border-b border-white/10 select-none"
            onDoubleClick={handleMaximizeToggle}
        >
            <div className="flex items-center gap-2">
                <span className="text-white/90 font-medium text-sm drop-shadow-md">
                    {windowData.title}
                </span>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={(e) => { e.stopPropagation(); minimizeWindow(windowData.id); }}
                    className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-400 flex items-center justify-center group"
                >
                    <Minus className="w-2 h-2 opacity-0 group-hover:opacity-100 text-black" />
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); handleMaximizeToggle(); }}
                    className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-400 flex items-center justify-center group"
                >
                    <Square className="w-2 h-2 opacity-0 group-hover:opacity-100 text-black" />
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); closeWindow(windowData.id); }}
                    className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-400 flex items-center justify-center group"
                >
                    <X className="w-2 h-2 opacity-0 group-hover:opacity-100 text-black" />
                </button>
            </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto bg-black/40 relative">
            {children}
        </div>
      </motion.div>
    </Rnd>
  );
}
