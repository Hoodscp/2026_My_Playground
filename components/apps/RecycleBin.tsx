"use client";

import React, { useState } from 'react';
import { useFileSystem } from '@/context/FileSystemContext';
import { Trash2, RotateCcw, AlertTriangle, FileText, Image as ImageIcon, Video, Folder } from 'lucide-react';
import { format } from 'date-fns';

const RecycleBin = () => {
    const { trashFiles, restoreFile, deleteFile, refreshFiles, isLoading } = useFileSystem();
    const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

    const handleRestore = async () => {
        if (selectedFileId) {
            await restoreFile(selectedFileId);
            setSelectedFileId(null);
        }
    };

    const handleDeleteForever = async () => {
        if (selectedFileId && confirm('Are you sure you want to PERMANENTLY delete this file? This action cannot be undone.')) {
            await deleteFile(selectedFileId);
            setSelectedFileId(null);
        }
    };

    const getFileIcon = (filename: string) => {
        const ext = filename.split('.').pop()?.toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(ext || '')) return <ImageIcon size={32} className="text-gray-400" />;
        if (['mp4', 'mov', 'avi'].includes(ext || '')) return <Video size={32} className="text-gray-400" />;
        return <FileText size={32} className="text-gray-400" />;
    };

    return (
        <div className="w-full h-full flex flex-col bg-[#f3f3f3] dark:bg-[#202020] transition-colors" onClick={() => setSelectedFileId(null)}>
            {/* Toolbar */}
            <div className="h-12 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2b2b2b] flex items-center px-4 gap-2 transition-colors">
                <div className="flex items-center gap-2 mr-4">
                    <Trash2 size={18} className="text-gray-500" />
                    <span className="font-medium text-gray-800 dark:text-gray-200">Recycle Bin</span>
                </div>

                <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-2"></div>

                <button
                    onClick={(e) => { e.stopPropagation(); handleRestore(); }}
                    disabled={!selectedFileId}
                    className="flex items-center gap-2 px-3 py-1.5 rounded hover:bg-gray-100 dark:hover:bg-white/10 text-xs font-medium text-gray-700 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <RotateCcw size={14} /> Restore
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteForever(); }}
                    disabled={!selectedFileId}
                    className="flex items-center gap-2 px-3 py-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-xs font-medium text-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <Trash2 size={14} /> Delete Forever
                </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4">
                {isLoading ? (
                    <div className="text-sm text-gray-500 p-4">Loading...</div>
                ) : trashFiles.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 pb-20">
                        <Trash2 size={48} className="mb-4 opacity-20" />
                        <span className="text-sm">Recycle Bin is empty</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-4">
                        {trashFiles.map(file => (
                            <div
                                key={file._id}
                                className={`flex flex-col items-center p-2 rounded-md border cursor-pointer group transition-colors ${selectedFileId === file._id
                                        ? 'bg-blue-100 border-blue-300 dark:bg-blue-900/40 dark:border-blue-700'
                                        : 'hover:bg-blue-50 dark:hover:bg-white/10 border-transparent hover:border-blue-100 dark:hover:border-white/10'
                                    }`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedFileId(file._id);
                                }}
                            >
                                <div className="w-16 h-16 flex items-center justify-center mb-2 bg-white dark:bg-[#333] rounded-lg shadow-sm grayscale opacity-70">
                                    {getFileIcon(file.name)}
                                </div>
                                <span className="text-xs text-center text-gray-700 dark:text-gray-300 w-full truncate px-1 select-none">{file.name}</span>
                                <span className="text-[10px] text-gray-400 dark:text-gray-500">Deleted {format(new Date(file.updatedAt), 'MMM d')}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Info Bar */}
            <div className="h-6 bg-[#f3f3f3] dark:bg-[#333] border-t border-gray-200 dark:border-black/20 flex items-center px-4 text-[10px] text-gray-500 dark:text-gray-400 transition-colors">
                <span>{trashFiles.length} items</span>
            </div>
        </div>
    );
};

export default RecycleBin;
