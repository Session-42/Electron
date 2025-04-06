import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://localhost:3500';

export const axiosAuth = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

export const TOKEN_NAME = 'DS';

// Request interceptor to add auth token to requests
axiosAuth.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(TOKEN_NAME);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle auth errors
axiosAuth.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If the error is 401 and we haven't retried yet
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // Here you could implement token refresh logic if needed
            localStorage.removeItem(TOKEN_NAME);
            window.location.href = '/login';
            return Promise.reject(error);
        }

        return Promise.reject(error);
    }
);
