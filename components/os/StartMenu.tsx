"use client";

import React, { useRef, useEffect } from 'react';
import { useOS } from '@/context/OSContext';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Power, FileText, Globe, Settings as SettingsIcon, Calculator, Music, Video, Mail, Calendar, Image } from 'lucide-react';
import Notepad from '@/components/apps/Notepad';
import CalculatorApp from '@/components/apps/Calculator';
import Browser from '@/components/apps/Browser';
import Settings from '@/components/apps/Settings';

const StartMenu = () => {
    const { isStartMenuOpen, closeStartMenu, openWindow } = useOS();
    const { user, logout } = useAuth();
    const menuRef = useRef<HTMLDivElement>(null);

    // Close start menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                // closeStartMenu(); // Handled by desktop click
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [closeStartMenu]);

    const pinnedApps = [
        { id: 'browser', title: 'Edge', icon: Globe, color: 'text-blue-500', component: <Browser /> },
        { id: 'notepad', title: 'Notepad', icon: FileText, color: 'text-blue-400', component: <Notepad /> },
        { id: 'settings', title: 'Settings', icon: SettingsIcon, color: 'text-gray-500', component: <Settings /> },
        { id: 'photos', title: 'Photos', icon: Image, color: 'text-purple-500', component: <div className="p-4">Photos App Placeholder</div> },
        { id: 'mail', title: 'Mail', icon: Mail, color: 'text-blue-400', component: <div className="p-4">Mail App Placeholder</div> },
        { id: 'calendar', title: 'Calendar', icon: Calendar, color: 'text-blue-400', component: <div className="p-4">Calendar App Placeholder</div> },
        { id: 'calculator', title: 'Calculator', icon: Calculator, color: 'text-gray-600', component: <CalculatorApp /> },
        { id: 'spotify', title: 'Spotify', icon: Music, color: 'text-green-500', component: <div className="p-4">Spotify App Placeholder</div> },
        { id: 'netflix', title: 'Netflix', icon: Video, color: 'text-red-600', component: <div className="p-4">Netflix App Placeholder</div> },
    ];

    return (
        <AnimatePresence>
            {isStartMenuOpen && (
                <motion.div
                    ref={menuRef}
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: "100%", opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed bottom-14 left-1/2 -translate-x-1/2 w-[640px] max-w-[95vw] h-[700px] max-h-[80vh] bg-[#f3f3f3]/95 dark:bg-[#202020]/95 backdrop-blur-2xl rounded-lg shadow-2xl z-50 flex flex-col overflow-hidden border border-white/40 dark:border-gray-700 transition-colors duration-300"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Search Bar */}
                    <div className="p-6 pb-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="text"
                                placeholder="Type here to search"
                                className="w-full bg-white border border-gray-300 dark:bg-[#202020] dark:border-gray-600 dark:text-white rounded-md py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-500 dark:placeholder-gray-400"
                            />
                        </div>
                    </div>

                    {/* Pinned Section */}
                    <div className="flex-1 px-6 py-4 overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Pinned</h3>
                            <button className="text-xs text-gray-500 hover:bg-gray-200 px-2 py-1 rounded">All apps &gt;</button>
                        </div>

                        <div className="grid grid-cols-6 gap-4">
                            {pinnedApps.map((app) => (
                                <div
                                    key={app.id}
                                    className="flex flex-col items-center justify-center gap-2 p-2 hover:bg-white/50 dark:hover:bg-white/10 rounded-md cursor-pointer transition-colors group"
                                    onClick={() => {
                                        openWindow(app.id, app.title, app.component);
                                        closeStartMenu();
                                    }}
                                >
                                    <div className={`w-8 h-8 bg-white dark:bg-[#333] rounded-md shadow-sm group-hover:scale-105 transition-transform flex items-center justify-center`}>
                                        <app.icon size={20} className={app.color} />
                                    </div>
                                    <span className="text-xs text-gray-700 dark:text-gray-200">{app.title}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recommended Section */}
                    <div className="px-6 py-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Recommended</h3>
                            <button className="text-xs text-gray-500 hover:bg-gray-200 px-2 py-1 rounded">More &gt;</button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="flex items-center gap-3 p-2 hover:bg-white/50 dark:hover:bg-white/10 rounded-md cursor-pointer transition-colors">
                                <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center text-blue-600 font-bold text-xs">W</div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-medium text-gray-700 dark:text-gray-200">Project Proposal.docx</span>
                                    <span className="text-[10px] text-gray-500">2 hours ago</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-2 hover:bg-white/50 dark:hover:bg-white/10 rounded-md cursor-pointer transition-colors">
                                <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center text-green-600 font-bold text-xs">X</div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-medium text-gray-700 dark:text-gray-200">Budget 2025.xlsx</span>
                                    <span className="text-[10px] text-gray-500">Yesterday at 4:20 PM</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="h-16 bg-[#f3f3f3]/50 dark:bg-black/20 border-t border-gray-200/50 dark:border-white/5 flex items-center justify-between px-8 mt-auto">
                        <div className="flex items-center gap-3 hover:bg-white/50 dark:hover:bg-white/10 p-2 rounded-md cursor-pointer transition-colors">
                            <div className="w-8 h-8 bg-gray-400 rounded-full overflow-hidden flex items-center justify-center">
                                {user?.avatar ? (
                                    <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 font-bold text-white flex items-center justify-center">
                                        {user?.name?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                )}
                            </div>
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-200">{user?.name || 'User'}</span>
                        </div>
                        <button
                            className="p-2 hover:bg-white/50 dark:hover:bg-white/10 rounded-md transition-colors text-gray-700 dark:text-gray-200"
                            onClick={logout}
                            title="Sign out"
                        >
                            <Power size={18} />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default StartMenu;
