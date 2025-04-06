import { AudioUploadRequestFragment } from '~/types/chat.types';
import { WaitingForUser } from '~/components/ui/waiting-for-user';

export const AudioUploadRequestStatus = ({
    fragment,
}: {
    fragment: AudioUploadRequestFragment;
}) => {
    return <WaitingForUser isVisible={!fragment.done} />;
};

export default AudioUploadRequestStatus;
