import SimpleProgressPlayer from '../../ui/progress-player';
import { TruncatedText } from '../../ui/truncated-text';
import { AudioDocument } from '~/utils/api';
import { ProductionWithAudio } from '~/types/audio.types';

// Header component for the sidebar
export const SidebarHeader = () => (
    <div className="h-24 mx-auto w-72 flex items-center justify-center">
        <div className="flex items-center gap-2.5">
            <img src="/assets/productions.svg" alt="Productions" className="w-4 h-4 -mt-px" />
            <h1 className="text-base tracking-wide">
                <span className="font-semibold">RECENT </span>
                <span className="font-primary">PRODUCTIONS</span>
            </h1>
        </div>
    </div>
);

// Divider line between header and content
export const Divider = () => <div className="mx-2 h-px bg-black/5" />;

// Loading spinner for data fetching state
export const LoadingSpinner = () => (
    <div className="flex justify-center py-4">
        <div className="w-8 h-8 border-2 border-t-transparent border-[#8a44c8] rounded-full animate-spin" />
    </div>
);

// Error message for failed data fetching
export const ErrorMessage = () => (
    <div className="text-center text-red-600 dark:text-red-400 py-4">
        Failed to load productions
    </div>
);

// Empty state when no productions match search
export const EmptyState = () => (
    <div className="text-center text-gray-500 py-4 font-primary text-sm">No productions found</div>
);

// Interface for the ProductionCard props
interface ProductionCardProps {
    production: ProductionWithAudio;
    onDownload: (audioUrl: string, filename: string) => void;
}

// Production card component for individual items in the list
export const ProductionCard = ({ production, onDownload }: ProductionCardProps) => {
    const songName = production.fileName || 'Untitled';
    const genre = production.genre || production.musicalAnalysis?.time_signature || 'Unknown';

    return (
        <div className="w-full bg-background-tertiary shadow-[0_2px_4px_0_rgba(0,0,0,0.07)] rounded-2xl p-2">
            <div className="flex items-center gap-4">
                {/* Album Image */}
                <div className="flex-shrink-0">
                    <img
                        src={production.referenceImageUrl || '/assets/song.svg'}
                        srcSet={
                            production.referenceImageUrl
                                ? `${production.referenceImageUrl} 1x, 
                    ${production.referenceImageUrl} 2x, 
                    ${production.referenceImageUrl} 3x`
                                : undefined
                        }
                        alt={songName}
                        className="w-20 object-cover rounded-2xl"
                    />
                </div>

                {/* Content Column */}
                <div className="flex flex-col flex-grow justify-between h-22">
                    {/* Top row with track info and download button */}
                    <div className="flex justify-between items-start">
                        {/* Track Info with truncation */}
                        <div className="flex flex-col">
                            <TruncatedText
                                text={songName}
                                maxLength={20}
                                className="w-32 h-5 mb-0.5 text-sm leading-tight font-semibold text-text-primary overflow-hidden whitespace-nowrap text-ellipsis"
                            />
                            <p className="w-32 h-4 -mt-0.5 mb-2 text-[10px] leading-tight font-primary text-text-primary overflow-hidden whitespace-nowrap text-ellipsis">
                                {genre}
                            </p>
                        </div>

                        {/* Download Button */}
                        <button
                            onClick={() => onDownload(production.audioUrl, `${songName}.mp3`)}
                            className="flex items-center w-2 h-5 mr-2 text-text-primary hover:text-accent transition-colors"
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
                                <path d="M0 10.8h9" stroke="currentColor" strokeWidth="1.2" />
                            </svg>
                        </button>
                    </div>

                    {/* Audio Player */}
                    <SimpleProgressPlayer
                        audioUrl={production.audioUrl}
                        className="bg-background-tertiary"
                    />
                </div>
            </div>
        </div>
    );
};
