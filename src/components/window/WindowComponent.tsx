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
      snapWindow,
      activeWindowId
  } = useWindowStore();

  if (windowData.isMinimized) return null;

  const isActive = activeWindowId === windowData.id;

  const handleMaximizeToggle = () => {
      if (windowData.isMaximized || windowData.snapPosition !== 'none') {
          restoreWindow(windowData.id);
      } else {
          maximizeWindow(windowData.id);
      }
  };

  // Determine size and position based on state
  let currentSize = windowData.size;
  let currentPosition = windowData.position;

  // We need to account for the 56px (h-14) taskbar at the bottom when maximizing
  // so windows don't hide behind it.
  const taskbarHeight = 56;

  if (windowData.isMaximized || windowData.snapPosition === 'top') {
      currentSize = { width: '100%', height: `calc(100% - ${taskbarHeight}px)` };
      currentPosition = { x: 0, y: 0 };
  } else if (windowData.snapPosition === 'left') {
      currentSize = { width: '50%', height: `calc(100% - ${taskbarHeight}px)` };
      currentPosition = { x: 0, y: 0 };
  } else if (windowData.snapPosition === 'right') {
      currentSize = { width: '50%', height: `calc(100% - ${taskbarHeight}px)` };
      // Rnd handles % well for size, but x needs to be calculated. In render, window.innerWidth is tricky.
      // But setting x to '50%' works for standard CSS positioning in Rnd!
      currentPosition = { x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0, y: 0 };
  }

  const isSnapped = windowData.isMaximized || windowData.snapPosition !== 'none';

  return (
    <Rnd
      size={currentSize}
      position={currentPosition}
      onDragStop={(e, d) => {
        if (!windowData.isMaximized) {
            const screenWidth = window.innerWidth;

            // Advanced Snapping Detection
            if (d.y <= 0) {
                snapWindow(windowData.id, 'top');
            } else if (d.x <= 0) {
                snapWindow(windowData.id, 'left');
            } else if (d.x + 100 >= screenWidth) { // Using +100 as a threshold for the right edge
                snapWindow(windowData.id, 'right');
            } else {
                updateWindowPosition(windowData.id, { x: d.x, y: d.y });
            }
        }
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        if (!isSnapped) {
            updateWindowSize(windowData.id, {
                width: parseInt(ref.style.width),
                height: parseInt(ref.style.height),
            });
            updateWindowPosition(windowData.id, position);
        }
      }}
      onDragStart={() => {
          // If dragging a snapped window, un-snap it and restore to previous size at mouse position
          if (isSnapped) {
              restoreWindow(windowData.id);
          }
      }}
      minWidth={300}
      minHeight={200}
      bounds="parent" // Ensures it doesn't go outside the Desktop bounds (which stops above taskbar if configured correctly, or we limit it here)
      dragHandleClassName="window-drag-handle"
      disableDragging={windowData.isMaximized}
      enableResizing={!isSnapped}
      style={{ zIndex: windowData.zIndex }}
      className="pointer-events-auto absolute"
      onMouseDown={() => focusWindow(windowData.id)}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={`w-full h-full flex flex-col overflow-hidden backdrop-blur-3xl transition-all duration-200 ${
            isSnapped ? 'rounded-none' : 'rounded-2xl'
        } ${
            isActive
                ? 'shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/20 bg-black/40'
                : 'shadow-[0_10px_30px_rgba(0,0,0,0.3)] border border-white/10 bg-black/20'
        }`}
      >
        {/* Title Bar - Advanced Glassmorphism */}
        <div
            className="window-drag-handle h-12 flex items-center justify-between px-4 bg-gradient-to-b from-white/10 to-transparent border-b border-white/10 select-none relative"
            onDoubleClick={handleMaximizeToggle}
        >
            {/* Top edge highlight */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

            {/* Traffic Lights */}
            <div className="flex items-center gap-2">
                <button
                    onClick={(e) => { e.stopPropagation(); closeWindow(windowData.id); }}
                    className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] hover:bg-[#ff5f56]/80 flex items-center justify-center group shadow-inner border border-black/10"
                >
                    <X className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 text-black/60" strokeWidth={3} />
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); minimizeWindow(windowData.id); }}
                    className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] hover:bg-[#ffbd2e]/80 flex items-center justify-center group shadow-inner border border-black/10"
                >
                    <Minus className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 text-black/60" strokeWidth={3} />
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); handleMaximizeToggle(); }}
                    className="w-3.5 h-3.5 rounded-full bg-[#27c93f] hover:bg-[#27c93f]/80 flex items-center justify-center group shadow-inner border border-black/10"
                >
                    <Square className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 text-black/60" strokeWidth={3} />
                </button>
            </div>

            {/* Title */}
            <div className="absolute left-1/2 -translate-x-1/2 font-medium text-sm text-white/90 drop-shadow-md">
                {windowData.title}
            </div>

            <div className="w-16"></div> {/* Spacer to center title properly */}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto bg-black/40 relative">
            {children}
        </div>
      </motion.div>
    </Rnd>
  );
}
