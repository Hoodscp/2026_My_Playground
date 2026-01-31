"use client";

import React from 'react';
import { useOS } from '@/context/OSContext';

import Notepad from '@/components/apps/Notepad';
import Browser from '@/components/apps/Browser';
import Settings from '@/components/apps/Settings';
import Calculator from '@/components/apps/Calculator';
import FileExplorer from '@/components/apps/FileExplorer';
import RecycleBin from '@/components/apps/RecycleBin';
import { FileText, Globe, Settings as SettingsIcon, Trash2, Calculator as CalculatorIcon, Folder } from 'lucide-react';

interface DesktopProps {
    children?: React.ReactNode;
}

const Desktop: React.FC<DesktopProps> = ({ children }) => {
    const { closeStartMenu, openWindow } = useOS();

    const apps = [
        { id: 'notepad', title: 'Notepad', icon: FileText, component: <Notepad />, color: 'text-blue-500' },
        { id: 'browser', title: 'Browser', icon: Globe, component: <Browser />, color: 'text-green-500' },
        { id: 'calculator', title: 'Calculator', icon: CalculatorIcon, component: <Calculator />, color: 'text-orange-500' },
        { id: 'explorer', title: 'File Explorer', icon: Folder, component: <FileExplorer />, color: 'text-yellow-500' },
        { id: 'settings', title: 'Settings', icon: SettingsIcon, component: <Settings />, color: 'text-gray-500' },
        { id: 'trash', title: 'Recycle Bin', icon: Trash2, component: <RecycleBin />, color: 'text-gray-400' },
    ];

    return (
        <div
            className="relative w-full h-screen overflow-hidden bg-cover bg-center"
            style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1732646397396-74895689133b?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
                backgroundSize: 'cover'
            }}
            onClick={() => closeStartMenu()}
        >
            {/* Desktop Icons Grid */}
            <div className="absolute inset-0 p-4 grid grid-flow-col grid-rows-[repeat(auto-fill,100px)] gap-4 w-fit content-start">
                {apps.map((app) => (
                    <div
                        key={app.id}
                        className="flex flex-col items-center justify-center w-24 h-24 hover:bg-white/10 dark:hover:bg-white/5 rounded-md cursor-pointer transition-colors group"
                        onDoubleClick={(e) => {
                            e.stopPropagation();
                            openWindow(app.id, app.title, app.component);
                        }}
                    >
                        <div className={`w-12 h-12 bg-white/10 dark:bg-white/5 rounded-lg mb-1 shadow-md group-hover:scale-105 transition-transform flex items-center justify-center`}>
                            <app.icon size={24} className={app.color} />
                        </div>
                        <span className="text-white text-xs text-shadow text-center line-clamp-2">{app.title}</span>
                    </div>
                ))}
            </div>

            {/* Windows Layer */}
            {children}
        </div>
    );
};

export default Desktop;
