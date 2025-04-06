import { QuantizedAudio } from '~/utils/api';
import { useAudioDownload } from '~/hooks/use-audio-download';
import { GenericAudioSidebar } from './generic-audio-sidebar';

export function QuantizedAudioSidebar({ quantizedAudio }: { quantizedAudio: QuantizedAudio }) {
    const details = {
        BPM: quantizedAudio.bpm ? String(quantizedAudio.bpm) : 'Coming Soon',
        'Confidence Level (%)': quantizedAudio.confidence
            ? String(quantizedAudio.confidence)
            : 'Coming Soon',
    };

    const { data: audioUrl, isLoading } = useAudioDownload(quantizedAudio.audioId);

    return (
        <GenericAudioSidebar
            title="YOUR AUDIO"
            detailsTitle="Quantized Audio Details"
            details={details}
            audioUrl={audioUrl}
            isLoading={isLoading}
        />
    );
}
