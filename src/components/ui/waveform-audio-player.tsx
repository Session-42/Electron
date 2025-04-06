import { Pause, Play } from 'lucide-react';
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useTheme } from '~/contexts/theme-context';

interface AudioPlayerProps {
    audioUrl: string;
    className: string;
}

const WaveformAudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl, className }) => {
    const { mode } = useTheme();
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const animationRef = useRef<number | null>(null);
    const baseImageRef = useRef<ImageData | null>(null);

    // Fixed values for bar dimensions - never changed during rendering
    const BAR_WIDTH = 1; // Fixed width for each bar
    const SEGMENT_WIDTH = 1.5; // Fixed spacing between bars
    const barDataRef = useRef<{ x: number; width: number; height: number; y: number }[]>([]);
    const canvasSizeRef = useRef<{ width: number; height: number }>({ width: 0, height: 0 });

    // Generate a stable waveform pattern based on audioUrl
    const waveformData = useMemo(() => {
        // Create a fixed seed based on audioUrl or use a constant if empty
        const seed = audioUrl
            ? audioUrl.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
            : 12345;

        // Seeded pseudo-random number generator for stability
        const createRandom = (seed: number) => {
            let value = seed;
            return () => {
                value = (value * 9301 + 49297) % 233280;
                return value / 233280;
            };
        };

        const random = createRandom(seed);

        // Generate a stable waveform with 300 points
        return Array.from({ length: 300 }, () => random() * 0.8 + 0.2);
    }, [audioUrl]);

    // Reset everything when audio source changes
    useEffect(() => {
        baseImageRef.current = null;
        barDataRef.current = [];
        setCurrentTime(0);
        setIsPlaying(false);
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.pause();
        }

        // Draw initial waveform when URL changes
        requestAnimationFrame(() => drawInitialWaveform());
    }, [audioUrl]);

    // Reset and redraw when theme changes
    useEffect(() => {
        const currentProgress = duration > 0 ? currentTime / duration : 0;
        baseImageRef.current = null;
        barDataRef.current = [];
        requestAnimationFrame(() => {
            drawInitialWaveform();
            updateProgress(currentProgress);
        });
    }, [mode, currentTime, duration]);

    // Draw the initial waveform once and save it
    const drawInitialWaveform = () => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container || !waveformData.length) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();

        // Save the canvas physical size for future reference
        canvasSizeRef.current = {
            width: rect.width,
            height: rect.height,
        };

        // Set canvas dimensions accounting for DPR
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;

        // Apply DPR scaling once
        ctx.scale(dpr, dpr);

        // Get computed colors from CSS
        const computedStyle = getComputedStyle(container);
        const textSecondaryColor = computedStyle.getPropertyValue('--text-secondary').trim();
        const bgSecondaryColor = computedStyle.getPropertyValue('--background-tertiary').trim();

        // Clear and draw background
        ctx.clearRect(0, 0, rect.width, rect.height);
        ctx.fillStyle = bgSecondaryColor;
        ctx.fillRect(0, 0, rect.width, rect.height);

        // Store bar data for consistent redraws
        barDataRef.current = [];

        // Calculate number of bars to fit the canvas width
        const totalBars = Math.floor(rect.width / SEGMENT_WIDTH);

        // Draw each bar and store its exact dimensions
        for (let i = 0; i < totalBars; i++) {
            const x = i * SEGMENT_WIDTH;
            const dataIndex = Math.floor((i / totalBars) * waveformData.length);
            const amplitude = waveformData[dataIndex] || 0.5;

            const maxHeight = amplitude * (rect.height * 0.8);
            const y = rect.height / 2 - maxHeight / 2;

            // Store exact bar coordinates and dimensions for reuse
            barDataRef.current.push({
                x,
                width: BAR_WIDTH,
                height: maxHeight,
                y,
            });

            // Draw the background bar
            ctx.beginPath();
            ctx.rect(x, y, BAR_WIDTH, maxHeight);
            ctx.fillStyle = textSecondaryColor;
            ctx.globalAlpha = 0.3;
            ctx.fill();
            ctx.globalAlpha = 1;
        }

        // Save this complete background image
        baseImageRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);

        // Initial draw with no progress
        updateProgress(0);
    };

    // Update only the progress fill, using stored bar data
    const updateProgress = (progress: number) => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container || !baseImageRef.current || barDataRef.current.length === 0)
            return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Restore the base image with all background bars
        ctx.putImageData(baseImageRef.current, 0, 0);

        if (progress <= 0) return; // Nothing to fill

        // Get accent color for the progress fill
        const computedStyle = getComputedStyle(container);
        const accentColor = computedStyle.getPropertyValue('--accent').trim() || '#8A2BE2';

        // Calculate how many bars should be filled based on progress
        const progressWidth = canvasSizeRef.current.width * progress;
        const barsToFill = barDataRef.current.filter((bar) => bar.x <= progressWidth);

        // Fill only the bars that should show progress
        if (barsToFill.length > 0) {
            ctx.fillStyle = accentColor;
            ctx.globalAlpha = 0.8;

            for (const bar of barsToFill) {
                ctx.beginPath();
                ctx.rect(bar.x, bar.y, bar.width, bar.height);
                ctx.fill();
            }

            ctx.globalAlpha = 1;
        }
    };

    // Handle canvas resize
    useEffect(() => {
        const handleResize = () => {
            // Only redraw if the canvas size actually changed
            const canvas = canvasRef.current;
            if (!canvas) return;

            const rect = canvas.getBoundingClientRect();
            if (
                rect.width !== canvasSizeRef.current.width ||
                rect.height !== canvasSizeRef.current.height
            ) {
                // Redraw the entire waveform when window size changes
                baseImageRef.current = null;
                barDataRef.current = [];
                drawInitialWaveform();
            }
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [waveformData, mode]);

    // Update progress display when currentTime/duration changes
    useEffect(() => {
        if (duration <= 0) return;
        updateProgress(currentTime / duration);
    }, [currentTime, duration]);

    // Smoother animation during playback
    useEffect(() => {
        if (!isPlaying || duration <= 0) {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
                animationRef.current = null;
            }
            return;
        }

        const animate = () => {
            if (audioRef.current) {
                setCurrentTime(audioRef.current.currentTime);
            }

            if (isPlaying) {
                animationRef.current = requestAnimationFrame(animate);
            }
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
                animationRef.current = null;
            }
        };
    }, [duration, isPlaying]);

    // Handle click on waveform to seek
    const handleWaveformClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        const canvas = canvasRef.current;
        if (!canvas || !audioRef.current || !duration) return;

        // Get click position relative to canvas
        const rect = canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const seekPosition = clickX / rect.width;

        // Set new time and update audio
        const newTime = duration * seekPosition;
        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);

        // Update progress visual immediately
        updateProgress(seekPosition);
    };

    // Handle audio events
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const setAudioData = () => {
            setDuration(audio.duration);
        };

        const setAudioTime = () => {
            setCurrentTime(audio.currentTime);
        };

        const handleEnded = () => {
            setIsPlaying(false);
        };

        audio.addEventListener('loadeddata', setAudioData);
        audio.addEventListener('timeupdate', setAudioTime);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('loadeddata', setAudioData);
            audio.removeEventListener('timeupdate', setAudioTime);
            audio.removeEventListener('ended', handleEnded);
        };
    }, []);

    // Toggle play/pause
    const togglePlay = async () => {
        const audio = audioRef.current;
        if (!audio) return;

        try {
            if (isPlaying) {
                audio.pause();
                setIsPlaying(false);
            } else {
                await audio.play();
                setIsPlaying(true);
            }
        } catch (error) {
            console.error('Error playing audio:', error);
        }
    };

    // Format time in MM:SS format
    const formatTime = (timeInSeconds: number) => {
        if (isNaN(timeInSeconds)) return '00:00';
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div
            ref={containerRef}
            className={`flex items-center p-4 rounded-xl w-full max-w-md ${className}`}
        >
            {/* Play button */}
            <button
                onClick={togglePlay}
                className="min-w-[27px] w-[27px] h-[27px] rounded-full border-border-secondary dark:border-border-hover border hover:border-accent dark:hover:border-accent flex items-center justify-center mr-4 shrink-0"
            >
                {isPlaying ? (
                    <div className="flex items-center justify-center w-full h-full">
                        <Pause className="w-[10px] h-[10px] text-text-primary fill-text-primary" />
                    </div>
                ) : (
                    <div className="flex items-center justify-center w-full h-full">
                        <Play className="w-[10px] h-[10px] text-text-primary fill-text-primary" />
                    </div>
                )}
            </button>
            {/* Waveform visualization */}
            <button
                onClick={handleWaveformClick}
                className="flex-grow h-10 cursor-pointer focus:outline-none"
                aria-label="Seek audio position"
                role="slider"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round((currentTime / (duration || 1)) * 100)}
            >
                <canvas ref={canvasRef} className="w-full h-full" />
            </button>
            {/* Current time display with fixed width using monospace font */}
            <div className="pl-4 text-xs text-text-primary font-medium w-12 font-primary">
                {formatTime(currentTime)}
            </div>
            {/* Hidden audio element */}
            <audio ref={audioRef} src={audioUrl}></audio>
        </div>
    );
};

export default WaveformAudioPlayer;
