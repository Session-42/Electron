import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
    children: React.ReactNode;
    /**
     * Optional target element to mount the portal. 
     * Defaults to document.body if not provided
     */
    container?: HTMLElement;
}

/**
 * Portal component for rendering content outside the normal DOM hierarchy
 * Useful for modals, dialogs, and other overlays to ensure they appear above all other elements
 */
const Portal: React.FC<PortalProps> = ({ children, container }) => {
    // State to hold the DOM element where the portal will be rendered
    const [mountNode, setMountNode] = useState<HTMLElement | null>(null);

    useEffect(() => {
        // Use the container prop if provided, otherwise default to document.body
        const targetElement = container || document.body;
        setMountNode(targetElement);

        // No cleanup needed as we're not creating new elements
    }, [container]);

    // Only render the portal once we have a valid DOM node
    return mountNode ? createPortal(children, mountNode) : null;
};

export default Portal; 