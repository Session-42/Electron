import { AuthProvider } from '@descope/react-sdk/flows';
import { BrowserRouter as Router } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider as AppAuthProvider } from './contexts/auth-context';
import { LayoutProvider } from './contexts/layout-context';
import { ThemeProvider } from './contexts/theme-context';
import HitcraftMainPage from './pages/hitcraft-main-page';
import { SettingsProvider } from './contexts/settings-context';
const { VITE_DESCOPE_PROJECT_ID } = import.meta.env;
const { VITE_DESCOPE_AUTH_URL } = import.meta.env;

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            gcTime: 0, // Disable caching
            staleTime: 0, // Data is immediately considered stale
            refetchOnMount: true, // Always refetch on mount
            refetchOnWindowFocus: false, // Disable refetch on window focus
        },
    },
});

export default function App() {
    return (
        <ThemeProvider>
            <SettingsProvider>
                <AuthProvider projectId={VITE_DESCOPE_PROJECT_ID} baseUrl={VITE_DESCOPE_AUTH_URL}>
                    <AppAuthProvider>
                        <QueryClientProvider client={queryClient}>
                            <Router>
                                <LayoutProvider>
                                    <AppContent />
                                </LayoutProvider>
                            </Router>
                        </QueryClientProvider>
                    </AppAuthProvider>
                </AuthProvider>
            </SettingsProvider>
        </ThemeProvider>
    );
}

function AppContent() {
    return (
        <main className="bg-background-primary w-full h-full">
            <HitcraftMainPage />
        </main>
    );
}
