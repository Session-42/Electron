import React from 'react';
import type {
    Fragment,
    TextFragment,
    ReferenceCandidatesFragment,
    ReferenceSelectionFragment,
    QuantizationCompleteFragment,
    MixingCompleteFragment,
    StemSeparationCompleteFragment,
    SongCompositionCompleteFragment,
    AudioUploadRequestFragment,
    MusicalMatchesFragment,
    LyricsWritingFragment,
} from '~/types/chat.types';
import { TextFragmentBubble } from '~/components/chat/fragments/text';
import { ReferenceCandidatesMessage } from '~/components/chat/fragments/reference-candidates';
import { AudioUploadRequestStatus } from '~/components/chat/fragments/audio-upload-request-status';
import AudioUploadStartStatus from '~/components/chat/fragments/audio-upload-start-status';
import { AudioUploadCompleteStatus } from '~/components/chat/fragments/audio-upload-complete-status';
import { ReferenceSelectionStatus } from '~/components/chat/fragments/reference-selection-status';
import { SongRenderingStatus } from '~/components/chat/fragments/song-rendering-status';
import { useSendMessage } from '~/hooks/chat/use-chat';
import { Reference } from '~/types/reference';
import { ErrorFragmentBubble } from './error';
import AudioManipulationStatus from '~/components/chat/fragments/audio-manipulation-status';
import { InChatQuantizeArtifact } from '~/components/chat/fragments/artifacts/in-chat-artifacts/in-chat-quantize-artifact';
import { useLayout } from '~/contexts/layout-context';
import { QuantizedAudioSidebar } from '~/components/sidebars/right-sidebar/quantized-audio-sidebar';
import { InChatMixedAudioArtifact } from '~/components/chat/fragments/artifacts/in-chat-artifacts/in-chat-mixed-audio-artifact';
import { InChatStemSeparationArtifacts } from '~/components/chat/fragments/artifacts/in-chat-artifacts/in-chat-stem-separation-artifact';
import {
    InstrumentalStemAudioSidebar,
    VocalsStemAudioSidebar,
} from '~/components/sidebars/right-sidebar/stems-audio-sidebar';
import { MixedAudioSidebar } from '~/components/sidebars/right-sidebar/mixed-audio-sidebar';
import { InChatComposedSongArtifact } from '~/components/chat/fragments/artifacts/in-chat-artifacts/in-chat-composed-song-artifact';
import SongCompositionStatus from './song-composition-status';
import { ComposedSongSidebar } from '~/components/sidebars/right-sidebar/composed-song-sidebar';

import { LyricsSidebar } from '~/components/sidebars/right-sidebar/lyrics-sidebar';
import { LyricsWritingMessage } from './lyrics-writing';
import { InChatProductionArtifact } from './artifacts/in-chat-artifacts/in-chat-production-artifact';
import { ProductionSidebar } from '~/components/sidebars/right-sidebar/production-sidebar';
import { InChatMusicalMatchesArtifact } from './artifacts/in-chat-artifacts/in-chat-song-reference-artifact';
import { MusicalMatchesSidebar } from '~/components/sidebars/right-sidebar/song-reference-sidebar';

interface FragmentFactoryProps {
    fragment: Fragment;
    threadId: string;
}

