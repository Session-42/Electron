const ComposeSongStatus = ({ done }: { done: boolean | undefined }) => {
    return done ? <>Composed song</> : <>Composing your song</>;
};

export default ComposeSongStatus;
