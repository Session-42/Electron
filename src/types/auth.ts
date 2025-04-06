import { UserResponse } from '@descope/core-js-sdk';

export interface DescopeUser extends UserResponse {
    customAttributes: Partial<{
        appleMusicProfile: string;
        country: string;
        description: string;
        finishedRegistration: boolean;
        instagramUrl: string;
        isMailchimpSuccess: boolean;
        isWhiteList: boolean;
        origin: string;
        pictureUrl: string;
        project: string;
        queuePosition: number;
        registrationDate: number;
        spotifyArtistPage: string;
        userRoles: string[];
        v2UserId: string;
        v2Registered: boolean;
        youtubeChannel: string;
        [key: string]: any;
    }>;
}

export interface ApiUser {}

export interface AuthContextType {
    descope: {
        user: DescopeUser;
        isSessionLoading: boolean;
        sessionToken: string;
        isAuthenticated: boolean;
    };
    logout: () => Promise<void>;
}
