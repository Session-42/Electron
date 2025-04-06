const SongCompositionStatus = ({ done }: { done: boolean | undefined }) => {
    return done ? <>Song composition complete</> : <>Composing your song</>;
};

export default SongCompositionStatus;
