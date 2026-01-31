"use client";

import React, { useState } from 'react';
import { Search, Monitor, Wifi, Bluetooth, User, Palette, LayoutGrid, Battery, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('System');
    const { isDarkMode, toggleTheme } = useTheme();
    const { user } = useAuth();

    const menuItems = [
        { name: 'System', icon: Monitor },
        { name: 'Bluetooth & devices', icon: Bluetooth },
        { name: 'Network & internet', icon: Wifi },
        { name: 'Personalization', icon: Palette },
        { name: 'Apps', icon: LayoutGrid },
        { name: 'Accounts', icon: User },
    ];

    return (
        <div className="w-full h-full flex bg-[#f3f3f3] dark:bg-[#2b2b2b] transition-colors">
            {/* Sidebar */}
            <div className="w-64 flex flex-col p-4 gap-1">
                <div className="flex items-center gap-3 px-4 py-3 mb-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">U</div>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold dark:text-gray-200">{user?.name || 'User'}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{user?.email || 'Local Account'}</span>
                    </div>
                </div>

                <div className="relative mb-4 px-2">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input
                        type="text"
                        placeholder="Find a setting"
                        className="w-full bg-white dark:bg-[#333] border border-gray-300 dark:border-gray-600 rounded-md py-1.5 pl-8 pr-4 text-xs focus:outline-none focus:border-blue-500 dark:text-gray-200 dark:placeholder-gray-500 transition-colors"
                    />
                </div>

                {menuItems.map((item) => (
                    <button
                        key={item.name}
                        onClick={() => setActiveTab(item.name)}
                        className={`flex items-center gap-3 px-4 py-2 rounded-md text-sm transition-colors ${activeTab === item.name ? 'bg-white dark:bg-white/10 shadow-sm text-blue-600 dark:text-blue-400 font-medium' : 'hover:bg-gray-200 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300'}`}
                    >
                        <item.icon size={16} />
                        {item.name}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="flex-1 bg-[#fafafa] dark:bg-[#202020] p-8 overflow-y-auto rounded-tl-lg border-l border-gray-200 dark:border-gray-700 transition-colors">
                <h1 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-200">{activeTab}</h1>

                {activeTab === 'System' && (
                    <div className="flex flex-col gap-4">
                        <div className="bg-white dark:bg-[#2b2b2b] p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                            <Monitor size={24} className="text-gray-500" />
                            <div>
                                <h3 className="text-sm font-medium dark:text-gray-200">Display</h3>
                                <p className="text-xs text-gray-500">Monitors, brightness, night light, display profile</p>
                            </div>
                            <span className="ml-auto text-gray-400">&gt;</span>
                        </div>
                        <div className="bg-white dark:bg-[#2b2b2b] p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                            <Battery size={24} className="text-gray-500" />
                            <div>
                                <h3 className="text-sm font-medium dark:text-gray-200">Power & battery</h3>
                                <p className="text-xs text-gray-500">Sleep, battery usage, battery saver</p>
                            </div>
                            <span className="ml-auto text-gray-400">&gt;</span>
                        </div>
                    </div>
                )}

                {activeTab === 'Personalization' && (
                    <div className="flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div
                                className={`aspect-video rounded-md relative overflow-hidden cursor-pointer border-2 transition-all ${!isDarkMode ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent'}`}
                                onClick={() => isDarkMode && toggleTheme()}
                            >
                                <div className="absolute inset-0 bg-blue-100 flex items-center justify-center">
                                    <div className="bg-white p-2 rounded shadow text-xs text-gray-800">Light Mode</div>
                                </div>
                                <div className="absolute bottom-2 right-2 text-blue-600 text-xs font-medium flex items-center gap-1">
                                    <Sun size={12} /> Light
                                </div>
                            </div>
                            <div
                                className={`aspect-video rounded-md relative overflow-hidden cursor-pointer border-2 transition-all ${isDarkMode ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-transparent'}`}
                                onClick={() => !isDarkMode && toggleTheme()}
                            >
                                <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                                    <div className="bg-[#333] p-2 rounded shadow text-xs text-gray-200">Dark Mode</div>
                                </div>
                                <div className="absolute bottom-2 right-2 text-blue-400 text-xs font-medium flex items-center gap-1">
                                    <Moon size={12} /> Dark
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-[#2b2b2b] p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4 transition-colors">
                            <Palette size={24} className="text-gray-500 dark:text-gray-400" />
                            <div>
                                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-200">Select Theme</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Choose your preferred Windows mode</p>
                            </div>
                            <button
                                onClick={toggleTheme}
                                className="ml-auto px-3 py-1.5 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 rounded text-xs font-medium transition-colors text-gray-700 dark:text-gray-200"
                            >
                                {isDarkMode ? 'Switch to Light' : 'Switch to Dark'}
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'Accounts' && <AccountSettings />}

                {/* Placeholder for other tabs */}
                {activeTab !== 'System' && activeTab !== 'Personalization' && activeTab !== 'Accounts' && (
                    <div className="text-gray-500 text-sm">Settings for {activeTab} are not implemented in this demo.</div>
                )}
            </div>
        </div>
    );
};

// Sub-component for Account Settings
const AccountSettings = () => {
    const { user, updateUser } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [avatar, setAvatar] = useState(user?.avatar || '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 1024 * 1024) { // 1MB limit
                setMessage('Image size must be less than 1MB');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage('');

        try {
            const res = await fetch('/api/auth/update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    email,
                    avatar,
                    password: newPassword || undefined,
                    currentPassword: newPassword ? currentPassword : undefined
                }),
            });
            const data = await res.json();
            if (data.success) {
                updateUser(data.data);
                setMessage('Profile updated successfully!');
                setNewPassword('');
                setCurrentPassword('');
            } else {
                setMessage(data.error || 'Failed to update profile');
            }
        } catch (err) {
            setMessage('An error occurred');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 max-w-md">
            <div className="bg-white dark:bg-[#2b2b2b] p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex items-center justify-center text-xl font-bold text-gray-500 dark:text-gray-400 relative group">
                        {avatar ? <img src={avatar} alt="Avatar" className="w-full h-full object-cover" /> : (name?.[0]?.toUpperCase() || 'U')}

                        <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity text-white text-xs text-center p-1">
                            Change
                            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                        </label>
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-200">{user?.name}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                    </div>
                </div>

                <form onSubmit={handleSave} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Display Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm bg-white dark:bg-[#333] text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm bg-white dark:bg-[#333] text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 my-2 pt-4">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-200 mb-3">Security</h4>

                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">New Password</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Leave blank to keep current"
                                    className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm bg-white dark:bg-[#333] text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            {newPassword && (
                                <div className="flex flex-col gap-1 animate-in slide-in-from-top-2">
                                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Current Password (Required)</label>
                                    <input
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        placeholder="Enter current password to confirm"
                                        className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm bg-white dark:bg-[#333] text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {message && (
                        <div className={`text-xs px-2 py-1 rounded ${message.includes('success') ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSaving}
                        className="mt-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
                    >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Settings;
