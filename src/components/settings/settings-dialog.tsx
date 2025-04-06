import { Settings as SettingsIcon } from 'lucide-react';
import { Settings, SettingItemType } from '~/contexts/settings-context';

interface SettingItemProps {
    title: string;
    description: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}

const SettingItem = ({ title, description, checked, onChange }: SettingItemProps) => (
    <div className="font-primary flex items-start gap-3 px-6 py-1">
        <div className="flex flex-col flex-1 gap-0.5">
            <h3 className="text-xs font-primary text-text-primary">{title}</h3>
            <p className="text-xs text-text-muted">{description}</p>
        </div>
        <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="h-4 w-4 rounded border-2 border-border-secondary bg-background-primary checked:border-[#8a44c8] checked:bg-[#8a44c8] transition-colors cursor-pointer"
        />
    </div>
);

export function SettingsDialog({
    settings,
    settingItems,
    updateSettings,
}: {
    settings: Settings;
    settingItems: SettingItemType[];
    updateSettings: (settings: Partial<Settings>) => void;
}) {
    return (
        <>
            <div className="w-full py-3">
                <div className="flex items-center text-text-primary mb-4 px-4">
                    <SettingsIcon className="w-4 h-4 mr-2" />
                    <span className="text-sm font-primary">Settings</span>
                </div>

                <div className="space-y-2">
                    {settingItems.map((item: SettingItemType) => (
                        <SettingItem
                            key={item.id}
                            title={item.title}
                            description={item.description}
                            checked={settings[item.id]}
                            onChange={(checked) => updateSettings({ [item.id]: checked })}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}
