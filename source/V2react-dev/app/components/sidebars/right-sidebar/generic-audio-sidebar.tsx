import { SlidersHorizontal, AlertCircle, Loader2 } from 'lucide-react';
import { GenericRightSidebar } from '../generic-right-sidebar';
import Divider from '~/components/ui/divider';
import WaveformAudioPlayer from '~/components/ui/waveform-audio-player';
import { Mixpanel } from '~/utils/mixpanelService';
import { getUserId } from '~/utils/jwt';

interface GenericAudioSidebarProps {
    title: string;
    detailsTitle: string;
    details: { [key: string]: string };
    audioUrl: string | undefined;
    isLoading: boolean;
}

export function GenericAudioSidebar({
    title,
    detailsTitle,
    details,
    audioUrl,
    isLoading,
}: GenericAudioSidebarProps) {
    const handleDownload = () => {
        if (!audioUrl) return;

        // Register event for downloading
        try {
            const userId = getUserId();
            if (userId) {
                Mixpanel.track(userId, 'Download Song Button Pressed', {
                    audioUrl: audioUrl,
                });
            }
        } catch (error) {
            console.error('Failed to track download event:', error);
        }

        const link = document.createElement('a');
        link.href = audioUrl;
        link.download = 'audio.mp3';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <GenericRightSidebar title={title} icon="/assets/production.svg" showCloseButton>
            <Divider className="px-4 pt-7 pb-7" />
            <div className="pr-4 pl-4">
                {isLoading ? (
                    <div className="bg-background-tertiary rounded-[14px] shadow-[0_2px_4px_0_rgba(0,0,0,0.07)]">
                        <div className="h-12 flex items-center justify-center">
                            <Loader2 className="w-4 h-4 text-text-primary animate-spin" />
                        </div>
                    </div>
                ) : audioUrl ? (
                    <>
                        <div className="bg-background-tertiary rounded-[14px] shadow-[0_2px_4px_0_rgba(0,0,0,0.07)]">
                            <WaveformAudioPlayer audioUrl={audioUrl} className="h-12" />
                        </div>
                        <div className="bg-background-tertiary mt-3 rounded-[14px] shadow-[0_2px_4px_0_rgba(0,0,0,0.07)] p-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                                    <h2 className="text-sm font-semibold text-text-primary">
                                        {detailsTitle}
                                    </h2>
                                </div>
                                <button
                                    onClick={handleDownload}
                                    className="flex items-center mr-2 w-2 h-5 text-text-primary hover:text-accent transition-colors"
                                    title="Download"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 9 12"
                                        className="w-full h-full"
                                    >
                                        <path
                                            d="M4.5 0v8.4M0 5.4l4.5 3 4.5-3"
                                            stroke="currentColor"
                                            strokeWidth="1.2"
                                            fill="none"
                                        />
                                        <path
                                            d="M0 10.8h9"
                                            stroke="currentColor"
                                            strokeWidth="1.2"
                                        />
                                    </svg>
                                </button>
                            </div>
                            {Object.entries(details).map(([key, value]) => (
                                <div key={key}>
                                    <Divider className="mt-[17px] mb-[17px] h-[1.5px] bg-border-secondary dark:bg-border-hover" />
                                    <div className="text-sm font-semibold mb-1">{key}</div>
                                    <div className="text-sm font-primary text-text-primary">
                                        {value}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-red-500 py-4 font-primary flex flex-col items-center gap-2">
                            <AlertCircle className="w-7 h-7 mb-1" />
                            <span>Failed to load audio</span>
                        </div>
                    </div>
                )}
            </div>
        </GenericRightSidebar>
    );
}
