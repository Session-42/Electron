import type { Config } from 'tailwindcss';
import tailwindAnimate from 'tailwindcss-animate';
import tailwindTypography from '@tailwindcss/typography';

export default {
    content: ['./app/**/*.{js,jsx,ts,tsx}'],
    darkMode: 'class',
    theme: {
        extend: {
            fontSize: {
                '3xl': '1.75rem',
            },
            fontFamily: {
                primary: 'var(--font-primary)',
                semibold: 'var(--font-semibold)',
                bold: 'var(--font-bold)',
            },
            borderRadius: {
                sm: 'var(--radius-sm)',
                md: 'var(--radius-md)',
                lg: 'var(--radius-lg)',
                full: 'var(--radius-full)',
            },
            colors: {
                // Primary colors
                primary: 'var(--primary)',
                secondary: 'var(--secondary)',
                tertiary: 'var(--tertiary)',
                accent: 'var(--accent)',

                // Background colors
                'background-primary': 'var(--background-primary)',
                'background-secondary': 'var(--background-secondary)',
                'background-tertiary': 'var(--background-tertiary)',
                'background-quaternary': 'var(--background-quaternary)',

                // Text colors
                'text-primary': 'var(--text-primary)',
                'text-secondary': 'var(--text-secondary)',
                'text-muted': 'var(--text-muted)',
                'text-invert': 'var(--text-invert)',

                // Border colors
                'border-primary': 'var(--border-primary)',
                'border-secondary': 'var(--border-secondary)',
                'border-hover': 'var(--border-hover)',
            },
            spacing: {
                xs: 'var(--spacing-xs)',
                sm: 'var(--spacing-sm)',
                md: 'var(--spacing-md)',
                lg: 'var(--spacing-lg)',
                xl: 'var(--spacing-xl)',
                '2xl': 'var(--spacing-2xl)',
            },
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' },
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' },
                },
                spin: {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                },
                pulse: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.5' },
                },
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
                spin: 'spin 2.5s ease-in-out infinite',
                pulse: 'pulse 2.5s ease-in-out infinite',
            },
        },
    },
    plugins: [tailwindAnimate, tailwindTypography],
} satisfies Config;
