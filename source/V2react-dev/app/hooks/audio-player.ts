import { Howl } from 'howler';

interface AudioState {
    isPlaying?: boolean;
    seek?: number;
    volume?: number;
    loop?: boolean;
    muted?: boolean;
}

class AudioPlayer {
    private url: string;
    private sound: Howl | null = null;
    private isPlaying: boolean = false;
    private duration: number = 0;
    private volume: number = 1.0;
    private loop: boolean = false;
    private muted: boolean = false;
    private followsExclusivePolicy: boolean = true;

    // Registry of audio players by URL
    private static players: Map<string, AudioPlayer> = new Map();

    // Track exclusive players (ones that follow the one-at-a-time policy)
    private static exclusivePlayers: Set<AudioPlayer> = new Set();

    /**
     * Get or create an AudioPlayer instance for a specific URL
     * @param {string} url - URL of the audio file
     * @returns {AudioPlayer} Instance of AudioPlayer for the URL
     */
    public static getPlayer(url: string): AudioPlayer {
        if (!this.players.has(url)) {
            const player = new AudioPlayer(url);
            this.players.set(url, player);
            this.exclusivePlayers.add(player); // By default, all players follow exclusive policy
        }
        return this.players.get(url)!;
    }

    constructor(url: string) {
        this.url = url;
    }

    /**
     * Update player state based on provided properties
     * @param {AudioState} state - The state properties to update
     */
    private updateState(state: AudioState): void {
        if (!this.sound || !state) return;

        if (state.loop !== undefined) {
            this.loop = state.loop;
            this.sound.loop(state.loop);
        }

        if (state.volume !== undefined) {
            this.volume = state.volume;
            this.updateVolume();
        }

        if (state.muted !== undefined) {
            this.muted = state.muted;
            this.updateVolume();
        }

        if (state.seek !== undefined && state.seek <= this.duration) {
            this.sound.seek(state.seek);
        }
    }

    /**
     * Update the volume based on current volume and mute settings
     */
    private updateVolume(): void {
        if (this.sound) {
            this.sound.volume(this.muted ? 0 : this.volume);
        }
    }

    /**
     * Enforce exclusive playback policy
     */
    private enforceExclusivePolicy(): void {
        if (this.followsExclusivePolicy) {
            AudioPlayer.exclusivePlayers.forEach((player) => {
                if (player !== this && player.isPlaying) {
                    player.pause();
                }
            });
        }
    }

    public play(state: AudioState = {}): void {
        const mergedState: AudioState = {
            isPlaying: false,
            seek: 0,
            volume: 1.0,
            loop: false,
            muted: false,
            ...state,
        };

        // If sound is already initialized, just adjust parameters and play
        if (this.sound) {
            this.updateState(mergedState);
            this.startPlayback();
            return;
        }

        // Create a new Howl instance if it doesn't exist
        this.sound = new Howl({
            src: [this.url],
            html5: true, // Force HTML5 Audio to handle streaming audio better
            preload: true,
            autoplay: false, // We'll explicitly call play after setup
            loop: mergedState.loop || this.loop,
            volume: mergedState.muted ? 0 : mergedState.volume || this.volume,
            format: ['wav', 'mp3'],
            onload: () => {
                this.duration = this.sound!.duration();

                // Update state properties
                this.updateState(mergedState);

                // Play immediately after loading
                this.startPlayback();
            },
            onplay: () => {
                this.isPlaying = true;
            },
            onpause: () => {
                this.isPlaying = false;
            },
            onstop: () => {
                this.isPlaying = false;
            },
            onend: () => {
                if (!this.loop) {
                    this.isPlaying = false;
                }
            },
        });
    }

    private startPlayback(): void {
        this.enforceExclusivePolicy();
        this.sound!.play();
        this.isPlaying = true;
    }

    public getState(): {
        url: string | null;
        isPlaying: boolean;
        seek: number;
        duration: number;
        volume: number;
        loop: boolean;
        muted: boolean;
    } {
        return {
            url: this.url,
            isPlaying: this.isPlaying,
            seek: this.sound ? (this.sound.seek() as number) : 0,
            duration: this.duration,
            volume: this.volume,
            loop: this.loop,
            muted: this.muted,
        };
    }

    public pause(): void {
        if (this.sound) {
            this.sound.pause();
            this.isPlaying = false;
        }
    }

    public stop(): void {
        if (this.sound) {
            this.sound.stop();
            this.isPlaying = false;
        }
    }

    public setVolume(volume: number): void {
        this.volume = volume;
        this.updateVolume();
    }

    public setMute(muted: boolean): void {
        this.muted = muted;
        this.updateVolume();
    }

    public setLoop(loop: boolean): void {
        this.loop = loop;
        if (this.sound) {
            this.sound.loop(loop);
        }
    }

    public seekTo(position: number): void {
        if (this.sound && position >= 0 && (this.duration === 0 || position <= this.duration)) {
            this.sound.seek(position);
        }
    }
}

export default AudioPlayer;
