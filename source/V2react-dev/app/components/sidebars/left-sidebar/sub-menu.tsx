import { SubMenuItem } from './sub-menu-item';

export const SubMenu = ({
    isOpen,
    onProduceSong,
    onNewChat,
}: {
    isOpen: boolean;
    onProduceSong: () => void;
    onNewChat: () => void;
}) => (
    <div
        className={`overflow-hidden transition-all duration-200 ease-in-out ${
            isOpen ? 'max-h-[200px] opacity-100' : 'max-h-0 opacity-0'
        }`}
    >
        <SubMenuItem icon="/assets/lyrics_artifact_colored.svg" text="Chat" onClick={onNewChat} />
    </div>
);
