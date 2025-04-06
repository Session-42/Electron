export interface Reference {
    _id: string;
    genre: string;
    image_url?: string;
    song: {
        song_name: string;
        bpm: number;
        time_signature: string;
        audio_file_s3_path: string;
        artistName?: string;
        artistSubtitle?: string;
        isVerified?: boolean;
    };
}

export interface ReferencesResponse {
    references: Reference[];
}
