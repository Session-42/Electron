import React, { createContext, useContext, useState, ReactNode } from 'react';

/**
 * This context is used to help us test features.
 * TODO: Remove this in later versions.
 */

interface DevContextType {
    showFragmentBorder: boolean;
    toggleFragmentBorder: () => void;
}

const DevContext = createContext<DevContextType | undefined>(undefined);

export function DevProvider({ children }: { children: ReactNode }) {
    const [showFragmentBorder, setShowFragmentBorder] = useState(true);

    const toggleFragmentBorder = () => {
        setShowFragmentBorder((prev) => !prev);
    };

    return (
        <DevContext.Provider value={{ showFragmentBorder, toggleFragmentBorder }}>
            {children}
        </DevContext.Provider>
    );
}

export function useDev() {
    const context = useContext(DevContext);
    if (!context) {
        throw new Error('useDev must be used within a DevProvider');
    }
    return context;
}
