'use client';

import { motion } from 'framer-motion';
import React from "react";
import { useDesktopStore } from '@/store/desktopStore';

interface DesktopIconProps {
    app: { id: string; title: string; icon: React.ElementType; color: string };
    onDoubleClick: () => void;
    index: number;
}

export default function DesktopIcon({ app, onDoubleClick, index }: DesktopIconProps) {
    const { iconPositions, updateIconPosition } = useDesktopStore();

    const savedPos = iconPositions.find(p => p.id === app.id);

    // Default grid layout if no saved position
    const defaultX = 20;
    const defaultY = 20 + (index * 100);

    return (
        <motion.div
            drag
            dragMomentum={false}
            initial={{ x: savedPos?.x ?? defaultX, y: savedPos?.y ?? defaultY }}
            onDragEnd={(e, info) => {
                updateIconPosition(app.id, info.point.x, info.point.y);
            }}
            onDoubleClick={(e) => { e.stopPropagation(); onDoubleClick(); }}
            className="absolute flex flex-col items-center justify-center w-20 p-2 rounded-xl hover:bg-black/20 cursor-pointer transition-colors group z-0"
        >
            <div className="w-12 h-12 bg-black/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 group-hover:border-white/40 shadow-lg mb-2">
                <app.icon className={`w-6 h-6 ${app.color} drop-shadow-md pointer-events-none`} />
            </div>
            <span className="text-white text-xs text-center drop-shadow-md px-1 py-0.5 rounded-sm bg-black/30 backdrop-blur-sm pointer-events-none">
                {app.title}
            </span>
        </motion.div>
    );
}
