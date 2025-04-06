import mixpanel from 'mixpanel-browser';

const { VITE_MIXPANEL_TOKEN } = import.meta.env;
const { VITE_MIXPANEL_PROXY } = import.meta.env;

// Track if Mixpanel is properly initialized
let isInitialized = false;

try {
    if (!VITE_MIXPANEL_TOKEN) {
        console.warn('Mixpanel token is not defined. Tracking will be disabled.');
    } else {
        mixpanel.init(VITE_MIXPANEL_TOKEN, {
            record_sessions_percent: 100,
            record_mask_text_selector: '',
            api_host: VITE_MIXPANEL_PROXY,
        });
        isInitialized = true;
        console.log('Mixpanel initialized');
    }
} catch (error) {
    console.error('Failed to initialize Mixpanel:', error);
}

// Environment check (e.g., for development/testing environments)
const env_check = true;

const actions = {
    track: (userId: string, name: string, props?: Record<string, any>): void => {
        if (!isInitialized) {
            console.warn('Mixpanel not initialized. Skipping track call.');
            return;
        }
        if (env_check) {
            mixpanel.identify(userId);
            mixpanel.track(name, props);
        }
    },
    reset: (): void => {
        if (!isInitialized) {
            console.warn('Mixpanel not initialized. Skipping reset call.');
            return;
        }
        if (env_check) mixpanel.reset();
    },
    set: (props: Record<string, any>): void => {
        if (!isInitialized) {
            console.warn('Mixpanel not initialized. Skipping people.set call.');
            return;
        }
        if (env_check) mixpanel.people.set(props);
    },
};

export const Mixpanel = actions;
