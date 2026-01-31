"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FileSystemService, IFile } from '@/services/FileSystemService';

interface FileSystemContextType {
    files: IFile[];
    trashFiles: IFile[];
    isLoading: boolean;
    error: string | null;
    refreshFiles: () => Promise<void>;
    createFile: (name: string, content?: string, type?: string, isPublic?: boolean) => Promise<IFile>;
    updateFile: (id: string, content: string, isPublic?: boolean) => Promise<IFile>;
    deleteFile: (id: string) => Promise<void>;
    restoreFile: (id: string) => Promise<void>;
}

const FileSystemContext = createContext<FileSystemContextType | undefined>(undefined);

export const FileSystemProvider = ({ children }: { children: ReactNode }) => {
    const [files, setFiles] = useState<IFile[]>([]);
    const [trashFiles, setTrashFiles] = useState<IFile[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const refreshFiles = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [activeFiles, trashedFiles] = await Promise.all([
                FileSystemService.fetchFiles(false),
                FileSystemService.fetchFiles(true)
            ]);
            setFiles(activeFiles);
            setTrashFiles(trashedFiles);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refreshFiles();
    }, []);

    const createFile = async (name: string, content?: string, type?: string, isPublic?: boolean) => {
        try {
            const newFile = await FileSystemService.createFile(name, content, type, isPublic);
            await refreshFiles(); // Refresh list
            return newFile;
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const updateFile = async (id: string, content: string, isPublic?: boolean) => {
        try {
            const updatedFile = await FileSystemService.updateFile(id, content, isPublic);
            await refreshFiles();
            return updatedFile;
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const deleteFile = async (id: string) => {
        try {
            await FileSystemService.deleteFile(id);
            await refreshFiles();
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const restoreFile = async (id: string) => {
        try {
            await FileSystemService.restoreFile(id);
            await refreshFiles();
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    return (
        <FileSystemContext.Provider
            value={{
                files,
                trashFiles,
                isLoading,
                error,
                refreshFiles,
                createFile,
                updateFile,
                deleteFile,
                restoreFile,
            }}
        >
            {children}
        </FileSystemContext.Provider>
    );
};

export const useFileSystem = () => {
    const context = useContext(FileSystemContext);
    if (context === undefined) {
        throw new Error('useFileSystem must be used within a FileSystemProvider');
    }
    return context;
};
