import { AlertCircle } from 'lucide-react';
import { GenericRightSidebar } from '../generic-right-sidebar';
import Divider from '~/components/ui/divider';
import { TextFragmentBubble } from '~/components/chat/fragments/text';

export function LyricsSidebar({ songName, lyrics }: { songName: string; lyrics: string }) {
    return (
        <GenericRightSidebar
            title="YOUR LYRICS"
            icon="/assets/production.svg"
            showCloseButton={true}
        >
            <Divider className="px-6 py-4" />
            <div className="flex-1 overflow-hidden">
                {lyrics ? (
                    <div className="h-full overflow-y-auto scrollbar-hide px-4">
                        {songName ? (
                            <>
                                <div className="w-full sticky top-0 flex flex-col items-center justify-center z-10 font-semibold">
                                    <h1 className="w-full bg-background-quaternary text-center py-2">
                                        {songName}
                                    </h1>
                                    <div className="w-full h-4 bg-gradient-to-b from-background-quaternary via-background-quaternary/50 to-transparent" />
                                </div>
                            </>
                        ) : null}
                        <div className="prose prose-sm overflow-y-auto p-6">
                            <TextFragmentBubble fragment={{ type: 'text', text: lyrics }} />
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-red-600 dark:text-red-400 py-4 font-primary flex flex-col items-center gap-2">
                            <AlertCircle className="w-7 h-7 mb-1" />
                            <span>Failed to load lyrics</span>
                        </div>
                    </div>
                )}
            </div>
        </GenericRightSidebar>
    );
}
