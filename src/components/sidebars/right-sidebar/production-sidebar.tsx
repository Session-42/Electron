import { useAudioDownload } from '~/hooks/use-audio-download';
import { GenericAudioSidebar } from './generic-audio-sidebar';

export function ProductionSidebar({ audioId }: { audioId: string }) {
    const details = {
        'Song Name': 'Coming Soon',
        Genre: 'Coming Soon',
        BPM: 'Coming Soon',
        'Artist Name': 'Coming Soon',
    };

    const { data: audioUrl, isLoading } = useAudioDownload(audioId);

    return (
        <GenericAudioSidebar
            title="YOUR PRODUCTION"
            detailsTitle="Production Details"
            details={details}
            audioUrl={audioUrl}
            isLoading={isLoading}
        />
    );
}
