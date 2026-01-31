"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface WindowState {
  id: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  component: ReactNode;
}

interface OSContextType {
  isStartMenuOpen: boolean;
  toggleStartMenu: () => void;
  closeStartMenu: () => void;
  windows: WindowState[];
  openWindow: (id: string, title: string, component: ReactNode) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
}

const OSContext = createContext<OSContextType | undefined>(undefined);

export const OSProvider = ({ children }: { children: ReactNode }) => {
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);

  const toggleStartMenu = () => setIsStartMenuOpen(!isStartMenuOpen);
  const closeStartMenu = () => setIsStartMenuOpen(false);

  const openWindow = (id: string, title: string, component: ReactNode) => {
    setWindows((prev) => {
      const existing = prev.find((w) => w.id === id);
      if (existing) {
        return prev.map((w) =>
          w.id === id ? { ...w, isOpen: true, isMinimized: false, zIndex: prev.length + 1 } : w
        );
      }
      return [
        ...prev,
        {
          id,
          title,
          isOpen: true,
          isMinimized: false,
          isMaximized: false,
          zIndex: prev.length + 1,
          component,
        },
      ];
    });
    setActiveWindowId(id);
  };

  const closeWindow = (id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  };

  const minimizeWindow = (id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w))
    );
  };

  const maximizeWindow = (id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMaximized: !w.isMaximized } : w))
    );
  };

  const focusWindow = (id: string) => {
    setWindows((prev) => {
      const maxZ = Math.max(...prev.map((w) => w.zIndex), 0);
      return prev.map((w) =>
        w.id === id ? { ...w, zIndex: maxZ + 1, isMinimized: false } : w
      );
    });
    setActiveWindowId(id);
  };

  return (
    <OSContext.Provider
      value={{
        isStartMenuOpen,
        toggleStartMenu,
        closeStartMenu,
        windows,
        openWindow,
        closeWindow,
        minimizeWindow,
        maximizeWindow,
        focusWindow,
      }}
    >
      {children}
    </OSContext.Provider>
  );
};

export const useOS = () => {
  const context = useContext(OSContext);
  if (context === undefined) {
    throw new Error('useOS must be used within an OSProvider');
  }
  return context;
};
