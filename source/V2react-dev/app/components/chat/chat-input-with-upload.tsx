import { useRef, useState, useEffect } from 'react';
import { AUDIO_FILE_TYPES } from '~/utils/constants';
import { useSketchUploadStart } from '~/hooks/use-sketch-upload';
import { AudioUploadRequestFragment } from '~/types/chat.types';
import { ChatInput } from './chat-input';
import { ErrorPopup } from './error-popup';

interface ChatInputWithUploadProps {
    onSendMessage: (message: string) => void;
    artistName: string;
    isLoading?: boolean;
    activeUploadRequest: AudioUploadRequestFragment | null;
    threadId: string;
    onUploadStart?: (requestId: string, taskId: string, fileName: string) => Promise<void>;
    onUploadComplete?: (
        requestId: string,
        taskId: string,
        audioId: string,
        fileName: string
    ) => Promise<void>;
}

export const ChatInputWithUpload = ({
    onSendMessage,
    artistName,
    isLoading,
    activeUploadRequest,
    threadId,
    onUploadStart,
    onUploadComplete,
}: ChatInputWithUploadProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const chatInputRef = useRef<HTMLDivElement>(null);
    const { startUpload } = useSketchUploadStart();
    const [isUploading, setIsUploading] = useState(false);
    const [activeUploadId, setActiveUploadId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Clear error after timeout
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError(null);
            }, 5000); // 5 seconds

            return () => clearTimeout(timer);
        }
    }, [error]);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !activeUploadRequest || !onUploadStart || !onUploadComplete) return;

        try {
            setIsUploading(true);
            setActiveUploadId(activeUploadRequest.audioUploadRequestId);
            setError(null);
            const result = await startUpload(file, activeUploadRequest.postProcess, threadId);
            if ('taskId' in result) {
                await onUploadStart(
                    activeUploadRequest.audioUploadRequestId,
                    result.taskId,
                    file.name
                );
            } else {
                await onUploadComplete(
                    activeUploadRequest.audioUploadRequestId,
                    activeUploadRequest.taskId,
                    result.audioId,
                    file.name
                );
                setActiveUploadId(null);
            }
        } catch (err) {
            console.error('Upload error:', err);
            const errorMessage =
                err instanceof Error ? err.message : 'Failed to upload file. Please try again.';
            setError(errorMessage);
            setActiveUploadId(null);
        } finally {
            setIsUploading(false);
        }
    };

    // Show upload button only if we have an active request AND we're not currently processing any upload
    const shouldShowUploadButton = Boolean(activeUploadRequest && !isUploading && !activeUploadId);

    return (
        <div className="relative">
            <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                className="hidden"
                accept={AUDIO_FILE_TYPES}
            />
            <ErrorPopup message={error || ''} isVisible={!!error} />
            <div ref={chatInputRef}>
                <ChatInput
                    onSendMessage={onSendMessage}
                    placeholder={`Message ${artistName}...`}
                    isLoading={isLoading}
                    isWaitingForUser={shouldShowUploadButton}
                    showUploadButton={shouldShowUploadButton}
                    onUploadClick={() => fileInputRef.current?.click()}
                />
            </div>
        </div>
    );
};

export default ChatInputWithUpload;
