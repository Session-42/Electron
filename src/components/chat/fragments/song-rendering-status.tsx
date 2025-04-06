export const SongRenderingStatus = ({ done }: { done: boolean | undefined }) => {
    return done ? <>Finished producing</> : <>Producing...</>;
};

export default SongRenderingStatus;
