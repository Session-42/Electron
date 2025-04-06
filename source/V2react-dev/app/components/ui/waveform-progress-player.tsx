import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Play, Pause } from 'lucide-react';
import { cn } from '~/utils/utils';
import { useAudio } from '~/hooks/use-audio';

interface WaveformProgressPlayerProps {
    /**
     * URL of the audio file to be played and visualized
     */
    audioUrl?: string;
    /**
     * Additional CSS classes to be applied to the container
     */
    className?: string;
}

interface WaveformPoint {
    /**
     * Maximum amplitude value for this point in the waveform
     */
    max: number;
    /**
     * Minimum amplitude value for this point in the waveform
     */
    min: number;
}

export const WaveformProgressPlayer = ({
    audioUrl = '',
    className,
}: WaveformProgressPlayerProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [waveformData, setWaveformData] = useState<WaveformPoint[]>([]);
    const [isWaveformLoading, setIsWaveformLoading] = useState(false);

    // Use the new audio hook with state and controls
    const { state, controls } = useAudio(audioUrl);

    // Create a progress object that matches the expected structure
    const progress = useMemo(() => {
        return {
            played: state.duration > 0 ? state.seek / state.duration : 0,
            duration: state.duration,
        };
    }, [state.seek, state.duration]);

    // Analyze audio file and generate waveform data
    useEffect(() => {
        if (!canvasRef.current) return;

        if (!audioUrl) return;

        const analyzeAudio = async () => {
            setIsWaveformLoading(true);
            try {
                // Fetch and decode audio data
                const response = await fetch(audioUrl);
                const arrayBuffer = await response.arrayBuffer();

                const audioContext = new (window.AudioContext ||
                    (window as any).webkitAudioContext)();
                const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

                // Get raw audio data from the first channel
                const channelData = audioBuffer.getChannelData(0);
                const points = Math.floor(canvasRef.current!.offsetWidth);
                const samplesPerPoint = Math.ceil(channelData.length / points);
                const waveform: WaveformPoint[] = [];

                // Find maximum amplitude in the audio file
                let maxAmplitude = 0;
                for (let i = 0; i < channelData.length; i++) {
                    const amplitude = Math.abs(channelData[i]);
                    if (amplitude > maxAmplitude) maxAmplitude = amplitude;
                }

                // Scale down max amplitude to prevent clipping
                maxAmplitude = maxAmplitude * 0.7;

                // Process audio data into waveform points
                for (let i = 0; i < points; i++) {
                    const startSample = i * samplesPerPoint;
                    const endSample = Math.min(startSample + samplesPerPoint, channelData.length);

                    let maxInSegment = -1;
                    let minInSegment = 1;
                    let rmsSum = 0;
                    let count = 0;

                    // Calculate min, max, and RMS values for each segment
                    for (let j = startSample; j < endSample; j++) {
                        const value = channelData[j];
                        maxInSegment = Math.max(maxInSegment, value);
                        minInSegment = Math.min(minInSegment, value);
                        rmsSum += value * value;
                        count++;
                    }

                    // Calculate RMS and normalize segment values
                    const rms = Math.sqrt(rmsSum / count);
                    maxInSegment = (maxInSegment * 1.2 + rms * 0.8) / (2 * maxAmplitude);
                    minInSegment = (minInSegment * 1.2 + rms * 0.8) / (2 * maxAmplitude);

                    // Ensure minimum amplitude for visibility
                    const minAmplitude = 0.05;
                    const amplitude = Math.abs(maxInSegment - minInSegment);
                    if (amplitude < minAmplitude) {
                        maxInSegment = minAmplitude / 2;
                        minInSegment = -minAmplitude / 2;
                    }

                    // Add normalized point to waveform data
                    waveform.push({
                        max: Math.min(Math.max(maxInSegment, -1), 1),
                        min: Math.min(Math.max(minInSegment, -1), 1),
                    });
                }

                setWaveformData(waveform);
            } catch (error) {
                console.error('Error analyzing audio:', error);
            } finally {
                setIsWaveformLoading(false);
            }
        };

        analyzeAudio();
    }, [audioUrl]);

    // Draw waveform on canvas
    useEffect(() => {
        if (!canvasRef.current || waveformData.length === 0) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', {
            alpha: false,
        }) as CanvasRenderingContext2D;
        if (!ctx) return;

        // Set up high DPI canvas
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();

        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;

        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, rect.width, rect.height);

        const centerY = rect.height / 2;
        const progressPoint = Math.floor(rect.width * progress.played);

        // Draw background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, rect.width, rect.height);

        // Create gradient for waveform
        const gradient = ctx.createLinearGradient(0, 0, rect.width, 0);
        gradient.addColorStop(0, '#8a44c8');
        gradient.addColorStop(1, '#df0c39');

        // Helper function to draw a single waveform segment
        const drawSegment = (x: number, amplitude: number, isPlayed: boolean) => {
            const heightScale = 1;
            const minHeight = 1;
            const height = Math.max(Math.abs(amplitude * centerY * heightScale), minHeight);
            const y = centerY;

            ctx.fillStyle = isPlayed ? gradient : '#e8e8e9';

            // Calculate segment width based on total width and number of points
            const segmentWidth = rect.width / waveformData.length;

            // Draw the segment using exact coordinates (no rounding)
            ctx.fillRect(x, y - height / 2, segmentWidth, height);
        };

        // Draw each waveform segment
        waveformData.forEach((point, i) => {
            const x = (i / waveformData.length) * rect.width;
            const amplitude = Math.max(0.01, point.max - point.min); // Ensure minimum amplitude
            const isPlayed = x < progressPoint;
            drawSegment(x, amplitude, isPlayed);
        });
    }, [waveformData, progress.played]);

    // Handle play/pause button click
    const handlePlayToggle = () => {
        controls.toggle();
    };

    return (
        <div
            ref={containerRef}
            className={cn(
                'relative border border-[#d9d9df] rounded-[14px] transition-all duration-300',
                'px-2 py-1 flex items-center w-full h-full',
                className
            )}
        >
            {/* Play/Pause button */}
            <button
                onClick={handlePlayToggle}
                disabled={state.isLoading || isWaveformLoading}
                className="w-8 h-8 border border-[#d9d9df] rounded-full flex items-center justify-center hover:bg-gray-50 cursor-pointer mr-1 disabled:opacity-50 flex-shrink-0"
            >
                {state.isLoading || isWaveformLoading ? (
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                ) : state.isPlaying ? (
                    <Pause className="w-4 h-4 text-black" />
                ) : (
                    <Play className="w-4 h-4 text-black ml-0.5" />
                )}
            </button>

            {/* Waveform container */}
            <div className="flex-1 h-full relative">
                <div
                    onClick={async (e: React.MouseEvent) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const clickPosition = (e.clientX - rect.left) / rect.width;
                        controls.seekTo(clickPosition * progress.duration);
                    }}
                    role="slider"
                    tabIndex={0}
                    aria-label="Audio progress"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(progress.played * 100)}
                    className="w-full h-full cursor-pointer"
                >
                    <canvas ref={canvasRef} className="w-full h-full" />
                </div>
            </div>
        </div>
    );
};

export default WaveformProgressPlayer;
