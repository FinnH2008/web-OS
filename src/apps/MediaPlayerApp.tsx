'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Music, ListMusic } from 'lucide-react';

const playlist = [
    { id: 1, title: 'Lo-Fi Chill Beats', artist: 'Creator One', duration: '3:45', url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3' },
    { id: 2, title: 'Synthwave Night Drive', artist: 'Neon Rider', duration: '4:12', url: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=synthwave-80s-116645.mp3' },
    { id: 3, title: 'Ambient Space', artist: 'Void', duration: '5:30', url: 'https://cdn.pixabay.com/download/audio/2022/12/28/audio_65cb1fb2a1.mp3?filename=ambient-space-129665.mp3' }
];

export default function MediaPlayerApp() {
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const audioRef = useRef<HTMLAudioElement>(null);

    const track = playlist[currentTrackIndex];

    useEffect(() => {
        if (isPlaying) {
            audioRef.current?.play().catch(e => console.error("Audio play failed:", e));
        } else {
            audioRef.current?.pause();
        }
    }, [isPlaying, currentTrackIndex]);

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            const current = audioRef.current.currentTime;
            const duration = audioRef.current.duration;
            if (duration) {
                setProgress((current / duration) * 100);
            }
        }
    };

    const handleNext = () => {
        setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
        setIsPlaying(true);
    };

    const handlePrev = () => {
        setCurrentTrackIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
        setIsPlaying(true);
    };

    const handleEnded = () => {
        handleNext();
    };

    return (
        <div className="h-full flex flex-col bg-black/40 text-white font-sans">
            <audio
                ref={audioRef}
                src={track.url}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleEnded}
            />

            <div className="p-6 bg-gradient-to-b from-white/10 to-transparent border-b border-white/10 flex items-center gap-6">
                <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl">
                    <Music className="w-10 h-10 text-white/50" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-white/90">{track.title}</h2>
                    <p className="text-white/60 text-lg">{track.artist}</p>
                </div>
            </div>

            <div className="p-6 border-b border-white/10">
                <div className="w-full h-1.5 bg-white/10 rounded-full mb-6 overflow-hidden cursor-pointer">
                    <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className="flex items-center justify-center gap-8">
                    <button onClick={handlePrev} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white">
                        <SkipBack className="w-6 h-6 fill-current" />
                    </button>
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-xl"
                    >
                        {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
                    </button>
                    <button onClick={handleNext} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white">
                        <SkipForward className="w-6 h-6 fill-current" />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                <h3 className="text-sm font-medium text-white/50 mb-4 uppercase tracking-wider flex items-center gap-2">
                    <ListMusic className="w-4 h-4" /> Up Next
                </h3>
                <div className="space-y-1">
                    {playlist.map((t, idx) => (
                        <div
                            key={t.id}
                            onClick={() => { setCurrentTrackIndex(idx); setIsPlaying(true); }}
                            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                                idx === currentTrackIndex ? 'bg-white/10 border border-white/10' : 'hover:bg-white/5 border border-transparent'
                            }`}
                        >
                            <div className="flex items-center gap-4">
                                <span className="text-white/30 text-sm font-mono w-4 text-center">{idx + 1}</span>
                                <div>
                                    <div className={`font-medium ${idx === currentTrackIndex ? 'text-blue-400' : 'text-white/90'}`}>{t.title}</div>
                                    <div className="text-xs text-white/50">{t.artist}</div>
                                </div>
                            </div>
                            <div className="text-sm text-white/50">{t.duration}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
