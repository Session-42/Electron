import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Artist } from '~/types/artist';
import { useAuth } from '~/contexts/auth-context';
import { getTimeOfDay } from '~/utils/time';
import AvatarWithDescription from '../ui/avatar-with-description';
import MessageInputBar from './message-input-bar';
import { ActionButtons } from './action-buttons/action-buttons';
import { Mixpanel } from '../../utils/mixpanelService';
import { useIsMobile } from '~/hooks/use-is-mobile';

interface ArtistPaneInputProps {
    selectedArtist: Artist;
    onNewChatRequest: (initialMessage: string) => Promise<void>;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: 'spring',
            stiffness: 300,
            damping: 24,
        },
    },
};

export function ArtistPane({ selectedArtist, onNewChatRequest }: ArtistPaneInputProps) {
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const messageInputRef = useRef<HTMLTextAreaElement>(null);
    const isMobile = useIsMobile();

    // Get user's first name for the welcome message
    const { descope } = useAuth();
    const userFirstName =
        descope.user?.name?.split(' ')[0] || descope.user?.email?.split('@')[0] || 'Artist';

    useEffect(() => {
        if (messageInputRef.current && !isMobile) {
            messageInputRef.current.focus();
        }
    }, [isMobile]);

    const handleButtonChat = (
        messageToSend: string,
        messageCategory: string,
        messageSubCategory: string
    ) => {
        Mixpanel.track(descope.user?.customAttributes.v2UserId || '', 'Prompt Selected', {
            category: messageCategory,
            subCategory: messageSubCategory,
            topic: messageToSend,
            timestamp: new Date().toISOString(),
        });
        setMessage(messageToSend);
        handleSubmit(messageToSend);
    };

    const handleSubmit = async (messageToSend: string) => {
        try {
            setIsLoading(true);
            await onNewChatRequest(messageToSend);
        } finally {
            setIsLoading(false);
            setMessage('');
        }
    };

    return (
        <motion.div
            className="w-full h-full flex flex-col justify-start bg-background-primary"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <motion.div className="flex-grow flex flex-col">
                <motion.div className="flex-[3]" />
                <motion.div
                    className="max-w-[654px] w-full mx-auto px-4 min-h-[500px] md:min-h-[600px]"
                    variants={containerVariants}
                >
                    <div className="flex flex-col items-center">
                        <div className="text-center">
                            <AvatarWithDescription
                                name={selectedArtist.name}
                                avatarSize="md"
                                marginTop="0px"
                            />
                        </div>

                        <div className="mt-12 md:text-4xl text-3xl text-center">
                            <span className="font-primary">GOOD {getTimeOfDay()}, </span>
                            <span className="font-semibold">{userFirstName.toUpperCase()}</span>
                        </div>
                    </div>

                    <div className="pt-12">
                        <MessageInputBar
                            message={message}
                            onMessageChange={setMessage}
                            onSubmit={handleSubmit}
                            isLoading={isLoading}
                            ref={messageInputRef}
                        />
                    </div>

                    {/* Action Buttons */}
                    <motion.div ref={menuRef} className="pt-8" variants={itemVariants}>
                        <ActionButtons onButtonChat={handleButtonChat} />
                    </motion.div>
                </motion.div>
                <motion.div className="flex-[2]" />
            </motion.div>
            <div className="font-primary text-text-muted p-2 text-center text-[10px] text-muted-foreground border-border-secondary border-t-[1px] bg-background-primary">
                <div className="">HitCraft can play out of tune, check important info.</div>
                <div className="flex justify-center items-center gap-2">
                    <span className="">Hitcraft v0.7</span>
                    <span className="">•</span>
                    <a
                        href="https://hitcraft.ai/contact"
                        className="font-primary hover:underline transition-all"
                    >
                        Contact Us
                    </a>
                </div>
            </div>
        </motion.div>
    );
}
