import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { TextFragment } from '~/types/chat.types';

interface TextFragmentBubbleProps {
    fragment: TextFragment;
}

export const TextFragmentBubble = ({ fragment }: TextFragmentBubbleProps) => {
    return (
        <ReactMarkdown
            rehypePlugins={[rehypeRaw]}
            remarkPlugins={[remarkGfm]}
            components={{
                strong: ({ node, children, ...props }) => (
                    <strong className="text-text-primary font-semibold" {...props}>
                        {children}
                    </strong>
                ),
                p: ({ node, ...props }) => (
                    <p className="text-text-primary font-primary" {...props} />
                ),
                h1: ({ node, children, ...props }) => (
                    <h1 className="text-text-primary font-primary" {...props}>
                        {children}
                    </h1>
                ),
                h2: ({ node, children, ...props }) => (
                    <h2 className="text-text-primary font-primary" {...props}>
                        {children}
                    </h2>
                ),
                h3: ({ node, children, ...props }) => (
                    <h3 className="text-text-primary font-primary" {...props}>
                        {children}
                    </h3>
                ),
                h4: ({ node, children, ...props }) => (
                    <h4 className="text-text-primary font-primary" {...props}>
                        {children}
                    </h4>
                ),
                h5: ({ node, children, ...props }) => (
                    <h5 className="text-text-primary font-primary" {...props}>
                        {children}
                    </h5>
                ),
            }}
        >
            {fragment.text}
        </ReactMarkdown>
    );
};
