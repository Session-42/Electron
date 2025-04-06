export const EmptyState = () => (
    <div className="flex-1 flex items-center justify-center bg-background-primary min-h-screen">
        <div className="text-center max-w-md mx-auto px-4">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center">
                <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm-4 7a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">No Artists Available</h3>
            <p className="text-text-primary mb-4">
                We're currently setting things up. Please check back in a moment.
            </p>
            <div className="h-1 w-32 mx-auto bg-gradient-to-r from-[#8a44c8] to-[#df0c39] rounded-full" />
        </div>
    </div>
);
