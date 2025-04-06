import { MessageCirclePlusIcon } from 'lucide-react';

export const NewButton = ({ onClick }: { onClick: () => void }) => {
    return (
        <button
            onClick={onClick}
            className="cursor-pointer text-md transition-transform active:scale-95 flex items-center"
        >
            <MessageCirclePlusIcon className="w-4 h-4 mr-2 stroke-accent" />
            <span className="font-primary text-sm text-accent">New Chat</span>
        </button>
    );
};
