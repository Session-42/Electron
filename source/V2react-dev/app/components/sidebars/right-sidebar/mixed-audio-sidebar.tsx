import { useAudioDownload } from '~/hooks/use-audio-download';
import { GenericAudioSidebar } from './generic-audio-sidebar';

export function MixedAudioSidebar({ audioId }: { audioId: string }) {
    const details: { [key: string]: string } = {
        Length: 'Coming Soon',
        Key: 'Coming Soon',
    };

    const { data: audioUrl, isLoading } = useAudioDownload(audioId);

    return (
        <GenericAudioSidebar
            title="YOUR AUDIO"
            detailsTitle="Mixed Audio Details"
            details={details}
            audioUrl={audioUrl}
            isLoading={isLoading}
        />
    );
}
