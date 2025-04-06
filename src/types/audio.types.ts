import { AudioDocument } from '~/utils/api';

export interface ProductionAudio extends AudioDocument {
    reference: {
        imageUrl: string;
        genre: string;
    };
}

export interface ProductionWithAudio extends ProductionAudio {
    audioUrl: string;
    genre?: string;
    referenceImageUrl?: string;
}
