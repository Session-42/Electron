import { ChevronDownIcon, LogOutIcon, Palette, User, Settings as SettingsIcon } from 'lucide-react';
import { ThemeToggle } from '~/components/ui/theme-toggle';
import { SettingsDialog } from '~/components/settings/settings-dialog';
import { SettingItemType, useSettings } from '~/contexts/settings-context';
import { useUser } from '~/hooks/use-user';

export const UserSection = ({
    userName,
    userImage,
    isMenuOpen,
    onMenuToggle,
    onLogout,
    onProfile,
}: {
    userName: string;
    userImage: string;
    isMenuOpen: boolean;
    onMenuToggle: () => void;
    onLogout: () => void;
    onProfile: () => void;
}) => {
    const { settings, settingItems, updateSettings } = useSettings();
    const { isSuperUser } = useUser();
    // Filter settings based on user permissions
    const filteredSettings = settingItems.filter(
        (item: SettingItemType) => !item.superUserOnly || isSuperUser
    );

    return (
        <div className="flex items-center gap-3 relative py-4">
            <img
                src={userImage}
                alt={userName}
                className="w-10 h-10 rounded-full flex-shrink-0 object-cover"
            />
            <span className="flex-1 font-primary text-sm text-text-primary truncate">
                {userName}
            </span>
            <button
                onClick={onMenuToggle}
                className="flex-shrink-0 p-1 rounded-full hover:bg-background-primary transition-colors"
            >
                <ChevronDownIcon
                    className={`w-5 h-5 text-text-primary transform transition-transform duration-200 ${
                        isMenuOpen ? 'rotate-180' : ''
                    }`}
                />
            </button>
            {isMenuOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-background-tertiary rounded-md shadow-lg border border-border-secondary z-10">
                    <button
                        onClick={onProfile}
                        className="w-full px-4 py-3 flex items-center text-text-primary hover:bg-background-primary transition-colors rounded-t-md"
                    >
                        <User className="w-4 h-4 mr-2" />
                        <span className="text-sm font-primary">Profile</span>
                    </button>
                    <div className="h-px bg-border-secondary dark:bg-border-hover" />
                    <div className="w-full px-4 py-3 flex items-center text-text-primary transition-colors">
                        <Palette className="w-4 h-4 mr-2" />
                        <span className="text-sm font-primary">Theme</span>
                        <div className="ml-auto">
                            <ThemeToggle />
                        </div>
                    </div>
                    <div className="h-px bg-border-secondary dark:bg-border-hover" />
                    {filteredSettings.length > 0 && (
                        <>
                            <div className="w-full">
                                <SettingsDialog
                                    settings={settings}
                                    settingItems={settingItems}
                                    updateSettings={updateSettings}
                                />
                            </div>
                            <div className="h-px bg-border-secondary dark:bg-border-hover" />
                        </>
                    )}
                    <button
                        onClick={onLogout}
                        className="w-full px-4 py-3 flex items-center text-red-600 dark:text-red-400 hover:bg-background-primary transition-colors rounded-b-md"
                    >
                        <LogOutIcon className="w-4 h-4 mr-2" />
                        <span className="text-sm font-primary">Log out</span>
                    </button>
                </div>
            )}
        </div>
    );
};
