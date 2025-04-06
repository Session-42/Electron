import groupBy from 'lodash.groupby';
import {
    Fragment,
    MediaFragment,
    Message,
    MixingFragment,
    QuantizationFragment,
    ReferenceFragment,
    AudioAnalysisFragment,
    SongRenderingFragment,
    StemSeparationFragment,
    SongCompositionFragment,
    AudioUploadFragment,
} from '~/types/chat.types';

interface ChatState {
    pendingAudioUploads: AudioUploadFragment[];
    pendingSongRenderings: SongRenderingFragment[];
    audioUploads: Record<string, AudioUploadFragment[]>;
    songRenderings: Record<string, SongRenderingFragment[]>;
    references: Record<string, ReferenceFragment[]>;
    quantizations: Record<string, QuantizationFragment[]>;
    pendingQuantizations: QuantizationFragment[];
    mixings: Record<string, MixingFragment[]>;
    pendingMixings: MixingFragment[];
    stemSeparations: Record<string, StemSeparationFragment[]>;
    pendingStemSeparations: StemSeparationFragment[];
    songCompositions: Record<string, SongCompositionFragment[]>;
    pendingSongCompositions: SongCompositionFragment[];
    analysis: Record<string, AudioAnalysisFragment[]>;
    pendingAnalysis: AudioAnalysisFragment[];
}

export class MessageProcessor {
    private readonly fragmentGuards = {
        isAudioUpload: (fragment: Fragment): fragment is AudioUploadFragment =>
            'audioUploadRequestId' in fragment,
        isSongRendering: (fragment: Fragment): fragment is SongRenderingFragment =>
            'taskId' in fragment && fragment.type.startsWith('song_rendering'),
        isReference: (fragment: Fragment): fragment is ReferenceFragment =>
            'referenceCandidatesId' in fragment,
        isQuantization: (fragment: Fragment): fragment is QuantizationFragment =>
            fragment.type.startsWith('quantization'),
        isMixing: (fragment: Fragment): fragment is MixingFragment =>
            fragment.type.startsWith('mixing'),
        isStemSeparation: (fragment: Fragment): fragment is StemSeparationFragment =>
            fragment.type.startsWith('stem_separation'),
        isSongComposition: (fragment: Fragment): fragment is SongCompositionFragment =>
            fragment.type.startsWith('song_composition'),
        isAudioAnalysis: (fragment: Fragment): fragment is AudioAnalysisFragment =>
            fragment.type.startsWith('audio_analysis'),
    };

    private getFragments(messages: Message[]): MediaFragment[] {
        return messages
            .map((message) => message.content)
            .flat()
            .filter((fragment): fragment is MediaFragment => fragment.type !== 'text');
    }

    private processFragmentGroup<T extends MediaFragment>(
        fragments: MediaFragment[],
        filterFn: (fragment: Fragment) => fragment is T,
        groupByKey: keyof T,
        taskIdsWithErrors: Set<string>
    ) {
        const filteredFragments = fragments.filter(filterFn);
        const groupedById = groupBy(filteredFragments, (fragment) =>
            String(fragment[groupByKey])
        ) as Record<string, T[]>;

        const pendingFragments = Object.entries(groupedById)
            .filter(([_, frags]) => {
                if (!Array.isArray(frags)) return false;
                // Avoid tasks with errors.
                if (frags.some((frag) => 'taskId' in frag && taskIdsWithErrors.has(frag.taskId))) {
                    return false;
                }

                return frags.length === 1;
            })
            .map(([_, frags]) => frags[frags.length - 1]);

        return { groupedById, pendingFragments };
    }

    public process(messages: Message[]): ChatState {
        const fragments = this.getFragments(messages);

        const errorFragments = fragments.filter((fragment) => fragment.type === 'error');

        const taskIdsWithErrors = new Set(
            errorFragments
                .filter((fragment) => 'taskId' in fragment)
                .map((fragment) => fragment.taskId)
        );

        // Process each type of fragment
        const audioResults = this.processFragmentGroup(
            fragments,
            this.fragmentGuards.isAudioUpload,
            'audioUploadRequestId',
            taskIdsWithErrors
        );

        const songResults = this.processFragmentGroup(
            fragments,
            this.fragmentGuards.isSongRendering,
            'taskId',
            taskIdsWithErrors
        );

        const referenceResults = this.processFragmentGroup(
            fragments,
            this.fragmentGuards.isReference,
            'referenceCandidatesId',
            taskIdsWithErrors
        );

        const quantizationResults = this.processFragmentGroup(
            fragments,
            this.fragmentGuards.isQuantization,
            'taskId',
            taskIdsWithErrors
        );

        const mixingResults = this.processFragmentGroup(
            fragments,
            this.fragmentGuards.isMixing,
            'taskId',
            taskIdsWithErrors
        );

        const stemSeparationResults = this.processFragmentGroup(
            fragments,
            this.fragmentGuards.isStemSeparation,
            'taskId',
            taskIdsWithErrors
        );

        const songCompositionResults = this.processFragmentGroup(
            fragments,
            this.fragmentGuards.isSongComposition,
            'taskId',
            taskIdsWithErrors
        );

        const audioAnalysisResults = this.processFragmentGroup(
            fragments,
            this.fragmentGuards.isAudioAnalysis,
            'taskId',
            taskIdsWithErrors
        );

        // Return the new chat state
        return {
            audioUploads: audioResults.groupedById,
            pendingAudioUploads: audioResults.pendingFragments,
            songRenderings: songResults.groupedById,
            pendingSongRenderings: songResults.pendingFragments,
            references: referenceResults.groupedById,
            quantizations: quantizationResults.groupedById,
            pendingQuantizations: quantizationResults.pendingFragments,
            mixings: mixingResults.groupedById,
            pendingMixings: mixingResults.pendingFragments,
            stemSeparations: stemSeparationResults.groupedById,
            pendingStemSeparations: stemSeparationResults.pendingFragments,
            songCompositions: songCompositionResults.groupedById,
            pendingSongCompositions: songCompositionResults.pendingFragments,
            analysis: audioAnalysisResults.groupedById,
            pendingAnalysis: audioAnalysisResults.pendingFragments,
        };
    }
}
