import React from 'react';

interface PageTitleProps {
    title?: string;
    boldText?: string;
    className?: string;
    boldGradient?: boolean;
    marginBottom?: string;
}

export const PageTitle: React.FC<PageTitleProps> = ({
    title = '',
    boldText = '',
    className,
    boldGradient = false,
    marginBottom = '36px',
}) => {
    return (
        <div className={`text-center ${className}`}>
            <div style={{ marginTop: '20px', marginBottom: marginBottom }}>
                <h1 className="text-[32px]">
                    {<span className="font-poppins-light">{title}</span>}{' '}
                    {boldText && (
                        <span
                            className={`font-semibold ${
                                boldGradient
                                    ? 'bg-gradient-to-r from-[#8a44c8] to-[#df0c39] text-transparent bg-clip-text'
                                    : ''
                            }`}
                        >
                            {boldText}
                        </span>
                    )}
                </h1>
            </div>
        </div>
    );
};
