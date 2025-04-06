import { Moon, Sun } from 'lucide-react';
import { useTheme } from '~/contexts/theme-context';

export function ThemeToggle() {
    const { mode, toggleTheme } = useTheme();

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={() => mode !== 'light' && toggleTheme()}
                className={`p-1.5 rounded-full transition-colors ${
                    mode === 'light'
                        ? 'bg-background-secondary text-text-primary'
                        : 'text-text-muted hover:text-text-primary'
                }`}
                aria-label="Light mode"
            >
                <Sun className="w-4 h-4" />
            </button>
            <button
                onClick={() => mode !== 'dark' && toggleTheme()}
                className={`p-1.5 rounded-full transition-colors ${
                    mode === 'dark'
                        ? 'bg-background-secondary text-text-secondary'
                        : 'text-text-muted hover:text-text-primary'
                }`}
                aria-label="Dark mode"
            >
                <Moon className="w-4 h-4" />
            </button>
        </div>
    );
}
