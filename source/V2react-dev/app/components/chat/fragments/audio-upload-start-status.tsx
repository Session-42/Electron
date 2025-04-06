const AudioUploadStartStatus = ({ done }: { done: boolean | undefined }) => {
    return done ? <>Processed audio file</> : <>Processing your audio file</>;
};

export default AudioUploadStartStatus;
