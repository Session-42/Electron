import React from 'react';
import {
    Message,
    Fragment,
    SongRenderingCompleteFragment,
    QuantizationCompleteFragment,
    MixingCompleteFragment,
    StemSeparationCompleteFragment,
    SongCompositionCompleteFragment,
    MusicalMatchesFragment,
    LyricsWritingFragment,
} from '~/types/chat.types';
import { ProductionSidebar } from '~/components/sidebars/right-sidebar/production-sidebar';
import { QuantizedAudioSidebar } from '~/components/sidebars/right-sidebar/quantized-audio-sidebar';
import { MixedAudioSidebar } from '~/components/sidebars/right-sidebar/mixed-audio-sidebar';
import { VocalsStemAudioSidebar } from '~/components/sidebars/right-sidebar/stems-audio-sidebar';
import { ComposedSongSidebar } from '~/components/sidebars/right-sidebar/composed-song-sidebar';
import { MusicalMatchesSidebar } from '~/components/sidebars/right-sidebar/song-reference-sidebar';
import { LyricsSidebar } from '~/components/sidebars/right-sidebar/lyrics-sidebar';

// List of artifact types that should automatically open the sidebar
export const ARTIFACT_MESSAGE_TYPES = [
    'song_rendering_complete',
    'quantization_complete',
    'mixing_complete',
    'stem_separation_complete',
    'song_composition_complete',
    'musical_matches',
    'lyrics_writing',
];

/**
 * Checks if the last message from the assistant contains an artifact
 */
export function getArtifactFromLastMessage(messages: Message[]): Fragment | null {
    if (messages.length === 0) return null;

    // Get the last message
    const lastMessage = messages[messages.length - 1];

    // Check if it's from the assistant
    if (lastMessage.role !== 'assistant') return null;

    // Look for artifact fragments in the message
    for (const fragment of lastMessage.content) {
        if (ARTIFACT_MESSAGE_TYPES.includes(fragment.type)) {
            return fragment;
        }
    }

    return null;
}

/**
 * ArtifactSidebar Factory - Creates sidebar components based on artifact type
 */
export class ArtifactSidebarFactory {
    /**
     * Factory method that returns the appropriate sidebar component based on artifact fragment
     */
    static createSidebarForArtifact(fragment: Fragment): React.ReactNode | null {
        // Return null for unsupported fragment types
        if (!fragment || !ARTIFACT_MESSAGE_TYPES.includes(fragment.type)) {
            return null;
        }

        // Create appropriate sidebar component based on fragment type
        switch (fragment.type) {
            case 'song_rendering_complete': {
                const renderingFragment = fragment as SongRenderingCompleteFragment;
                return <ProductionSidebar audioId={renderingFragment.audioId} />;
            }

            case 'quantization_complete': {
                const quantizationFragment = fragment as QuantizationCompleteFragment;
                return (
                    <QuantizedAudioSidebar
                        quantizedAudio={{
                            _id: '1',
                            audioId: quantizationFragment.audioId,
                        }}
                    />
                );
            }

            case 'mixing_complete': {
                const mixingFragment = fragment as MixingCompleteFragment;
                return <MixedAudioSidebar audioId={mixingFragment.audioId} />;
            }

            case 'stem_separation_complete': {
                const stemFragment = fragment as StemSeparationCompleteFragment;
                // For stem separation, we'll default to vocals first
                return <VocalsStemAudioSidebar audioId={stemFragment.vocalsAudioId} />;
            }

            case 'song_composition_complete': {
                const compositionFragment = fragment as SongCompositionCompleteFragment;
                return <ComposedSongSidebar audioId={compositionFragment.audioId} />;
            }

            case 'musical_matches': {
                const musicalMatchFragment = fragment as MusicalMatchesFragment;
                return <MusicalMatchesSidebar tracks={musicalMatchFragment.tracks} />;
            }

            case 'lyrics_writing': {
                const lyricsFragment = fragment as LyricsWritingFragment;
                return (
                    <LyricsSidebar
                        songName={lyricsFragment.songName}
                        lyrics={lyricsFragment.lyrics}
                    />
                );
            }

            default:
                return null;
        }
    }
}

/**
 * Gets the appropriate sidebar component for an artifact
 * @deprecated Use ArtifactSidebarFactory.createSidebarForArtifact instead
 */
export function getSidebarComponentForArtifact(fragment: Fragment): React.ReactNode | null {
    return ArtifactSidebarFactory.createSidebarForArtifact(fragment);
}
