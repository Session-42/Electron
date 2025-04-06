import { SearchIcon, XIcon } from 'lucide-react';
import { Input } from './ui/input';

interface SearchBarProps {
    value: string;
    placeholder?: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    className?: string;
}

export function SearchBar({
    value,
    placeholder = 'Search...',
    onChange,
    disabled,
    className = '',
}: SearchBarProps) {
    const handleClear = () => {
        onChange('');
    };

    return (
        <div
            className={`bg-background-secondary flex items-center justify-start px-4 h-10 w-full rounded-full border border-border-secondary/[0.1] ${className}`}
        >
            <SearchIcon className="w-4 h-4 text-border-secondary/50 z-10" />
            <input
                value={value}
                placeholder={placeholder}
                disabled={disabled}
                onChange={(e) => onChange(e.target.value)}
                className="w-full h-full pl-2 bg-background-secondary font-primary text-sm w-full placeholder:text-primary/50 placeholder:opacity-50 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            {value && (
                <button
                    onClick={handleClear}
                    className="text-primary/50 hover:text-primary/70 transition-colors"
                >
                    <XIcon className="w-4 h-4" />
                </button>
            )}
        </div>
    );
}
