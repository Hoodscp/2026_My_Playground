"use client";

import React from 'react';
import { useOS } from '@/context/OSContext';
import Window from './Window';
import { AnimatePresence } from 'framer-motion';

const WindowManager = () => {
    const { windows } = useOS();

    return (
        <AnimatePresence>
            {windows.map((window) => (
                <Window
                    key={window.id}
                    id={window.id}
                    title={window.title}
                    isActive={true} // Simplified for now, logic in Context handles zIndex
                    isMinimized={window.isMinimized}
                    isMaximized={window.isMaximized}
                    zIndex={window.zIndex}
                >
                    {window.component}
                </Window>
            ))}
        </AnimatePresence>
    );
};

export default WindowManager;
