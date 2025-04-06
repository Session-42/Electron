// Base Fragment interface
export interface BaseFragment {
    type: string;

    // Rendering properties
    done?: boolean;
    messageId?: string;
    threadId?: string;
}

export interface ErrorFragment extends BaseFragment {
    type: 'error';
    error: string;
    taskId: string;
}

export interface AudioManipulationFragment extends BaseFragment {
    audioId: string;
}

// Text Fragment
export interface TextFragment extends BaseFragment {
    type: 'text';
    text: string;
}

// Audio Upload Fragment Base
export interface AudioUploadFragmentBase extends BaseFragment {
    taskId: string;
    audioUploadRequestId: string;
}

// Audio Upload Request Fragment
export interface AudioUploadRequestFragment extends AudioUploadFragmentBase {
    type: 'audio_upload_request';
    fileName?: string;
    postProcess?: string;
    // Rendering properties
    done?: boolean;
}

// Audio Upload Start Fragment
export interface AudioUploadStartFragment extends AudioUploadFragmentBase {
    type: 'audio_upload_start';
    fileName?: string;

    // Rendering properties
    done?: boolean;
}

// Audio Upload Complete Fragment
export interface AudioUploadCompleteFragment extends AudioUploadFragmentBase {
    type: 'audio_upload_complete';
    audioId: string;
    songName?: string;
}

export interface AudioAnalysisFragmentBase extends BaseFragment {
    taskId: string;
    audioId: string;
}

// Audio Analysis Start Fragment
export interface AudioAnalysisStartFragment extends AudioAnalysisFragmentBase {
    type: 'audio_analysis_start';

    // Rendering properties
    done?: boolean;
}

// Audio Analysis Complete Fragment
export interface AudioAnalysisCompleteFragment extends AudioAnalysisFragmentBase {
    type: 'audio_analysis_complete';
}

// Audio Analysis Fragment
export type AudioAnalysisFragment = AudioAnalysisStartFragment | AudioAnalysisCompleteFragment;

// Reference Base Fragment
export interface ReferenceBaseFragment extends BaseFragment {
    referenceCandidatesId: string;
}

// Reference Candidates Fragment
export interface ReferenceCandidatesFragment extends ReferenceBaseFragment {
    type: 'reference_candidates';
    references: string[];

    // Rendering properties
    done?: boolean;
}

// Reference Selection Fragment
export interface ReferenceSelectionFragment extends ReferenceBaseFragment {
    type: 'reference_selection';
    referenceId: string;
    optionNumber: number;
}

// Song Rendering Base Fragment
export interface SongRenderingBaseFragment extends BaseFragment {
    taskId: string;
    audioId: string;
}

// Song Rendering Start Fragment
export interface SongRenderingStartFragment extends SongRenderingBaseFragment {
    type: 'song_rendering_start';

    // Rendering properties
    done?: boolean;
}

// Song Rendering Complete Fragment
export interface SongRenderingCompleteFragment extends SongRenderingBaseFragment {
    type: 'song_rendering_complete';
    butcherId: string;
    audioId: string;
}

// Quantization Base Fragment
export interface QuantizationBaseFragment extends AudioManipulationFragment {
    taskId: string;
}

// Quantization Start Fragment
export interface QuantizationStartFragment extends QuantizationBaseFragment {
    type: 'quantization_start';

    // Rendering properties
    done?: boolean;
}

// Quantization Complete Fragment
export interface QuantizationCompleteFragment extends QuantizationBaseFragment {
    type: 'quantization_complete';
}

// Mixing Base Fragment
export interface MixingBaseFragment extends AudioManipulationFragment {
    taskId: string;
}

// Mixing Start Fragment
export interface MixingStartFragment extends MixingBaseFragment {
    type: 'mixing_start';

    // Rendering properties
    done?: boolean;
}

// Mixing Complete Fragment
export interface MixingCompleteFragment extends MixingBaseFragment {
    type: 'mixing_complete';
}

// Stem Separation Start Fragment
export interface StemSeparationStartFragment extends AudioManipulationFragment {
    type: 'stem_separation_start';

    taskId: string;

    // Rendering properties
    done?: boolean;
}

// Stem Separation Complete Fragment
export interface StemSeparationCompleteFragment extends BaseFragment {
    type: 'stem_separation_complete';
    taskId: string;
    vocalsAudioId: string;
    instrumentsAudioId: string;
}

export interface SongCompositionBaseFragment extends BaseFragment {
    taskId: string;
}

export interface SongCompositionStartFragment extends SongCompositionBaseFragment {
    type: 'song_composition_start';
    done?: boolean;
}

export interface SongCompositionCompleteFragment extends SongCompositionBaseFragment {
    type: 'song_composition_complete';
    audioId: string;
}

// Union type for quantization fragments
export type MixingFragment = MixingStartFragment | MixingCompleteFragment;

// Union type for stem separation fragments
export type StemSeparationFragment = StemSeparationStartFragment | StemSeparationCompleteFragment;

export type QuantizationFragment = QuantizationStartFragment | QuantizationCompleteFragment;

// Union type for audio upload fragments
export type AudioUploadFragment =
    | AudioUploadRequestFragment
    | AudioUploadStartFragment
    | AudioUploadCompleteFragment;

// Union type for reference fragments
export type ReferenceFragment = ReferenceSelectionFragment | ReferenceCandidatesFragment;

// Union type for song rendering fragments
export type SongRenderingFragment = SongRenderingStartFragment | SongRenderingCompleteFragment;

// Union type for Song Composition fragments
export type SongCompositionFragment =
    | SongCompositionStartFragment
    | SongCompositionCompleteFragment;

// Lyrics Writing Fragment
export interface LyricsWritingFragment extends BaseFragment {
    type: 'lyrics_writing';
    lyrics: string;
    songName: string;
}

// Song Reference Fragment
export interface MusicalMatchesFragment extends BaseFragment {
    type: 'musical_matches';
    tracks: {
        spotifyId: string;
        title: string;
    }[];
}

// Union type for media fragments
export type MediaFragment =
    | AudioUploadFragment
    | ReferenceFragment
    | SongRenderingFragment
    | QuantizationFragment
    | MixingFragment
    | StemSeparationFragment
    | SongCompositionFragment
    | MusicalMatchesFragment
    | LyricsWritingFragment
    | ErrorFragment
    | AudioAnalysisFragment;

// Union type for all possible fragments
export type Fragment = TextFragment | MediaFragment;

// Message interface
export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: Fragment[];
    timestamp: Date;
}

// Processing status type
export type ProcessingStatus = 'idle' | 'uploading' | 'processing' | 'complete' | 'error';

// Content type
export type Content = Fragment[];

// Chat state
export interface ChatState {
    messages: Message[];
    title: string;
    isLoading: boolean;
}

// Thread details with ID
export interface ThreadDetailsWithId extends ThreadDetails {
    threadId: string;
}

// Thread details interface
export interface ThreadDetails {
    title: string;
    artistId: string;
    artistName: string;
    lastMessageAt: string;
}
