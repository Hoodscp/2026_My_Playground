"use client";

import React, { useRef, useEffect } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { X, Minus, Square, Maximize2 } from 'lucide-react';
import { useOS } from '@/context/OSContext';

interface WindowProps {
    id: string;
    title: string;
    children: React.ReactNode;
    isActive: boolean;
    isMinimized: boolean;
    isMaximized: boolean;
    zIndex: number;
}

const Window: React.FC<WindowProps> = ({ id, title, children, isActive, isMinimized, isMaximized, zIndex }) => {
    const { closeWindow, minimizeWindow, maximizeWindow, focusWindow } = useOS();
    const constraintsRef = useRef(null);
    const dragControls = useDragControls();

    // Window State
    const [size, setSize] = React.useState({ width: 800, height: 600 });
    const isResizing = React.useRef(false);

    // Resize Handlers
    const handleResize = (e: React.PointerEvent, direction: string) => {
        e.preventDefault();
        e.stopPropagation();
        isResizing.current = true;

        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = size.width;
        const startHeight = size.height;

        const onPointerMove = (moveEvent: PointerEvent) => {
            if (!isResizing.current) return;

            let newWidth = startWidth;
            let newHeight = startHeight;

            if (direction.includes('right')) {
                newWidth = Math.max(300, startWidth + (moveEvent.clientX - startX));
            }
            if (direction.includes('bottom')) {
                newHeight = Math.max(200, startHeight + (moveEvent.clientY - startY));
            }

            setSize({ width: newWidth, height: newHeight });
        };

        const onPointerUp = () => {
            isResizing.current = false;
            document.removeEventListener('pointermove', onPointerMove);
            document.removeEventListener('pointerup', onPointerUp);
            // Re-enable iframe pointer events if we had blocked them
            const iframes = document.querySelectorAll('iframe');
            iframes.forEach(iframe => iframe.style.pointerEvents = 'auto');
        };

        // Disable iframe pointer events during resize to prevent capturing mouse
        const iframes = document.querySelectorAll('iframe');
        iframes.forEach(iframe => iframe.style.pointerEvents = 'none');

        document.addEventListener('pointermove', onPointerMove);
        document.addEventListener('pointerup', onPointerUp);
    };

    if (isMinimized) return null;

    return (
        <motion.div
            drag={!isMaximized}
            dragListener={false}
            dragControls={dragControls}
            dragMomentum={false}
            dragElastic={0}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{
                scale: 1,
                opacity: 1,
                width: isMaximized ? '100vw' : size.width,
                height: isMaximized ? 'calc(100vh - 48px)' : size.height,
                x: isMaximized ? 0 : undefined,
                y: isMaximized ? 0 : undefined,
                top: isMaximized ? 0 : 50,
                left: isMaximized ? 0 : 100,
            }}
            exit={{ scale: 0.9, opacity: 0 }}
            style={{ zIndex, position: 'absolute' }}
            className={`absolute flex flex-col bg-[#f0f0f0] dark:bg-[#202020] rounded-lg shadow-xl overflow-hidden border border-gray-300 dark:border-gray-700 ${isActive ? 'z-50 ring-1 ring-blue-400/50' : 'z-40'}`}
            onMouseDown={() => focusWindow(id)}
        >
            {/* Title Bar */}
            <div
                className="h-8 bg-white dark:bg-[#2b2b2b] border-b border-gray-200 dark:border-black/50 flex items-center justify-between px-2 cursor-default select-none transition-colors"
                onPointerDown={(e) => dragControls.start(e)}
            >
                <span className="text-xs font-medium text-gray-700 dark:text-gray-200">{title}</span>
                <div className="flex items-center">
                    <button
                        onClick={(e) => { e.stopPropagation(); minimizeWindow(id); }}
                        className="p-1.5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-sm transition-colors text-gray-600 dark:text-gray-400"
                    >
                        <Minus size={14} className="text-gray-600" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); maximizeWindow(id); }}
                        className="p-1.5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-sm transition-colors text-gray-600 dark:text-gray-400"
                    >
                        {isMaximized ? <Square size={12} className="text-gray-600" /> : <Square size={12} className="text-gray-600" />}
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); closeWindow(id); }}
                        className="p-1.5 hover:bg-red-500 hover:text-white rounded-md transition-colors text-gray-600 dark:text-gray-400"
                    >
                        <X size={14} className="text-gray-600 group-hover:text-white" />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 bg-white dark:bg-[#202020] overflow-auto relative transition-colors">
                {children}
            </div>

            {/* Resize Handles */}
            {!isMaximized && (
                <>
                    {/* Right Handle */}
                    <div
                        className="absolute right-0 top-0 bottom-2 w-1 cursor-e-resize z-50 hover:bg-blue-400/50 transition-colors"
                        onPointerDown={(e) => handleResize(e, 'right')}
                    />
                    {/* Bottom Handle */}
                    <div
                        className="absolute left-0 right-2 bottom-0 h-1 cursor-s-resize z-50 hover:bg-blue-400/50 transition-colors"
                        onPointerDown={(e) => handleResize(e, 'bottom')}
                    />
                    {/* Corner Handle */}
                    <div
                        className="absolute right-0 bottom-0 w-4 h-4 cursor-se-resize z-50 hover:bg-blue-400/50 transition-colors rounded-tl-md"
                        onPointerDown={(e) => handleResize(e, 'bottom-right')}
                    />
                </>
            )}
        </motion.div>
    );
};

export default Window;
