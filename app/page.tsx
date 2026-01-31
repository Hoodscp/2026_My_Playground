"use client";

import React from 'react';
import { OSProvider } from '@/context/OSContext';
import { FileSystemProvider } from '@/context/FileSystemContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import Desktop from '@/components/os/Desktop';
import LoginScreen from '@/components/os/LoginScreen';
import Taskbar from '@/components/os/Taskbar';
import StartMenu from '@/components/os/StartMenu';
import WindowManager from '@/components/os/WindowManager';

import { ThemeProvider } from '@/context/ThemeContext';

export default function Home() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <OSProvider>
          <FileSystemProvider>
            <OSContent />
          </FileSystemProvider>
        </OSProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

function OSContent() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-black text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <main className="h-screen w-screen overflow-hidden">
      <Desktop>
        <WindowManager />
        <StartMenu />
      </Desktop>
      <Taskbar />
    </main>
  );
}
