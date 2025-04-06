import React from 'react';
import AvatarWithDescription from '~/components/ui/avatar-with-description';

interface PageNotFoundProps {
    title?: string;
    subtitle: string;
    buttonText?: string;
    onBackClick?: () => void;
}

const PageNotFound: React.FC<PageNotFoundProps> = ({
    title = 'Oops!',
    subtitle,
    buttonText = 'TAKE ME HOME',
    onBackClick,
}) => {
    return (
        <div className="relative flex h-screen">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="flex flex-col items-center">
                    <AvatarWithDescription name="" description="" avatarSize="lg" />
                    <p className="font-semibold mt-[25px] mb-[15px] text-text-primary text-xl">
                        {title}
                    </p>
                    <p className="font-primary text-text-primary mb-[45px] text-xl text-center">
                        {subtitle}
                    </p>
                    <button
                        onClick={onBackClick}
                        className="w-[200px] py-3 mb-[12px] rounded-[28px] text-primary bg-accent text-text-primary font-semibold transition-all flex flex-col items-center justify-center hover:from-[#7a3bb8] hover:to-[#cf0b29]"
                    >
                        <span className="text-md font-poppins-light">{buttonText}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PageNotFound;
