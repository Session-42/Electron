import { useRef, useState, useMemo, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Pencil,
    Sliders,
    BookOpen,
    Briefcase,
    BarChart3,
    Building2,
    WandSparkles,
} from 'lucide-react';
import { ActionButton, ActionButtonProps } from './action-button';
import { SuggestionsMenu } from './suggestions-menu';
import { useClickOutside } from '~/hooks/use-click-outside';

export interface ActionOption {
    title: string;
    highlight: string;
    message: string;
    analyticsCategory: string;
    analyticsSubCategory: string;
}

export interface Action extends Omit<ActionButtonProps, 'onClick'> {
    options?: ActionOption[];
}

interface ActionButtonsProps {
    onButtonChat: (
        message: string,
        analyticsCategory: string,
        analyticsSubCategory: string
    ) => void;
}

export function ActionButtons({ onButtonChat }: ActionButtonsProps) {
    const [selectedAction, setSelectedAction] = useState<Action | null>(null);
    const ref = useRef<HTMLDivElement>(null);

    const actionsData = [
        {
            title: 'Music Studio',
            icon: <WandSparkles className="w-3 h-3 text-[#9c5fff]" />,
            options: [
                {
                    title: 'Song',
                    highlight: 'Producer',
                    message: 'Help me produce my song',
                    analyticsCategory: 'Music Studio',
                    analyticsSubCategory: 'Production',
                },
                {
                    title: 'Stem',
                    highlight: 'Separator',
                    message: 'Help me separate stems from my audio',
                    analyticsCategory: 'Music Studio',
                    analyticsSubCategory: 'Stem Separation',
                },
                {
                    title: 'Recording',
                    highlight: 'Quantizer',
                    message: 'Help me quantize my recording',
                    analyticsCategory: 'Music Studio',
                    analyticsSubCategory: 'Quantization',
                },
                {
                    title: 'Song',
                    highlight: 'Mixer',
                    message: 'Help me mix my song',
                    analyticsCategory: 'Music Studio',
                    analyticsSubCategory: 'Mixing',
                },
                {
                    title: 'Lyrics',
                    highlight: 'Writer',
                    message: 'Help me write lyrics',
                    analyticsCategory: 'Music Studio',
                    analyticsSubCategory: 'Lyrics',
                },
                {
                    title: 'Song',
                    highlight: 'Composer',
                    message: 'Help me compose my lyrics',
                    analyticsCategory: 'Music Studio',
                    analyticsSubCategory: 'Compose',
                },
            ],
        },
        {
            title: 'Knowledge Hub',
            icon: <BookOpen className="w-3 h-3 text-[#4CAF50]" />,
            options: [
                {
                    title: 'Music',
                    highlight: 'Theory',
                    message:
                        'Share your knowledge about music theory concepts that will enhance my compositions.',
                    analyticsCategory: 'Knowledge Hub',
                    analyticsSubCategory: 'Music Theory',
                },
                {
                    title: 'Production',
                    highlight: 'Techniques',
                    message:
                        'Teach me professional production techniques to elevate my sound quality.',
                    analyticsCategory: 'Knowledge Hub',
                    analyticsSubCategory: 'Production Techniques',
                },
                {
                    title: 'DAW',
                    highlight: 'Ninja',
                    message:
                        'Help me master DAW workflows and shortcuts to dramatically speed up my process.',
                    analyticsCategory: 'Knowledge Hub',
                    analyticsSubCategory: 'DAW',
                },
                {
                    title: 'Industry',
                    highlight: 'Insights',
                    message:
                        'Explain current music industry trends and strategies for independent artists.',
                    analyticsCategory: 'Knowledge Hub',
                    analyticsSubCategory: 'Industry Insights',
                },
            ],
        },
        {
            title: 'Release Command',
            icon: <BarChart3 className="w-3 h-3 text-[#FF9800]" />,
            options: [
                {
                    title: 'Plan',
                    highlight: 'Builder',
                    message:
                        'Create a comprehensive step-by-step release plan for my upcoming song release.',
                    analyticsCategory: 'Release Command',
                    analyticsSubCategory: 'Plan Builder',
                },
                {
                    title: 'Pitch',
                    highlight: 'Generator',
                    message:
                        'Generate effective playlist and blog pitch templates for my song that i can send the DSPs.',
                    analyticsCategory: 'Release Command',
                    analyticsSubCategory: 'Pitch Generator',
                },
                {
                    title: 'Campaign',
                    highlight: 'Planner',
                    message:
                        'Design a multi-platform social media campaign strategy for my release.',
                    analyticsCategory: 'Release Command',
                    analyticsSubCategory: 'Campaign Planner',
                },
                {
                    title: 'Analytics',
                    highlight: 'Guide',
                    message:
                        'Help me interpret my streaming data and leverage insights for growth.',
                    analyticsCategory: 'Release Command',
                    analyticsSubCategory: 'Analytics Guide',
                },
            ],
        },
        {
            title: 'Business Toolbox',
            icon: <Briefcase className="w-3 h-3 text-[#2196F3]" />,
            options: [
                {
                    title: 'Contract',
                    highlight: 'Review',
                    message: 'Explain the key points I should understand in this music agreement.',
                    analyticsCategory: 'Business Toolbox',
                    analyticsSubCategory: 'Contract Review',
                },
                {
                    title: 'Royalty',
                    highlight: 'Guide',
                    message: 'Break down how royalties work for streaming, sync, and performance.',
                    analyticsCategory: 'Business Toolbox',
                    analyticsSubCategory: 'Royalty Guide',
                },
                {
                    title: 'Budget',
                    highlight: 'Planner',
                    message: 'Create a realistic music project budget with cost-saving strategies.',
                    analyticsCategory: 'Business Toolbox',
                    analyticsSubCategory: 'Budget Planner',
                },
                {
                    title: 'Revenue',
                    highlight: 'Optimizer',
                    message: 'Identify untapped revenue streams for my music catalog.',
                    analyticsCategory: 'Business Toolbox',
                    analyticsSubCategory: 'Revenue Optimizer',
                },
            ],
        },
        {
            title: 'Creative Lab',
            icon: <Sliders className="w-3 h-3 text-[#E91E63]" />,
            options: [
                {
                    title: 'Reference',
                    highlight: 'Finder',
                    message: 'Help me identify reference tracks that match my creative vision.',
                    analyticsCategory: 'Creative Lab',
                    analyticsSubCategory: 'Reference Finder',
                },
                {
                    title: 'Mood',
                    highlight: 'Generator',
                    message: 'Develop a mood board and sonic palette for my next production.',
                    analyticsCategory: 'Creative Lab',
                    analyticsSubCategory: 'Mood Generator',
                },
                {
                    title: 'Block',
                    highlight: 'Breaker',
                    message: 'Provide creative exercises to overcome my current creative block.',
                    analyticsCategory: 'Creative Lab',
                    analyticsSubCategory: 'Block Breaker',
                },
                {
                    title: 'Trend',
                    highlight: 'Analyzer',
                    message:
                        'Analyze current production trends in my genre without compromising originality.',
                    analyticsCategory: 'Creative Lab',
                    analyticsSubCategory: 'Trend Analyzer',
                },
            ],
        },
        {
            title: 'Career Growth',
            icon: <Building2 className="w-3 h-3 text-[#9C27B0]" />,
            options: [
                {
                    title: 'Audience',
                    highlight: 'Analysis',
                    message:
                        'Analyze potential target audiences and engagement strategies for my music.',
                    analyticsCategory: 'Career Growth',
                    analyticsSubCategory: 'Audience Analysis',
                },
                {
                    title: 'Career',
                    highlight: 'Planning',
                    message:
                        'Develop a strategic 1-year career growth plan based on my current position.',
                    analyticsCategory: 'Career Growth',
                    analyticsSubCategory: 'Career Planning',
                },
                {
                    title: 'Skill',
                    highlight: 'Roadmap',
                    message:
                        'Create a personalized skill development plan to reach my music goals.',
                    analyticsCategory: 'Career Growth',
                    analyticsSubCategory: 'Skill Development',
                },
                {
                    title: 'Brand',
                    highlight: 'Building',
                    message:
                        'Guide me in creating a consistent and authentic artist brand identity.',
                    analyticsCategory: 'Career Growth',
                    analyticsSubCategory: 'Brand Building',
                },
            ],
        },
    ];

    // Shuffle the actions array using Fisher-Yates algorithm
    const shuffleArray = useCallback((array: Action[]): Action[] => {
        const shuffledArray = [...array];
        for (let i = shuffledArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
        }
        return shuffledArray;
    }, []);

    // Memoize the shuffled array so it's consistent during this render cycle
    // We're not providing any dependencies, so a new shuffle happens on each component mount
    const actions = useMemo(() => shuffleArray(actionsData), []);

    useClickOutside(ref, () => setSelectedAction(null));

    function toggleSelectedAction(action: Action) {
        setSelectedAction(selectedAction?.title === action.title ? null : action);
    }

    const isActionSelected = !!selectedAction;

    return (
        <>
            <div ref={ref}>
                {/* Action Buttons */}
                <div className="flex gap-2 mb-2 justify-center flex-wrap">
                    {actions.map((action, index) => (
                        <motion.div
                            key={action.title}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <ActionButton
                                {...action}
                                onClick={() => toggleSelectedAction(action)}
                                disabled={
                                    selectedAction?.title !== action.title &&
                                    isActionSelected &&
                                    !action.isProduction
                                }
                            />
                        </motion.div>
                    ))}
                </div>

                <AnimatePresence>
                    {isActionSelected && (
                        <SuggestionsMenu
                            onSelect={(message, analyticsCategory, analyticsSubCategory) => {
                                toggleSelectedAction(selectedAction);
                                onButtonChat(message, analyticsCategory, analyticsSubCategory);
                            }}
                            options={selectedAction.options}
                        />
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}
