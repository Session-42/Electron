import { useState, useEffect, useCallback, useRef } from 'react';
import AudioPlayer from './audio-player';

interface AudioState {
    isPlaying: boolean;
    isLoading: boolean;
    seek: number;
    duration: number;
    volume: number;
    loop: boolean;
    muted: boolean;
    url: string | null;
}

interface AudioControls {
    play: () => void;
    pause: () => void;
    toggle: () => void;
    stop: () => void;
    seekTo: (position: number) => void;
    setVolume: (volume: number) => void;
    setMute: (muted: boolean) => void;
    setLoop: (loop: boolean) => void;
    restart: () => void;
}

interface UseAudioOptions {
    autoPlay?: boolean;
    startPosition?: number;
    volume?: number;
    loop?: boolean;
    muted?: boolean;
    exclusivePlayback?: boolean;
}

/**
 * Custom hook for using independent audio players
 * @param url Audio URL to play
 * @param options Configuration options
 * @returns Object containing audio state and controls
 */
export const useAudio = (
    url: string,
    options: UseAudioOptions = {}
): { state: AudioState; controls: AudioControls } => {
    // Set default options
    const { autoPlay = false } = options;

    // Get player instance for this URL
    const playerRef = useRef<AudioPlayer>(AudioPlayer.getPlayer(url));

    // Initialize state
    const [audioState, setAudioState] = useState<AudioState>({
        ...playerRef.current.getState(),
        isPlaying: false,
        isLoading: false,
        duration: 0,
    });

    // References for animation frame management
    const animationFrameIdRef = useRef<number | null>(null);
    const lastUpdateTimeRef = useRef<number>(0);

    // Update interval (throttle to ~30fps)
    const updateInterval = 33; // milliseconds

    // Stop playback on unmount or URL change
    useEffect(() => {
        const player = playerRef.current;
        return () => {
            // Clean up on unmount or URL change
            if (player) {
                player.stop();
            }
        };
    }, []);

    // Update state from the audio player
    const updateState = useCallback(() => {
        if (!playerRef.current) return;

        const playerState = playerRef.current.getState();

        setAudioState((state) => ({
            ...state,
            ...playerState,
            isLoading: state.isLoading && playerState.duration === 0,
        }));
    }, []);

    // Start progress updates using requestAnimationFrame with throttling
    const startProgressUpdates = useCallback(() => {
        // Don't start multiple animation frames
        if (animationFrameIdRef.current !== null || !playerRef.current) return;

        const updateLoop = (timestamp: number) => {
            // Only update if we're playing and enough time has passed
            if (playerRef.current?.getState().isPlaying) {
                const elapsed = timestamp - lastUpdateTimeRef.current;

                if (elapsed >= updateInterval) {
                    updateState();
                    lastUpdateTimeRef.current = timestamp;
                }

                animationFrameIdRef.current = requestAnimationFrame(updateLoop);
            } else {
                // Ensure we update state one more time when playback stops
                updateState();
                animationFrameIdRef.current = null;
            }
        };

        animationFrameIdRef.current = requestAnimationFrame(updateLoop);
    }, [updateState]);

    // Stop progress updates
    const stopProgressUpdates = useCallback(() => {
        if (animationFrameIdRef.current !== null) {
            cancelAnimationFrame(animationFrameIdRef.current);
            animationFrameIdRef.current = null;
        }
    }, []);

    // Monitor playing state changes to start/stop updates
    useEffect(() => {
        if (audioState.isPlaying) {
            startProgressUpdates();
        } else {
            stopProgressUpdates();
        }
    }, [audioState.isPlaying, startProgressUpdates, stopProgressUpdates]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopProgressUpdates();
            if (playerRef.current) {
                playerRef.current.pause();
            }
        };
    }, [stopProgressUpdates]);

    const play = useCallback(() => {
        if (!playerRef.current) return;

        setAudioState((state) => ({
            ...state,
            isLoading: true,
        }));

        // Initialize audio with initial state if not already loaded
        // or continue playback if already loaded
        playerRef.current.play({ ...audioState });

        // Check loading status
        const checkLoadingStatus = () => {
            if (!playerRef.current) return;

            const currentState = playerRef.current.getState();

            // If duration is available, audio is loaded
            if (currentState.duration > 0) {
                setAudioState((prevState) => ({
                    ...prevState,
                    ...currentState,
                    isLoading: false,
                }));
                startProgressUpdates();
            } else {
                // Continue checking if still loading
                setTimeout(checkLoadingStatus, 100);
            }
        };

        // Start checking loading status
        checkLoadingStatus();
    }, [audioState, startProgressUpdates]);

    const pause = useCallback(() => {
        if (!playerRef.current) return;
        playerRef.current.pause();
        updateState();
    }, [updateState]);

    const toggle = useCallback(() => {
        if (!playerRef.current) return;
        if (audioState.isPlaying) {
            pause();
        } else {
            play();
        }
    }, [audioState.isPlaying, pause, play]);

    const stop = useCallback(() => {
        if (!playerRef.current) return;
        playerRef.current.stop();
        updateState();
    }, [updateState]);

    const seekTo = useCallback(
        (position: number) => {
            if (!playerRef.current) return;
            playerRef.current.seekTo(position);
            updateState();
        },
        [updateState]
    );

    const setVolume = useCallback(
        (newVolume: number) => {
            if (!playerRef.current) return;
            playerRef.current.setVolume(newVolume);
            updateState();
        },
        [updateState]
    );

    const setMute = useCallback(
        (newMuted: boolean) => {
            if (!playerRef.current) return;
            playerRef.current.setMute(newMuted);
            updateState();
        },
        [updateState]
    );

    const setLoop = useCallback(
        (newLoop: boolean) => {
            if (!playerRef.current) return;
            playerRef.current.setLoop(newLoop);
            updateState();
        },
        [updateState]
    );

    const restart = useCallback(() => {
        if (!playerRef.current) return;
        playerRef.current.seekTo(0);
        if (!audioState.isPlaying) {
            play();
        } else {
            updateState();
        }
    }, [audioState.isPlaying, play, updateState]);

    // Auto-play effect
    useEffect(() => {
        if (autoPlay && playerRef.current && !audioState.isPlaying) {
            play();
        }
    }, [autoPlay, play, audioState.isPlaying]);

    return {
        state: audioState,
        controls: { play, pause, toggle, stop, seekTo, setVolume, setMute, setLoop, restart },
    };
};

export default useAudio;
