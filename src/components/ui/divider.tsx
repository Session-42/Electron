import { HTMLAttributes } from 'react';

export default function Divider({ ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div {...props}>
            <div className="h-px bg-border-secondary" />
        </div>
    );
}
