export const LoadingDots = () => (
    <div className="flex space-x-3">
        <div className="inline-block rounded-xl relative bg-background-tertiary">
            <div className="p-4">
                <div className="flex space-x-2">
                    <div
                        className="w-2.5 h-2.5 bg-gray-500/60 rounded-full animate-[bounce_0.8s_infinite_0ms]"
                        style={{
                            transformOrigin: 'center bottom',
                            animationTimingFunction: 'cubic-bezier(0.2, 0, 0.4, 1)',
                        }}
                    />
                    <div
                        className="w-2.5 h-2.5 bg-gray-500/60 rounded-full animate-[bounce_0.8s_infinite_200ms]"
                        style={{
                            transformOrigin: 'center bottom',
                            animationTimingFunction: 'cubic-bezier(0.2, 0, 0.4, 1)',
                        }}
                    />
                    <div
                        className="w-2.5 h-2.5 bg-gray-500/60 rounded-full animate-[bounce_0.8s_infinite_400ms]"
                        style={{
                            transformOrigin: 'center bottom',
                            animationTimingFunction: 'cubic-bezier(0.2, 0, 0.4, 1)',
                        }}
                    />
                </div>
            </div>
        </div>
    </div>
);
