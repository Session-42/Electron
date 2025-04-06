import { useEffect } from 'react';
import { Descope, useDescope, useSession } from '@descope/react-sdk';
import { useNavigate } from 'react-router';
import { LoadingSpinner } from '~/components/ui/loading-spinner';
import { getUserId } from '~/utils/jwt';
import { Mixpanel } from '~/utils/mixpanelService';

const { VITE_DESCOPE_PROJECT_ID } = import.meta.env;

export default function LoginPage() {
    const navigate = useNavigate();
    const { isAuthenticated, isSessionLoading } = useSession();
    const { onSessionTokenChange } = useDescope();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const onSuccess = () => {
        onSessionTokenChange((token: string) => {
            // Handle the token change
            // The token is automatically handled by Descope's SDK
            console.log('Session token changed', token);
        });
        // Track auto login event
        const userId = getUserId();
        if (userId) {
            Mixpanel.track(userId, 'User Auto Logged In', {
                timestamp: new Date().toISOString(),
            });
        }
        navigate('/');
    };

    interface DescopeError {
        errorCode: string;
        errorDescription: string;
        errorMessage?: string;
        retryAfter?: string;
    }

    const onError = (e: CustomEvent<DescopeError>) => {
        console.error('Authentication error:', e);
        // You can handle different error codes here
        // e.detail.errorCode, e.detail.errorDescription, etc.
    };

    if (isSessionLoading) {
        return (
            <div className="min-h-screen bg-background-secondary flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-secondary flex items-center justify-center">
            <div className="w-full max-w-md">
                <div className="bg-background-tertiary p-8 rounded-2xl shadow-sm">
                    <img src="/assets/betalogo.png" alt="HitCraft" className="w-32 mx-auto mb-8" />

                    <Descope
                        flowId="sign-up-or-in-copy"
                        onSuccess={onSuccess}
                        onError={onError}
                        client={{
                            projectId: VITE_DESCOPE_PROJECT_ID,
                            persistTokens: true,
                            autoRefresh: true,
                        }}
                    />

                    <div className="mt-6 text-center text-sm text-muted-foreground">
                        <span>Don't have an account? </span>
                        <a href="/sign-up" className="text-[#8a44c8] hover:underline">
                            Sign up
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
