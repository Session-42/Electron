export const theme = {
    colors: {
        light: {
            accent: '#B60280',
            primary: '#e1d7ea',
            secondary: '#df0c39',
            tertiary: '#fafafa',
            background: {
                primary: '#f4f4f5',
                secondary: '#fafafa',
                tertiary: '#ffffff',
                quaternary: '#fafafa',
            },
            text: {
                primary: '#464954',
                secondary: '#000000',
                muted: '#7a8190',
                invert: '#ffffff',
            },
            border: {
                primary: '#e1d7ea',
                secondary: '#e3e3e3',
                hover: '#b8b8b8',
            },
        },
        dark: {
            accent: '#FEA5E3',
            primary: '#1d1d1c',
            secondary: '#ff4d6d',
            tertiary: '#383835',
            background: {
                primary: '#2e2e2c',
                secondary: '#21211f',
                tertiary: '#3D3C3A',
                quaternary: '#30302e',
            },
            text: {
                primary: '#e5e5e2',
                secondary: '#ffffff',
                muted: '#6b7280',
                invert: '#000000',
            },
            border: {
                primary: '#d6307a',
                secondary: '#3d3d3d',
                hover: '#5c5c5c',
            },
        },
    },
    fonts: {
        families: {
            primary: ['Poppins-Light', 'sans-serif'] as string[],
            semibold: ['Poppins-SemiBold', 'sans-serif'] as string[],
            bold: ['Poppins-Bold', 'sans-serif'] as string[],
        },
    },
    spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem',
    },
    borderRadius: {
        sm: '0.25rem',
        md: '0.5rem',
        lg: '1rem',
        full: '9999px',
    },
    transitions: {
        default: 'transition-all duration-200',
        slow: 'transition-all duration-300',
    },
} as const;

export type Theme = typeof theme;
export type ThemeColors = typeof theme.colors.light;