export const FragmentFactory: React.FC<FragmentFactoryProps> = ({ fragment, threadId }) => {
    const { sendReferenceSelection } = useSendMessage(threadId);
    const { setRightSidebarAndOpen } = useLayout();

    // Render the appropriate fragment based on type
    const renderFragment = () => {
        switch (fragment.type) {
            case 'audio_upload_request':
                return (
                    <AudioUploadRequestStatus fragment={fragment as AudioUploadRequestFragment} />
                );

            case 'audio_upload_start':
                return <AudioUploadStartStatus done={fragment.done} />;

            case 'audio_upload_complete':
                return <AudioUploadCompleteStatus />;

            case 'reference_candidates':
                return (
                    <ReferenceCandidatesMessage
                        fragment={fragment as ReferenceCandidatesFragment}
                        done={fragment.done}
                        onSelect={async (reference: Reference, optionNumber: number) => {
                            try {
                                await sendReferenceSelection(
                                    reference._id,
                                    fragment.referenceCandidatesId,
                                    optionNumber
                                );
                            } catch (err) {
                                console.error('Failed to send message:', err);
                            }
                        }}
                    />
                );

            case 'reference_selection':
                return (
                    <ReferenceSelectionStatus fragment={fragment as ReferenceSelectionFragment} />
                );

            case 'song_rendering_start':
                return <SongRenderingStatus done={fragment.done} />;

            case 'song_rendering_complete':
                return (
                    <InChatProductionArtifact
                        onClick={() => {
                            setRightSidebarAndOpen(
                                <ProductionSidebar audioId={fragment.audioId} />
                            );
                        }}
                    />
                );

            case 'quantization_start':
                return (
                    <AudioManipulationStatus
                        doneMessage={'Quantization complete'}
                        loadingMessage={'Quantizing your song'}
                        done={fragment.done}
                    />
                );

            case 'quantization_complete':
                return (
                    <InChatQuantizeArtifact
                        onClick={() => {
                            setRightSidebarAndOpen(
                                <QuantizedAudioSidebar
                                    quantizedAudio={{
                                        _id: '1',
                                        audioId: (fragment as QuantizationCompleteFragment).audioId,
                                    }}
                                />
                            );
                        }}
                    />
                );

            case 'mixing_start':
                return (
                    <AudioManipulationStatus
                        doneMessage={'Mixing complete'}
                        loadingMessage={'Mixing your song'}
                        done={fragment.done}
                    />
                );

            case 'mixing_complete':
                return (
                    <InChatMixedAudioArtifact
                        onClick={() => {
                            setRightSidebarAndOpen(
                                <MixedAudioSidebar
                                    audioId={(fragment as MixingCompleteFragment).audioId}
                                />
                            );
                        }}
                    />
                );

            case 'stem_separation_start':
                return (
                    <AudioManipulationStatus
                        doneMessage={'Stem Separation Complete'}
                        loadingMessage={'Separating Song Stems'}
                        done={fragment.done}
                    />
                );

            case 'audio_analysis_start':
                return (
                    <AudioManipulationStatus
                        doneMessage={'Audio analysis complete'}
                        loadingMessage={'Analyzing audio'}
                        done={fragment.done}
                    />
                );
            case 'stem_separation_complete':
                return (
                    <InChatStemSeparationArtifacts
                        onVocalsClick={() => {
                            setRightSidebarAndOpen(
                                <VocalsStemAudioSidebar
                                    audioId={
                                        (fragment as StemSeparationCompleteFragment).vocalsAudioId
                                    }
                                />
                            );
                        }}
                        onInstrumentalClick={() => {
                            setRightSidebarAndOpen(
                                <InstrumentalStemAudioSidebar
                                    audioId={
                                        (fragment as StemSeparationCompleteFragment)
                                            .instrumentsAudioId
                                    }
                                />
                            );
                        }}
                    />
                );

            case 'lyrics_writing':
                return (
                    <LyricsWritingMessage
                        fragment={fragment as LyricsWritingFragment}
                        onClick={() => {
                            // set the right sidebar to lyrics sidebar
                            setRightSidebarAndOpen(
                                <LyricsSidebar
                                    songName={fragment.songName}
                                    lyrics={fragment.lyrics}
                                />
                            );
                        }}
                    />
                );
            case 'song_composition_start':
                return <SongCompositionStatus done={fragment.done} />;

            case 'song_composition_complete':
                return (
                    <InChatComposedSongArtifact
                        onClick={() => {
                            setRightSidebarAndOpen(
                                <ComposedSongSidebar
                                    audioId={(fragment as SongCompositionCompleteFragment).audioId}
                                />
                            );
                        }}
                    />
                );
            case 'musical_matches':
                return (
                    <InChatMusicalMatchesArtifact
                        tracks={(fragment as MusicalMatchesFragment).tracks}
                        onClick={() => {
                            setRightSidebarAndOpen(
                                <MusicalMatchesSidebar
                                    tracks={(fragment as MusicalMatchesFragment).tracks}
                                />
                            );
                        }}
                    />
                );
            case 'error':
                return <ErrorFragmentBubble />;
            case 'text':
            default:
                return <TextFragmentBubble fragment={fragment as TextFragment} />;
        }
    };
    return renderFragment();
};
