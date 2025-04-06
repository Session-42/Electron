import React from 'react';

export interface InfoField {
    label: string;
    value: React.ReactNode;
}

export interface InfoDisplayProps {
    title: string;
    fields: InfoField[];
}

const InfoDisplay = ({ title, fields }: InfoDisplayProps) => {
    return (
        <div className="py-4">
            {/* Header with divider */}
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-md font-bold text-text-primary">{title}</h2>
            </div>
            <div className="h-px bg-border-secondary mb-6" />

            {/* Fields */}
            <div className="space-y-6">
                {fields.map((field, index) => (
                    <div key={index} className="space-y-1">
                        <p className="text-sm font-semibold text-text-primary">{field.label}</p>
                        <div className="text-sm font-primary text-text-secondary">
                            {field.value}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InfoDisplay;
