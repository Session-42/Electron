import React from 'react';
import type { ReferenceSelectionFragment } from '~/types/chat.types';

interface ReferenceSelectionMessageProps {
    fragment: ReferenceSelectionFragment;
}

export const ReferenceSelectionStatus: React.FC<ReferenceSelectionMessageProps> = ({
    fragment,
}) => {
    return <span>Option {fragment.optionNumber} selected</span>;
};

export default ReferenceSelectionStatus;
