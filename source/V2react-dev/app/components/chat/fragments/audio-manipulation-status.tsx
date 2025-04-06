export const AudioManipulationStatus = ({
    done,
    loadingMessage,
    doneMessage,
}: {
    done: boolean | undefined;
    loadingMessage: string;
    doneMessage: string;
}) => {
    return done ? <>{doneMessage}</> : <>{loadingMessage}</>;
};

export default AudioManipulationStatus;
