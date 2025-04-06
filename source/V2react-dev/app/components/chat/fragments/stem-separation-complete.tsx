import React from 'react';
import { StemSeparationCompleteFragment } from '~/types/chat.types';
import { WaveformProgressPlayer } from '~/components/ui/waveform-progress-player';
import { Download } from 'lucide-react';
import { useAudioDownload } from '~/hooks/use-audio-download';

interface StemSeparationCompleteProps {
    fragment: StemSeparationCompleteFragment;
}

export const StemSeparationComplete: React.FC<StemSeparationCompleteProps> = ({ fragment }) => {
    const { vocalsAudioId, instrumentsAudioId } = fragment;
    const { data: vocalsAudioUrl } = useAudioDownload(vocalsAudioId);
    const { data: instrumentsAudioUrl } = useAudioDownload(instrumentsAudioId);

    const handleDownload = (url: string, filename: string) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
    };

    return (
        <div className="flex flex-col gap-4">
            <>
                <div className="flex gap-2">
                    {<WaveformProgressPlayer audioUrl={vocalsAudioUrl} className="h-12 bg-white" />}
                    <button
                        onClick={() =>
                            vocalsAudioUrl && handleDownload(vocalsAudioUrl, 'vocals.wav')
                        }
                    >
                        <Download className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
                <div className="flex gap-2">
                    {
                        <WaveformProgressPlayer
                            audioUrl={instrumentsAudioUrl}
                            className="h-12 bg-white"
                        />
                    }
                    <button
                        onClick={() =>
                            instrumentsAudioUrl &&
                            handleDownload(instrumentsAudioUrl, 'instruments.wav')
                        }
                    >
                        <Download className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            </>
        </div>
    );
};
