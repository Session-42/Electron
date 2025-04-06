import { useAudioDownload } from '~/hooks/use-audio-download';
import { GenericAudioSidebar } from './generic-audio-sidebar';

export function ComposedSongSidebar({ audioId }: { audioId: string }) {
    const details: { [key: string]: string } = {
        Style: 'Coming Soon',
    };

    const { data: audioUrl, isLoading } = useAudioDownload(audioId);

    return (
        <GenericAudioSidebar
            title="YOUR SONG"
            detailsTitle="Composed Song Details"
            details={details}
            audioUrl={audioUrl}
            isLoading={isLoading}
        />
    );
}
