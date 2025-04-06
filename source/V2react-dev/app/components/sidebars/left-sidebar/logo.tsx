import { useTheme } from '~/contexts/theme-context';

export const Logo = ({ className = '', onClick }: { className?: string; onClick: () => void }) => {
    const { mode } = useTheme();

    return (
        <div className={className}>
            <button onClick={onClick} className="border-none bg-transparent">
                <img
                    src="/assets/betalogo.png"
                    alt="HitCraft"
                    className={`w-[105px] ${mode === 'dark' ? 'filter brightness-0 invert-[1]' : ''}`}
                />
            </button>
        </div>
    );
};
