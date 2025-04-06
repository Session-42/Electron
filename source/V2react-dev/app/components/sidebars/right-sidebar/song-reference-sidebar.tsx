import React, { useState } from 'react';
import { GenericRightSidebar } from '../generic-right-sidebar';
import Divider from '~/components/ui/divider';
import { AudioLines } from 'lucide-react';
import { useTheme } from '~/contexts/theme-context';

interface Track {
    spotifyId: string;
    title: string;
}

interface MusicalMatchesSidebarProps {
    tracks: Track[];
    message?: string;
}

export const MusicalMatchesSidebar: React.FC<MusicalMatchesSidebarProps> = ({
    tracks,
    message = 'These song references can inspire your creative work. Listen for elements like rhythm, melody, and production style.',
}) => {
    // Get the current theme
    const { mode } = useTheme();

    // Track loading state for each iframe
    const [loadedTracks, setLoadedTracks] = useState<Record<string, boolean>>({});

    const handleIframeLoad = (spotifyId: string) => {
        setLoadedTracks((prev) => ({
            ...prev,
            [spotifyId]: true,
        }));
    };

    // Set Spotify theme based on app theme (theme=0 for dark, theme=1 for light)
    const spotifyTheme = mode === 'dark' ? '0' : '1';

    return (
        <GenericRightSidebar
            title="SONG REFERENCES"
            icon={<AudioLines size={20} strokeWidth={2} className="text-accent" />}
            showCloseButton
        >
            <Divider className="px-4 pt-4" />

            {tracks.length > 0 ? (
                <div className="pt-6 px-4 flex flex-col h-full overflow-y-auto gap-4 scrollbar-hide">
                    {tracks.map((track) => (
                        <div key={track.spotifyId} className="rounded-lg font-primary">
                            <div className="relative">
                                {/* Skeleton */}
                                {!loadedTracks[track.spotifyId] && (
                                    <div className="absolute inset-0 bg-background-tertiary rounded-lg animate-pulse flex items-center justify-center">
                                        <AudioLines size={32} className="text-background-hover" />
                                    </div>
                                )}

                                {/* Actual iframe */}
                                <iframe
                                    src={`https://open.spotify.com/embed/track/${track.spotifyId}?theme=${spotifyTheme}`}
                                    height="80"
                                    frameBorder="0"
                                    allowTransparency={true}
                                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                    title={`Spotify embed: ${track.title}`}
                                    className={`w-full transition-opacity duration-300 rounded-lg ${!loadedTracks[track.spotifyId] ? 'opacity-0' : 'opacity-100'}`}
                                    onLoad={() => handleIframeLoad(track.spotifyId)}
                                ></iframe>
                            </div>
                        </div>
                    ))}

                    {/* Message */}
                    {message && (
                        <div className="mt-1 mb-4">
                            <div className="bg-background-secondary rounded-lg p-4">
                                <h3 className="text-sm font-semibold mb-2">
                                    About These References
                                </h3>
                                <p className="text-sm text-text-secondary">{message}</p>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center flex-grow">
                    <p className="text-text-muted">No song references available</p>
                </div>
            )}
        </GenericRightSidebar>
    );
};

export default MusicalMatchesSidebar;
