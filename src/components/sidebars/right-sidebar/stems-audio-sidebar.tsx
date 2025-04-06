import { useAudioDownload } from '~/hooks/use-audio-download';
import { GenericAudioSidebar } from './generic-audio-sidebar';

export function InstrumentalStemAudioSidebar({ audioId }: { audioId: string }) {
    const details: { [key: string]: string } = {
        Length: 'Coming Soon',
        Key: 'Coming Soon',
    };

    const { data: audioUrl, isLoading } = useAudioDownload(audioId);

    return (
        <GenericAudioSidebar
            title="YOUR INSTRUMENTALS"
            detailsTitle="Instrumental Track Details"
            details={details}
            audioUrl={audioUrl}
            isLoading={isLoading}
        />
    );
}

export function VocalsStemAudioSidebar({ audioId }: { audioId: string }) {
    const details: { [key: string]: string } = {
        Length: 'Coming Soon',
        Key: 'Coming Soon',
    };

    const { data: audioUrl, isLoading } = useAudioDownload(audioId);

    return (
        <GenericAudioSidebar
            title="YOUR VOCALS"
            detailsTitle="Vocals Track Details"
            details={details}
            audioUrl={audioUrl}
            isLoading={isLoading}
        />
    );
}
