'use client';

import { useState, useEffect } from 'react';
import { useWindowStore } from '@/store/windowStore';
import { Activity, Cpu, HardDrive } from 'lucide-react';

export default function SystemMonitorApp() {
    const { windows } = useWindowStore();
    const [cpuUsage, setCpuUsage] = useState(0);
    const [ramUsage, setRamUsage] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCpuUsage(() => {
                const base = windows.length * 5;
                const jitter = Math.random() * 10 - 5;
                return Math.min(100, Math.max(0, Math.round(base + jitter)));
            });
            setRamUsage(() => {
                const base = windows.length * 150 + 1024;
                const jitter = Math.random() * 50 - 25;
                return Math.round(base + jitter);
            });
        }, 1500);
        return () => clearInterval(interval);
    }, [windows.length]);

    return (
        <div className="h-full flex flex-col bg-black/40 text-white p-4 overflow-y-auto">
            <h2 className="text-lg font-medium mb-4 flex items-center gap-2 border-b border-white/10 pb-2">
                <Activity className="w-5 h-5 text-blue-400" /> Activity Monitor
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-white/60 text-sm">
                        <Cpu className="w-4 h-4" /> CPU Load
                    </div>
                    <div className="text-3xl font-light">{cpuUsage}%</div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-1">
                        <div
                            className={`h-full transition-all duration-1000 ${cpuUsage > 80 ? 'bg-red-500' : cpuUsage > 50 ? 'bg-yellow-500' : 'bg-green-500'}`}
                            style={{ width: `${cpuUsage}%` }}
                        />
                    </div>
                </div>

                <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-white/60 text-sm">
                        <HardDrive className="w-4 h-4" /> RAM Usage
                    </div>
                    <div className="text-3xl font-light">{(ramUsage / 1024).toFixed(1)} GB</div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-1">
                        <div
                            className="h-full bg-blue-500 transition-all duration-1000"
                            style={{ width: `${(ramUsage / 8192) * 100}%` }}
                        />
                    </div>
                    <div className="text-xs text-white/40 mt-1">out of 8.0 GB</div>
                </div>
            </div>

            <h3 className="text-sm font-medium text-white/60 mb-2 uppercase tracking-wider">Active Processes</h3>
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden text-sm">
                <div className="grid grid-cols-12 gap-2 p-2 border-b border-white/10 bg-white/5 font-medium text-white/80">
                    <div className="col-span-6">Process Name</div>
                    <div className="col-span-3 text-right">CPU</div>
                    <div className="col-span-3 text-right">Memory</div>
                </div>
                <div className="divide-y divide-white/5">
                    <div className="grid grid-cols-12 gap-2 p-2 hover:bg-white/5 transition-colors">
                        <div className="col-span-6 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-400" /> Virtual DexTop Core
                        </div>
                        <div className="col-span-3 text-right text-white/60">{(cpuUsage * 0.4).toFixed(1)}%</div>
                        <div className="col-span-3 text-right text-white/60">1.2 GB</div>
                    </div>
                    {windows.map(win => (
                        <div key={win.id} className="grid grid-cols-12 gap-2 p-2 hover:bg-white/5 transition-colors">
                            <div className="col-span-6 flex items-center gap-2 truncate">
                                <div className="w-2 h-2 rounded-full bg-green-400" /> {win.title} ({win.type})
                            </div>
                            <div className="col-span-3 text-right text-white/60">{(cpuUsage / (windows.length || 1) * 0.5).toFixed(1)}%</div>
                            <div className="col-span-3 text-right text-white/60">~150 MB</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
