"use client";

import React, { useState, useEffect } from 'react';
import { useOS } from '@/context/OSContext';
import { Monitor, Wifi, Battery, Volume2, Globe, FileText, Settings as SettingsIcon } from 'lucide-react';
import { format } from 'date-fns';
import Notepad from '@/components/apps/Notepad';
import Browser from '@/components/apps/Browser';
import Settings from '@/components/apps/Settings';

const Taskbar = () => {
    const { toggleStartMenu, isStartMenuOpen, openWindow } = useOS();
    const [time, setTime] = useState<Date | null>(null);

    useEffect(() => {
        setTime(new Date());
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="fixed bottom-0 left-0 right-0 h-14 bg-[#f3f3f3]/85 dark:bg-[#202020]/85 backdrop-blur-3xl border-t border-white/50 dark:border-white/10 z-50 flex items-center justify-between px-4 transition-colors duration-300">
            {/* Widgets Placeholder (Left) */}
            <div className="flex-1 flex items-center">
                <div className="hidden sm:flex items-center gap-2 px-2 py-1 hover:bg-white/10 rounded-md cursor-pointer transition-colors">
                    <div className="text-xs text-white/90">
                        <span className="block font-semibold">24°C</span>
                        <span className="block text-[10px]">Sunny</span>
                    </div>
                </div>
            </div>

            {/* Center Icons */}
            <div className="flex-1 flex items-center justify-center gap-2">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleStartMenu();
                    }}
                    className={`p-2 rounded-md transition-all duration-200 ${isStartMenuOpen ? 'bg-white/50 dark:bg-white/10 shadow-sm' : 'hover:bg-white/50 dark:hover:bg-white/10'}`}
                    title="Start"
                >
                    <img src="https://img.icons8.com/color/48/000000/windows-10.png" alt="Start" className="w-6 h-6" />
                </button>

                {/* Pinned Apps */}
                <button
                    className="p-2 rounded-md hover:bg-white/10 transition-colors"
                    title="Edge"
                    onClick={() => openWindow('browser', 'Edge', <Browser />)}
                >
                    <div className="w-6 h-6 bg-white/10 rounded-sm flex items-center justify-center">
                        <Globe size={18} className="text-blue-500" />
                    </div>
                </button>
                <button
                    className="p-2 rounded-md hover:bg-white/10 transition-colors"
                    title="Notepad"
                    onClick={() => openWindow('notepad', 'Notepad', <Notepad />)}
                >
                    <div className="w-6 h-6 bg-white/10 rounded-sm flex items-center justify-center">
                        <FileText size={18} className="text-blue-400" />
                    </div>
                </button>
                <button
                    className="p-2 rounded-md hover:bg-white/10 transition-colors"
                    title="Settings"
                    onClick={() => openWindow('settings', 'Settings', <Settings />)}
                >
                    <div className="w-6 h-6 bg-white/10 rounded-sm flex items-center justify-center">
                        <SettingsIcon size={18} className="text-gray-400" />
                    </div>
                </button>
            </div>

            {/* System Tray (Right) */}
            <div className="flex-1 flex items-center justify-end gap-2">
                <div className="flex items-center gap-1 px-2 py-1 hover:bg-white/10 rounded-md cursor-pointer transition-colors">
                    <Monitor size={14} className="text-white" />
                </div>
                <div className="flex items-center gap-2 px-2 py-1 hover:bg-white/10 rounded-md cursor-pointer transition-colors">
                    <Wifi size={14} className="text-white" />
                    <Volume2 size={14} className="text-white" />
                    <Battery size={14} className="text-white" />
                </div>
                <div className="flex flex-col items-end justify-center px-2 hover:bg-white/50 dark:hover:bg-white/10 rounded-md transition-colors cursor-pointer h-full" onClick={toggleStartMenu}>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-200">
                        {time ? format(time, 'h:mm aa') : '...'}
                    </span>
                    <span className="text-[10px] text-gray-600 dark:text-gray-400">
                        {time ? format(time, 'M/d/yyyy') : '...'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Taskbar;
