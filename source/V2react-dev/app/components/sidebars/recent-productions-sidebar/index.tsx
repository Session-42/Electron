import { useState, useEffect } from 'react';
import { SearchBar } from '../../searchbar';
import { useProductions } from '../../../hooks/use-productions';
import Divider from '../../ui/divider';
import { ErrorMessage, EmptyState, ProductionCard } from './sidebarComponents';
import { GenericRightSidebar } from '../generic-right-sidebar';
import { LoadingSpinner } from '~/components/ui/loading-spinner';
import { audioApi } from '~/utils/api';
import { ProductionAudio, ProductionWithAudio } from '~/types/audio.types';

export function RecentProductionsSidebar() {
    const [searchValue, setSearchValue] = useState('');
    const { productions, isLoading, error } = useProductions();
    const [audioUrls, setAudioUrls] = useState<Record<string, string>>({});
    const productionsIcon = '/assets/production.svg';

    const filteredProductions = productions.filter((audio: ProductionAudio) =>
        audio.fileName.toLowerCase().includes(searchValue.toLowerCase())
    );

    // Fetch audio URLs for all productions
    useEffect(() => {
        const fetchAudioUrls = async () => {
            const urls: Record<string, string> = {};

            for (const audio of productions) {
                try {
                    const response = await audioApi.getAudioFile(audio._id);
                    if (response.data) {
                        urls[audio._id] = response.data;
                    }
                } catch (err) {
                    console.error(`Error fetching audio URL for ${audio._id}:`, err);
                }
            }

            setAudioUrls(urls);
        };

        if (productions.length > 0) {
            fetchAudioUrls();
        }
    }, [productions]);

    const handleDownload = async (audioUrl: string, filename: string) => {
        let objectUrl: string | null = null;
        try {
            const response = await fetch(audioUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'audio/*',
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const blob = await response.blob();
            objectUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = objectUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
        } catch (error) {
            console.error(
                'Download failed:',
                error instanceof Error ? error.message : 'Unknown error'
            );
            // You might want to show a toast or notification here
        } finally {
            if (objectUrl) {
                window.URL.revokeObjectURL(objectUrl);
            }
            const link = document.querySelector('a[style="display: none;"]');
            if (link && link.parentNode) {
                link.parentNode.removeChild(link);
            }
        }
    };

    const renderContent = () => {
        return (
            <div className="h-full flex flex-col">
                {/* Search Bar */}
                <div className="pt-6 pb-3 px-4">
                    <SearchBar
                        value={searchValue}
                        placeholder="Search productions..."
                        onChange={setSearchValue}
                    />
                </div>

                <Divider className="pt-3 pb-6 px-4" />

                <div className="flex-1 pb-10 overflow-hidden">
                    {isLoading ? (
                        <div className="h-full flex items-center justify-center">
                            <LoadingSpinner />
                        </div>
                    ) : error ? (
                        <ErrorMessage />
                    ) : (
                        <div className="h-full overflow-y-auto px-4 scrollbar-hide">
                            <div className="flex flex-col gap-4">
                                {filteredProductions.length > 0 ? (
                                    filteredProductions.map((audio: ProductionAudio) => {
                                        const productionWithAudio: ProductionWithAudio = {
                                            ...audio,
                                            genre: audio.reference?.genre || 'Unknown Genre',
                                            referenceImageUrl: audio.reference?.imageUrl || '',
                                            audioUrl: audioUrls[audio._id] || '',
                                        };
                                        return (
                                            <ProductionCard
                                                key={audio._id}
                                                production={productionWithAudio}
                                                onDownload={handleDownload}
                                            />
                                        );
                                    })
                                ) : (
                                    <EmptyState />
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <GenericRightSidebar title="RECENT PRODUCTIONS" icon={productionsIcon}>
            {renderContent()}
        </GenericRightSidebar>
    );
}
