import { motion } from 'framer-motion';
import Divider from '../../ui/divider';

interface ProductionMenuProps {
    onSelect: (message: string, analyticsCategory: string, analyticsSubCategory: string) => void;
    options?: Array<{
        title: string;
        highlight: string;
        message: string;
        analyticsCategory: string;
        analyticsSubCategory: string;
    }>;
}

export function SuggestionsMenu({ onSelect, options = [] }: ProductionMenuProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-0"
        >
            {options.map((option, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, velocity: 0 }}
                >
                    <button
                        onClick={() =>
                            onSelect(
                                option.message,
                                option.analyticsCategory,
                                option.analyticsSubCategory
                            )
                        }
                        className="w-full text-left py-[8px] px-4 transition-colors group"
                    >
                        <div className="text-xs z-10">
                            <span className="text-text-primary font-primary">{option.title} </span>
                            <span className="text-text-primary font-semibold group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-accent">
                                {option.highlight}
                            </span>
                        </div>
                    </button>
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 0, width: 0 }}
                        animate={{ opacity: 1, x: 20, width: '100%' }}
                        exit={{ opacity: 0, x: 0, width: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Divider className="w-1/2" />
                    </motion.div>
                </motion.div>
            ))}
        </motion.div>
    );
}
