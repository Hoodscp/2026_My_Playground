"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation'; // Using next/navigation for app directory

interface User {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (userData: User) => void;
    logout: () => Promise<void>;
    checkUser: () => Promise<void>;
    updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const checkUser = async () => {
        try {
            const res = await fetch('/api/auth/me');
            const data = await res.json();
            if (data.success) {
                setUser(data.data);
            } else {
                setUser(null);
            }
        } catch (error) {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkUser();
    }, []);

    const login = (userData: User) => {
        setUser(userData);
    };

    const logout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            setUser(null);
            router.push('/'); // Or reload to show login screen
            window.location.reload();
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    const updateUser = (userData: Partial<User>) => {
        setUser((prev) => prev ? { ...prev, ...userData } : null);
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, checkUser, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
