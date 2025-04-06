import React from 'react';
import { cn } from '~/utils/utils';
import { Music, CheckCircle, Download } from 'lucide-react';
import type { SongRenderingCompleteFragment } from '~/types/chat.types';
import { WaveformProgressPlayer } from '~/components/ui/waveform-progress-player';
import { useAudioDownload } from '~/hooks/use-audio-download';

interface SongRenderingCompleteMessageProps {
    fragment: SongRenderingCompleteFragment;
    className?: string;
}

export const SongRenderingCompleteMessage: React.FC<SongRenderingCompleteMessageProps> = ({
    fragment,
    className,
}) => {
    const { data: audioUrl } = useAudioDownload(fragment.butcherId);

    const handleDownload = () => {
        if (audioUrl) {
            const link = document.createElement('a');
            link.href = audioUrl;
            link.download = `production-${fragment.butcherId}.mp3`; // You can customize the filename
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className="flex space-x-3">
            <div className={cn('flex-1 rounded-lg relative bg-[#efe9f4]', className)}>
                <div className="p-4">
                    <div className="bg-background-tertiary rounded-lg p-4 shadow-sm">
                        {/* Success header */}
                        <div className="flex items-center gap-2 mb-4">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span className="text-green-600 font-primary">
                                Production completed successfully
                            </span>
                        </div>

                        <div className="space-y-3">
                            {/* Waveform player and download button */}
                            <div className="mt-2">
                                {audioUrl ? (
                                    <div className="space-y-2">
                                        <div className="flex justify-between w-full mb-2">
                                            {/* Song details */}
                                            <div className="flex items-center gap-3">
                                                <Music className="w-5 h-5 text-text-primary" />
                                                <span className="text-sm font-primary text-text-primary">
                                                    {'New Production'}
                                                </span>
                                            </div>
                                            {/* Download button */}
                                            <button onClick={handleDownload}>
                                                <Download className="w-5 h-5 text-text-primary" />
                                            </button>
                                        </div>
                                        <WaveformProgressPlayer
                                            audioUrl={audioUrl}
                                            className="h-12"
                                        />
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SongRenderingCompleteMessage;
