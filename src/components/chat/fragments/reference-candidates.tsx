import React from 'react';
import { cn } from '~/utils/utils';
import GenreGridItem from '../../genre/genre-grid-item';
import type { ReferenceCandidatesFragment } from '~/types/chat.types';
import { Reference } from '~/types/reference';
import { useReferences } from '~/hooks/use-references';
import { HITCRAFT_ARTIST_ID } from '~/pages/hitcraft-main-page';

interface ReferenceCandidatesMessageProps {
    fragment: ReferenceCandidatesFragment;
    onSelect?: (reference: Reference, optionNumber: number) => void;
    className?: string;
    done?: boolean;
}

// Mock data for placeholders
const MOCK_REFERENCES: Reference[] = [
    {
        _id: 'placeholder-1',
        image_url: '/api/placeholder/120/88',
        song: {
            song_name: 'Option 1',
            audio_file_s3_path: '',
        },
    },
    {
        _id: 'placeholder-2',
        image_url: '/api/placeholder/120/88',
        song: {
            song_name: 'Option 2',
            audio_file_s3_path: '',
        },
    },
] as Reference[];

export const ReferenceCandidatesMessage: React.FC<ReferenceCandidatesMessageProps> = ({
    fragment,
    onSelect,
    className,
    done = false,
}) => {
    const { references, isLoading } = useReferences(HITCRAFT_ARTIST_ID, {
        referenceIds: fragment.references,
    });

    const handleSelect = (reference: Reference, optionNumber: number) => {
        if (done) return;
        onSelect?.(reference, optionNumber);
    };

    // Use the actual references if loaded, otherwise use the mock references
    const displayReferences = isLoading || references.length === 0 ? MOCK_REFERENCES : references;

    return (
        <div className="flex space-x-3">
            <div
                className={cn(
                    'flex-1',
                    done && 'opacity-50 grayscale cursor-not-allowed',
                    (isLoading || references.length === 0) && 'opacity-60 animate-pulse',
                    className
                )}
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-[29.3px]">
                    {displayReferences.map((reference, index) => (
                        <div
                            key={reference._id}
                            className={cn(
                                'transition-all duration-200',
                                done && 'pointer-events-none',
                                (isLoading || references.length === 0) && 'pointer-events-none'
                            )}
                        >
                            <GenreGridItem
                                reference={{
                                    ...reference,
                                    song: {
                                        ...reference.song,
                                        song_name: `Option ${index + 1}`,
                                    },
                                }}
                                onProduce={() => handleSelect(reference, index + 1)}
                                disabled={done || isLoading || references.length === 0}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ReferenceCandidatesMessage;
