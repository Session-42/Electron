import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Settings {
    showFragmentBorder: boolean;
    classicScrollMode: boolean;
}

export interface SettingItemType {
    id: keyof Settings;
    title: string;
    description: string;
    superUserOnly?: boolean;
}

interface SettingsContextType {
    settings: Settings;
    settingItems: SettingItemType[];
    updateSettings: (newSettings: Partial<Settings>) => void;
}

const defaultSettings: Settings = {
    showFragmentBorder: true,
    classicScrollMode: true,
};

const settingItems: SettingItemType[] = [
    {
        id: 'showFragmentBorder',
        title: 'Show Fragment Border',
        description: 'Display border around message fragments',
        superUserOnly: true,
    },
    {
        id: 'classicScrollMode',
        title: 'Classic Scroll Mode',
        description: 'Enable classic scroll mode',
        superUserOnly: true,
    },
];

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const SETTINGS_STORAGE_KEY = 'user-settings';

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [settings, setSettings] = useState<Settings>(() => {
        if (typeof window === 'undefined') return defaultSettings;

        const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
        return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
    });

    useEffect(() => {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    }, [settings]);

    const updateSettings = (newSettings: Partial<Settings>) => {
        setSettings((prev) => ({ ...prev, ...newSettings }));
    };

    return (
        <SettingsContext.Provider value={{ settings, settingItems, updateSettings }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
}
