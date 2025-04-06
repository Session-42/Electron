import { useIsMobile } from '~/hooks/use-is-mobile';

interface ChatActionsProps {
    onProductionRequestCallback: () => void;
    onNewChatRequest: (message: string) => Promise<void>;
}

export function ChatActions({ onProductionRequestCallback, onNewChatRequest }: ChatActionsProps) {
    const isMobile = useIsMobile();
    const actions = [
        {
            title: `Browse ${isMobile ? '' : 'Music'}`,
            subtitle: `${isMobile ? 'Music' : '& Produce'}`,
            onClick: () => onProductionRequestCallback(),
        },
        {
            title: `${isMobile ? 'Collaborate' : "Let's collaborate & make"}`,
            subtitle: `${isMobile ? 'on Music' : 'your next song together'}`,
            onClick: () => onNewChatRequest("Let's collaborate & make your next song together"),
        },
        {
            title: `${isMobile ? 'Get Help' : 'Get guidance, help and'}`,
            subtitle: `${isMobile ? '& Guidance' : 'sounds for your project'}`,
            onClick: () => onNewChatRequest('Get guidance, help and sounds for your project'),
        },
    ];

    return (
        <div className="mt-5">
            <div className="flex space-x-0 gap-2 transition-opacity duration-300">
                {actions.map((action, index) => (
                    <button
                        key={index}
                        onClick={action.onClick}
                        className="w-[203px] h-[74px] rounded-[14px] border border-[#d9d9df] bg-[#efe9f4] px-3 py-2 font-primary text-sm flex flex-col items-center justify-center cursor-pointer transition-colors hover:bg-[#e2d7e7]"
                    >
                        <div className="text-center leading-tight mb-1 w-full">{action.title}</div>
                        <div className="text-sm text-black/80 text-center leading-tight w-full">
                            {action.subtitle}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
