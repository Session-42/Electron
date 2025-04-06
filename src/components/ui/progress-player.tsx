import React, { useEffect, useMemo } from 'react';
import { Play, Pause } from 'lucide-react';
import { cn } from '~/utils/utils';
import { useAudio } from '../../hooks/use-audio';

interface SimpleProgressPlayerProps {
    /** URL of the audio file to play */
    audioUrl: string;
    /** Additional CSS classes to apply to the container */
    className?: string;
}

const SimpleProgressPlayer: React.FC<SimpleProgressPlayerProps> = ({
    audioUrl,
    className = '',
}) => {
    const { state, controls } = useAudio(audioUrl);

    // Calculate progress (0-1)
    const progress = useMemo(() => {
        const played = state.duration > 0 ? state.seek / state.duration : 0;
        return {
            played,
            duration: state.duration,
        };
    }, [state.seek, state.duration]);

    useEffect(() => {
        return () => {
            controls.pause();
        };
    }, []);

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleProgressBarClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        const progressBar = event.currentTarget;
        const rect = progressBar.getBoundingClientRect();
        const clickPosition = (event.clientX - rect.left) / rect.width;
        const newTime = progress.duration * clickPosition;
        controls.seekTo(newTime);
    };

    const handlePlayPauseClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        if (state.isPlaying) {
            controls.pause();
        } else {
            controls.play();
        }
    };

    // Convert progress.played (0-1) to percentage (0-100)
    const progressPercentage = progress.played * 100;
    const currentTime = progress.played * progress.duration;

    return (
        <div
            className={cn(
                'relative border border-border-secondary dark:border-border-hover rounded-[17px] flex w-full h-[35px] bg-background-tertiary',
                className
            )}
            onClick={(e) => e.stopPropagation()}
            role="presentation"
        >
            <div className="flex items-center w-full p-[3.5px_3.5px_3.5px_3.5px]">
                {/* Play/Pause Button Container */}
                <div className="flex-shrink-0 w-[27px] h-[27px] border border-border-secondary dark:border-border-hover rounded-full flex items-center justify-center hover:border-accent dark:hover:border-accent">
                    <button
                        type="button"
                        onClick={handlePlayPauseClick}
                        disabled={state.isLoading}
                        className="w-full h-full flex items-center justify-center disabled:opacity-50"
                        aria-label={state.isPlaying ? 'Pause' : 'Play'}
                    >
                        {state.isLoading ? (
                            <div className="flex items-center justify-center w-full h-full">
                                <div
                                    className="w-[10px] h-[10px] border-2 border-accent border-t-border-s rounded-full animate-spin"
                                    role="progressbar"
                                    aria-label="Loading audio"
                                />
                            </div>
                        ) : state.isPlaying ? (
                            <div className="flex items-center justify-center w-full h-full">
                                <Pause className="w-[10px] h-[10px] text-text-primary fill-text-primary" />
                            </div>
                        ) : (
                            <div className="flex items-center justify-center w-full h-full">
                                <Play className="w-[10px] h-[10px] text-text-primary fill-text-primary" />
                            </div>
                        )}
                    </button>
                </div>

                {/* Progress Bar and Time Container */}
                <div className="flex-1 flex flex-col items-start justify-between min-w-0 pr-[10px] mt-[4px] ml-[9.2px]">
                    {/* Progress Bar */}
                    <div
                        className="h-2 bg-border-secondary dark:bg-border-hover rounded-full overflow-hidden w-full relative cursor-pointer"
                        role="progressbar"
                        aria-valuenow={progressPercentage}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        onClick={handleProgressBarClick}
                    >
                        {/* Playback Progress */}
                        <div
                            className="h-full bg-accent transition-all duration-100 relative"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>

                    {/* Time Display */}
                    <div className="flex justify-between text-xs sm:text-xs text-text-primary pt-1 w-full">
                        {progress.duration > 0 ? (
                            <>
                                <span className="tabular-nums">{formatTime(currentTime)}</span>
                                <span className="tabular-nums">
                                    {formatTime(progress.duration)}
                                </span>
                            </>
                        ) : (
                            <>
                                <span className="tabular-nums">0:00</span>
                                <span className="tabular-nums">0:00</span>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SimpleProgressPlayer;
