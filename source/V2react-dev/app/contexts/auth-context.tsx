import { createContext, useContext, ReactNode, useEffect } from 'react';
import { useDescope, useSession, useUser } from '@descope/react-sdk';
import { AuthContextType, DescopeUser } from '../types/auth';
import { Mixpanel } from '../utils/mixpanelService';
import { LoadingSpinner } from '~/components/ui/loading-spinner';
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const descope = useDescope();
    const { isSessionLoading, sessionToken, isAuthenticated } = useSession();
    const { user: descopeUser } = useUser();

    useEffect(() => {
        if (!isSessionLoading && !isAuthenticated) {
            window.location.href = import.meta.env.VITE_LANDING_URL;
        }
    }, [isAuthenticated, isSessionLoading]);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                // Attempt to refresh the session on mount
                await descope.refresh();
            } catch (error) {
                console.error('Failed to refresh session:', error);
            }
        };

        initializeAuth();
    }, [descope]);

    const logout = async () => {
        try {
            await descope.logout();
            Mixpanel.reset();
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    // Don't render children until we've attempted to refresh the session
    if (isSessionLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    const value: AuthContextType = {
        descope: {
            user: descopeUser as DescopeUser,
            isSessionLoading,
            sessionToken,
            isAuthenticated,
        },
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
