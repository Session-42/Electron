import { GradientText } from '~/components/ui/gradient-text';

export const SubMenuItem = ({
    icon,
    text,
    onClick,
}: {
    icon: string;
    text: string;
    onClick: () => void;
}) => (
    <button
        onClick={onClick}
        className="flex items-center space-x-3 text-left h-[35px] font-primary text-md font-normal leading-[1.2] transition-all pl-[15px] pt-4 group"
    >
        <img src={icon} alt={text} className="w-4 h-4" />
        <div className="w-full">
            <GradientText hoverGradient={true}>{text}</GradientText>
        </div>
    </button>
);
