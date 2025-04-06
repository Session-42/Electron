import React, { createContext, useContext, useEffect, useState } from 'react';
import { theme } from '~/styles/theme';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
    colors: {
        text: {
            primary: string;
            secondary: string;
            muted: string;
            invert: string;
        };
        background: {
            primary: string;
            secondary: string;
            tertiary: string;
            quaternary: string;
        };
        border: {
            primary: string;
            secondary: string;
            hover: string;
        };
    };
    mode: ThemeMode;
    toggleTheme: () => void;
}

const THEME_STORAGE_KEY = 'theme-preference';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [mode, setMode] = useState<ThemeMode>(() => {
        if (typeof window === 'undefined') return 'dark';

        // Check localStorage first
        const stored = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
        if (stored === 'light' || stored === 'dark') return stored;

        // If no stored preference, check system preference
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return systemPrefersDark ? 'dark' : 'dark'; // Default to dark mode
    });

    useEffect(() => {
        const root = window.document.documentElement;
        const colors = theme.colors[mode];

        // Store theme preference
        localStorage.setItem(THEME_STORAGE_KEY, mode);

        // Set colors
        root.style.setProperty('--primary', colors.primary);
        root.style.setProperty('--secondary', colors.secondary);
        root.style.setProperty('--tertiary', colors.tertiary);

        root.style.setProperty('--text-primary', colors.text.primary);
        root.style.setProperty('--text-secondary', colors.text.secondary);
        root.style.setProperty('--text-muted', colors.text.muted);
        root.style.setProperty('--text-invert', colors.text.invert);

        root.style.setProperty('--background-primary', colors.background.primary);
        root.style.setProperty('--background-secondary', colors.background.secondary);
        root.style.setProperty('--background-tertiary', colors.background.tertiary);
        root.style.setProperty('--background-quaternary', colors.background.quaternary);

        root.style.setProperty('--border-primary', colors.border.primary);
        root.style.setProperty('--border-secondary', colors.border.secondary);
        root.style.setProperty('--border-hover', colors.border.hover);

        // Accent
        root.style.setProperty('--accent', colors.accent);

        // Set fonts
        root.style.setProperty('--font-primary', theme.fonts.families.primary.join(', '));
        root.style.setProperty('--font-semibold', theme.fonts.families.semibold.join(', '));
        root.style.setProperty('--font-bold', theme.fonts.families.bold.join(', '));

        // Set spacing
        Object.entries(theme.spacing).forEach(([key, value]) => {
            root.style.setProperty(`--spacing-${key}`, value);
        });

        // Set border radius
        Object.entries(theme.borderRadius).forEach(([key, value]) => {
            root.style.setProperty(`--radius-${key}`, value);
        });

        // Set theme class
        root.classList.remove('light', 'dark');
        root.classList.add(mode);

        // Set meta theme color
        document
            .querySelector('meta[name="theme-color"]')
            ?.setAttribute('content', colors.background.primary);
    }, [mode]);

    // Listen for system theme changes
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e: MediaQueryListEvent) => {
            const stored = localStorage.getItem(THEME_STORAGE_KEY);
            // Only update if user hasn't set a preference
            if (!stored) {
                setMode(e.matches ? 'dark' : 'light');
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    const toggleTheme = () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    };

    const themeContext: ThemeContextType = {
        colors: theme.colors[mode],
        mode,
        toggleTheme,
    };

    return <ThemeContext.Provider value={themeContext}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
