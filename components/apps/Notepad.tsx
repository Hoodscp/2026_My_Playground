"use client";

import React, { useState, useEffect } from 'react';
import { useFileSystem } from '@/context/FileSystemContext';
import { Loader2, File as FileIcon, Save, FolderOpen, Plus } from 'lucide-react';

interface NotepadProps {
    initialFileId?: string;
}

const Notepad: React.FC<NotepadProps> = ({ initialFileId }) => {
    const { files, createFile, updateFile, refreshFiles, isLoading } = useFileSystem();
    const [content, setContent] = useState('');
    const [currentFileId, setCurrentFileId] = useState<string | null>(null);
    const [filename, setFilename] = useState('Untitled.txt');
    const [showMenu, setShowMenu] = useState(false);
    const [showOpenDialog, setShowOpenDialog] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [showSaveDialog, setShowSaveDialog] = useState(false);
    const [isPublic, setIsPublic] = useState(false);

    // Load initial file if provided
    useEffect(() => {
        if (initialFileId) {
            const file = files.find(f => f._id === initialFileId);
            if (file) {
                setContent(file.content);
                setCurrentFileId(file._id);
                setFilename(file.name);
                setIsPublic(file.isPublic || false);
            } else {
                // If not in current list (maybe trash or not loaded), try fetch or wait
                // For now, rely on files context being loaded. 
                // If files is [] chances are it's loading.
            }
        }
    }, [initialFileId, files]);

    // Close menu when clicking outside
    useEffect(() => {
        const closeMenu = () => setShowMenu(false);
        if (showMenu) {
            document.addEventListener('click', closeMenu);
        }
        return () => document.removeEventListener('click', closeMenu);
    }, [showMenu]);

    const handleNew = () => {
        setContent('');
        setCurrentFileId(null);
        setFilename('Untitled.txt');
    };

    const openSaveDialog = () => {
        if (currentFileId) {
            // If already saved, just update handling
            handleSave();
        } else {
            setFilename(filename === 'Untitled.txt' ? '' : filename);
            setShowSaveDialog(true);
            setShowMenu(false);
        }
    }

    const handleSave = async () => {
        if (!currentFileId && !filename) return; // Should be handled by dialog

        setIsSaving(true);
        try {
            if (currentFileId) {
                // For existing file, we can optionally ask to update public status? 
                // For now just update content. To update permissions we might need 'Save As' or properties.
                // Let's assume simple save updates content.
                await updateFile(currentFileId, content);
            } else {
                let name = filename;
                if (!name) return;
                if (!name.endsWith('.txt')) name += '.txt';

                const newFile = await createFile(name, content, 'text', isPublic);
                setCurrentFileId(newFile._id);
                setFilename(newFile.name);
            }
            setShowSaveDialog(false);
        } catch (err) {
            alert('Failed to save file');
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleOpen = (file: any) => {
        setContent(file.content);
        setCurrentFileId(file._id);
        setFilename(file.name);
        setShowOpenDialog(false);
    };

    return (
        <div className="w-full h-full flex flex-col relative">
            {/* Menu Bar */}
            <div className="flex items-center gap-2 px-2 py-1 bg-white dark:bg-[#333] border-b border-gray-200 dark:border-black/20 text-xs text-gray-600 dark:text-gray-300 select-none transition-colors">
                <div className="relative">
                    <span
                        className="hover:bg-gray-100 dark:hover:bg-white/10 px-2 py-1 rounded cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowMenu(!showMenu);
                        }}
                    >
                        File
                    </span>
                    {showMenu && (
                        <div className="absolute top-full left-0 bg-white dark:bg-[#333] border border-gray-200 dark:border-black/50 shadow-lg rounded-md py-1 min-w-[120px] z-50 flex flex-col">
                            <button
                                className="px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-white/10 flex items-center gap-2"
                                onClick={handleNew}
                            >
                                <Plus size={14} /> New
                            </button>
                            <button
                                className="px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-white/10 flex items-center gap-2"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    refreshFiles();
                                    setShowOpenDialog(true);
                                    setShowMenu(false);
                                }}
                            >
                                <FolderOpen size={14} /> Open...
                            </button>
                            <button
                                className="px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-white/10 flex items-center gap-2"
                                onClick={openSaveDialog}
                            >
                                <Save size={14} /> Save
                            </button>
                        </div>
                    )}
                </div>
                <span className="hover:bg-gray-100 dark:hover:bg-white/10 px-2 py-1 rounded cursor-pointer">Edit</span>
                <span className="hover:bg-gray-100 dark:hover:bg-white/10 px-2 py-1 rounded cursor-pointer">Format</span>
                <span className="hover:bg-gray-100 dark:hover:bg-white/10 px-2 py-1 rounded cursor-pointer">View</span>
                <span className="ml-auto text-gray-400 italic px-2">{filename} {currentFileId ? '' : '(Unsaved)'}</span>
            </div>

            {/* Content Area */}
            <textarea
                className="flex-1 w-full h-full p-4 resize-none focus:outline-none font-mono text-sm bg-white dark:bg-[#1e1e1e] dark:text-gray-200 transition-colors"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Type something..."
                spellCheck={false}
            />

            {/* Status Bar */}
            <div className="h-6 bg-[#f3f3f3] dark:bg-[#333] border-t border-gray-200 dark:border-black/20 flex items-center justify-end px-4 text-[10px] text-gray-500 dark:text-gray-400 gap-4 transition-colors">
                {isSaving && <span className="flex items-center gap-1"><Loader2 size={10} className="animate-spin" /> Saving...</span>}
                <span>Ln {content.split('\n').length}, Col {content.length}</span>
                <span>UTF-8</span>
            </div>

            {/* Save Dialog */}
            {showSaveDialog && (
                <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-8">
                    <div className="bg-white dark:bg-[#2b2b2b] w-full max-w-sm rounded-lg shadow-xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200 p-4 gap-4">
                        <h3 className="font-semibold text-sm dark:text-gray-200">Save File</h3>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs text-gray-500 dark:text-gray-400">Filename</label>
                            <input
                                type="text"
                                value={filename}
                                onChange={(e) => setFilename(e.target.value)}
                                className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm bg-white dark:bg-[#333] dark:text-white focus:outline-none focus:border-blue-500"
                                autoFocus
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isPublic"
                                checked={isPublic}
                                onChange={(e) => setIsPublic(e.target.checked)}
                                className="rounded border-gray-300"
                            />
                            <label htmlFor="isPublic" className="text-sm text-gray-700 dark:text-gray-300 select-none">Make Public (Visible to everyone)</label>
                        </div>
                        <div className="flex justify-end gap-2 mt-2">
                            <button
                                onClick={() => setShowSaveDialog(false)}
                                className="px-3 py-1.5 text-xs bg-gray-100 dark:bg-[#444] hover:bg-gray-200 dark:hover:bg-[#555] rounded text-gray-700 dark:text-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={!filename}
                                className="px-3 py-1.5 text-xs bg-blue-500 hover:bg-blue-600 rounded text-white transition-colors disabled:opacity-50"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Open File Dialog */}
            {showOpenDialog && (
                <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-8">
                    <div className="bg-white dark:bg-[#2b2b2b] w-full max-w-sm h-[80%] rounded-lg shadow-xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-[#333]">
                            <h3 className="font-semibold text-sm dark:text-gray-200">Open File</h3>
                            <button onClick={() => setShowOpenDialog(false)} className="text-gray-500 hover:text-black dark:hover:text-white">&times;</button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2">
                            {isLoading ? (
                                <div className="flex justify-center p-4"><Loader2 className="animate-spin text-gray-400" /></div>
                            ) : files.length === 0 ? (
                                <div className="text-center text-gray-400 text-sm mt-10">No files found.</div>
                            ) : (
                                <div className="flex flex-col gap-1">
                                    {files.map(file => (
                                        <button
                                            key={file._id}
                                            onClick={() => handleOpen(file)}
                                            className="flex items-center gap-3 p-2 hover:bg-blue-50 dark:hover:bg-white/10 hover:text-blue-600 dark:hover:text-blue-400 rounded text-left text-sm group"
                                        >
                                            <FileIcon size={16} className="text-gray-400 group-hover:text-blue-500" />
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium truncate dark:text-gray-200">{file.name}</span>
                                                    {file.isPublic && <span className="text-[9px] bg-green-100 text-green-700 px-1 rounded border border-green-200">Public</span>}
                                                </div>
                                                <span className="text-[10px] text-gray-400">{new Date(file.updatedAt).toLocaleString()}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notepad;
