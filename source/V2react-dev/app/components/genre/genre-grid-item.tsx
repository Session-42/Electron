import { Play, Pause } from 'lucide-react';
import type { Reference } from '~/types/reference';
import ResponsiveImage from '../ui/responsive-image';
import { useAudio } from '~/hooks/use-audio';
import { useEffect } from 'react';

interface GenreGridItemProps {
    reference: Reference;
    isPlaying?: boolean;
    disabled?: boolean;
    onPlayToggle?: () => void;
    onProduce: () => void;
}

const GenreGridItem = ({ reference, disabled = false, onProduce }: GenreGridItemProps) => {
    const { state, controls } = useAudio(reference.song.audio_file_s3_path);

    const handlePlayClick = (e: React.MouseEvent | React.TouchEvent) => {
        // Prevent default behavior to avoid double-firing
        e.preventDefault();

        if (state.isPlaying) {
            controls.pause();
        } else {
            controls.play();
        }
    };

    useEffect(() => {
        if (disabled) {
            controls.pause();
        }
    }, [disabled]);

    const removeMP3Extension = (str: string) => str.replace(/\.mp3$/i, '');

    return (
        <div className="w-[291px] h-[105px] bg-background-primary border border-border-secondary rounded-[16px] relative">
            {/* Album Image */}
            <div className="absolute left-[9.2px] top-1/2 -translate-y-1/2">
                <div className="w-[120px] h-[87.7px] mr-[7.8px] mb-[0.8px] rounded-[18px] overflow-hidden relative">
                    <div className="absolute inset-0 [&>div]:!h-full [&>div]:!aspect-auto [&>div>img]:!object-cover [&>div>img]:!w-full [&>div>img]:!h-full [&>div>img]:!object-center [&>div>img]:!scale-[1.6]">
                        <ResponsiveImage
                            imageUrl={reference.image_url}
                            altText={reference.song.song_name}
                        />
                    </div>
                </div>
            </div>

            {/* Track Info */}
            <div className="absolute left-[146.2px] top-[-6px] flex flex-col">
                <h3 className="w-[132px] h-[19px] mr-[21.7px] text-[13.2px] leading-[1.2] font-primary font-[600] not-italic tracking-normal text-left text-text-primary overflow-hidden whitespace-nowrap text-ellipsis">
                    {removeMP3Extension(reference.song.song_name)}
                </h3>
                <p className="w-[133px] h-[15px] mr-[2.7px] mt-[-6px] text-[10.2px] leading-[1.2] font-primary text-text-muted overflow-hidden whitespace-nowrap text-ellipsis">
                    HitCraft
                </p>
            </div>

            {/* Play Button */}
            <button
                onClick={handlePlayClick}
                disabled={disabled || state.isLoading}
                className="absolute left-[146.2px] bottom-[8px] w-[33.8px] h-[33.7px] border border-border-secondary bg-background-tertiary rounded-full flex items-center justify-center disabled:opacity-50 hover:border-accent hover:text-accent"
                aria-label={state.isPlaying ? 'Pause' : 'Play'}
            >
                {state.isLoading ? (
                    <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                ) : state.isPlaying ? (
                    <Pause className="w-4 h-4 text-text-primary fill-text-primary" />
                ) : (
                    <Play className="w-4 h-4 ml-0.5 text-text-primary fill-text-primary" />
                )}
            </button>

            {/* Select Button */}
            {/* Aviv i know it's shitty and it's not relative but let it go now. it's perfect on the screen  */}
            <button
                onClick={() => onProduce()}
                disabled={disabled}
                className="absolute left-[185px] bottom-[9px] w-[97px] h-[34px] border border-border-secondary bg-background-tertiary rounded-[17px] text-sm font-semibold flex items-center justify-center text-text-primary hover:border-accent transition-colors disabled:opacity-50 [&>span]:h-[19px]"
            >
                <span>Select</span>
            </button>
        </div>
    );
};

export default GenreGridItem;
