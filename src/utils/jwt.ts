import { TOKEN_NAME } from './axios-auth';

interface JWTPayload {
    v2UserId: string;
    [key: string]: any;
}

export function decodeJWT(token: string): JWTPayload | null {
    try {
        const base64Payload = token.split('.')[1];
        const payload = JSON.parse(atob(base64Payload));
        return payload;
    } catch (error) {
        console.error('Error decoding JWT:', error);
        return null;
    }
}

export function getUserId(): string | null {
    try {
        const token = localStorage.getItem(TOKEN_NAME);
        if (!token) return null;

        const payload = decodeJWT(token);
        return payload?.v2UserId || null;
    } catch (error) {
        console.error('Error getting user ID:', error);
        return null;
    }
}
