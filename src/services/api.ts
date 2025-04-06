import { ReferencesResponse } from '../types/reference';
import { axiosAuth } from '../utils/axios-auth';
import { Fragment, ThreadDetails, Message } from '../types/chat.types';
import { TaskStatus } from '../types/common';

const api = axiosAuth;

// Types
export interface ArtistProfile {
    email: string;
    name: string;
    instructions?: string;
    phoneNumber?: string;
    birthdate?: string;
    imageUrl?: string;
    about?: string;
    biography?: string[];
    role?: {
        primary: string;
        secondary?: string[];
    };
    livesIn?: string;
    musicalAchievements?: string[];
    buisnessAchievements?: string[];
    preferredGenres?: string[];
    famousWorks?: string[];
    socialMediaLinks?: string[];
}

export interface ProfessionalRole {
    description: string;
    level: string;
}

export interface UserData {
    descopeId?: string;
    descopeLoginIds?: string[];
    uploadsRemaining?: number;
    isSuperUser?: boolean;
    isOnboarded?: boolean;
    userAttributes?: {
        professionalRoles?: ProfessionalRole[];
        genres?: string[];
        mostInterestedIn?: string[];
    };
}

export interface MixingStatusResult {
    status: TaskStatus;
    audioId: string;
}

export enum AudioType {
    DEMO = 'demo',
    MIXED = 'mixed',
    QUANTIZED = 'quantized',
    STEM = 'stem',
    PRODUCTION = 'production',
    COMPOSITION = 'composition',
}

export interface AudioDocument {
    _id: string;
    type: AudioType;
    userId: string;
    fileName: string;
    s3Path: string;
    createdAt: Date;
    updatedAt: Date;
    originalAudioId?: string;
    threadId?: string;
    musicalAnalysis?: {
        bpm?: number;
        time_signature?: string;
        structure?: Record<string, any>;
        chords?: Record<string, any>;
    };
}

interface UpdateUserProfileRequest {
    userAttributes?: {
        professionalRoles?: ProfessionalRole[];
        genres?: string[];
        mostInterestedIn?: string[];
    };
}

export type Threads = { [key: string]: ThreadDetails };

export interface Production {
    _id: string;
    songName: string;
    audioUrl: string;
    genre: string;
    referenceImageUrl?: string;
}

export interface QuantizedAudio {
    _id: string;
    bpm?: number;
    confidence?: number;
    audioId: string;
}

export interface RenderStatus {
    status: TaskStatus;
    butcherId: string;
}

export interface RenderDownload {
    downloadUrl: string;
    butcherId: string;
}

export interface RenderStart {
    sqsMessageId: string | null;
    butcherId: string;
}

export interface PaymentStatusResponse {
    paid: boolean;
}

export class HitcraftError extends Error {
    type: string;
    constructor(type: string, message?: string) {
        super(message || type);
        this.type = type;
        this.name = 'HitcraftError';
    }
}

export interface StemSeparationStatusResult {
    taskId: string;
    audioId: string;
    status: TaskStatus;
}

export interface StemSeparationResult {
    vocals: string;
    instruments: string;
}

export type PendingMessagesResult = {
    status: string;
    message?: Message;
}[];

export interface BasicTaskResponse {
    status: TaskStatus;
    audioId: string;
    error?: string;
}

// Chat related endpoints
export const chatApi = {
    get: (threadId: string) => api.get(`/api/v1/chat/${threadId}`),

    create: (artistId: string) => api.post('/api/v1/chat/', { artistId }),

    list: (amount: number = 3) => api.get(`/api/v1/chat/?amount=${amount}`),

    listByArtistWithAmount: (artistId: string, amount: number) =>
        api.get<{ threads: Threads }>(`/api/v1/chat/?artistId=${artistId}&amount=${amount}`),

    delete: (threadId: string) => api.delete(`/api/v1/chat/${threadId}`),

    listMessages: (threadId: string) => api.get(`/api/v1/chat/${threadId}/messages`),

    sendMessage: (threadId: string, fragment: Fragment) =>
        api.post(`/api/v1/chat/${threadId}/messages`, { content: fragment }),

    changeTitle: (threadId: string, title: string) =>
        api.put(`/api/v1/chat/${threadId}/title`, { title }),

    pendingMessages: (threadId: string) =>
        api.get<PendingMessagesResult>(`/api/v1/chat/${threadId}/pending-messages`),
};

// Artist related endpoints
export const artistApi = {
    get: (artistId: string) => api.get(`/api/v1/artist/${artistId}`),

    list: () => api.get('/api/v1/artist'),

    getAllReferences: (artistId: string, options?: { referenceIds?: string[] }) => {
        const searchParams = new URLSearchParams();

        if (options?.referenceIds) {
            searchParams.append('referenceIds', options.referenceIds.join(','));
        }

        return api.get<ReferencesResponse>(
            `/api/v1/artist/${artistId}/references?${searchParams.toString()}`
        );
    },
};

// User related endpoints
export const userApi = {
    get: () => api.get(`/api/v1/user/`),

    update: (data: Partial<UserData>) => {
        const requestBody: UpdateUserProfileRequest = {
            userAttributes: {
                professionalRoles: data.userAttributes?.professionalRoles || [],
                genres: data.userAttributes?.genres || [],
                mostInterestedIn: data.userAttributes?.mostInterestedIn || [],
            },
        };
        return api.put(`/api/v1/user/`, requestBody);
    },

    setOnboardingStatus: () => api.put(`/api/v1/user/onboarded`),
};

// Audio related endpoints
export const audioApi = {
    get: (audioId: string) => api.get(`/api/v1/audio/${audioId}`),

    upload: (file: File, type = 'demo', threadId: string) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);
        formData.append('threadId', threadId);
        return api.post('/api/v1/audio/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    getAudioFile: (audioId: string) => api.get(`/api/v1/audio/${audioId}/file`),

    listByType: (type: AudioType) => api.get(`/api/v1/audio?type=${type}`),

    getFile: (audioId: string) => api.get(`/api/v1/audio/${audioId}/file`),
};

// Butcher related endpoints
export const butcherApi = {
    startV1: (referenceId: string, audioId: string, audioBpm: number) =>
        api.post('/api/v1/butcher/tasks', { referenceId, audioId, audioBpm }),

    paymentStatus: (taskId: string) =>
        api.get<PaymentStatusResponse>(`/api/v1/butcher/tasks/${taskId}/payment`),
};

// Task related endpoints
export const taskApi = {
    getQuantizeStatus: (taskId: string) =>
        api.get<BasicTaskResponse>(`/api/v1/tasks/quantize/${taskId}`),

    getStemSeparationStatus: (taskId: string) =>
        api.get<StemSeparationStatusResult>(`/api/v1/tasks/stem-separation/${taskId}`),

    getMixingStatus: (taskId: string) =>
        api.get<MixingStatusResult>(`/api/v1/tasks/mixing/${taskId}`),
};