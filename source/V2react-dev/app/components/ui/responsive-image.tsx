import React, { useState } from 'react';

interface ResponsiveImageProps {
    imageUrl?: string;
    altText: string;
}

const ResponsiveImage = ({ imageUrl, altText }: ResponsiveImageProps) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    const handleLoad = () => {
        setIsLoading(false);
        setHasError(false);
    };

    const handleError = () => {
        setIsLoading(false);
        setHasError(true);
    };

    return (
        <div className="relative aspect-square rounded-xl overflow-hidden">
            {imageUrl ? (
                <>
                    <img
                        src={imageUrl}
                        alt={altText}
                        className={`w-full h-full object-cover transition-opacity duration-300 ${
                            isLoading ? 'opacity-0' : 'opacity-100'
                        }`}
                        onLoad={handleLoad}
                        onError={handleError}
                    />

                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                            <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                        </div>
                    )}

                    {hasError && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                            <div className="text-gray-500">Failed to load image</div>
                        </div>
                    )}
                </>
            ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 animate-pulse" />
            )}
        </div>
    );
};

export default ResponsiveImage;
