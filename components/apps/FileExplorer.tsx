import React, { useState } from 'react';
import { useFileSystem } from '@/context/FileSystemContext';
import { useOS } from '@/context/OSContext';
import { Folder, Image as ImageIcon, FileText, Video, Search, ChevronRight, Home, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import Notepad from './Notepad';

const FileExplorer = () => {
    const { files, isLoading, deleteFile } = useFileSystem();
    const { openWindow } = useOS();
    const [activeTab, setActiveTab] = useState('Documents');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

    const sidebarItems = [
        { name: 'Home', icon: Home, category: 'all' },
        { name: 'Documents', icon: FileText, category: 'document' },
        { name: 'Pictures', icon: ImageIcon, category: 'image' },
        { name: 'Videos', icon: Video, category: 'video' },
    ];

    const getFileIcon = (filename: string) => {
        const ext = filename.split('.').pop()?.toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(ext || '')) return <ImageIcon size={32} className="text-purple-500" />;
        if (['mp4', 'mov', 'avi'].includes(ext || '')) return <Video size={32} className="text-red-500" />;
        return <FileText size={32} className="text-blue-500" />;
    };

    const getCategory = (filename: string) => {
        const ext = filename.split('.').pop()?.toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(ext || '')) return 'image';
        if (['mp4', 'mov', 'avi'].includes(ext || '')) return 'video';
        return 'document';
    };

    const handleDelete = async () => {
        if (selectedFileId && confirm('Are you sure you want to move this file to the Recycle Bin?')) {
            await deleteFile(selectedFileId);
            setSelectedFileId(null);
        }
    };

    const handleOpenFile = (file: any) => {
        // Simple logic: Open text files in Notepad, others just show alert for now or generic viewer
        const ext = file.name.split('.').pop()?.toLowerCase();
        if (['txt', 'md', 'json', 'js', 'ts', 'tsx'].includes(ext || '')) {
            openWindow(`notepad-${file._id}`, 'Notepad', <Notepad initialFileId={file._id} />);
        } else {
            alert(`Opening ${file.name} is not fully supported yet.`);
        }
    };

    const filteredFiles = files.filter(file => {
        const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
        const category = getCategory(file.name);

        let matchesTab = true;
        if (activeTab === 'Documents') matchesTab = category === 'document';
        if (activeTab === 'Pictures') matchesTab = category === 'image';
        if (activeTab === 'Videos') matchesTab = category === 'video';
        if (activeTab === 'Home') matchesTab = true;

        return matchesSearch && matchesTab;
    });

    return (
        <div className="w-full h-full flex bg-[#f3f3f3] dark:bg-[#202020] transition-colors" onClick={() => setSelectedFileId(null)}>
            {/* Sidebar */}
            <div className="w-48 flex flex-col pt-4 border-r border-gray-200 dark:border-gray-700 bg-[#f9f9f9] dark:bg-[#252525]">
                <div className="px-4 mb-4">
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Favorites</h3>
                    <div className="flex flex-col gap-1">
                        {sidebarItems.map(item => (
                            <button
                                key={item.name}
                                onClick={() => setActiveTab(item.name)}
                                className={`flex items-center gap-3 px-3 py-1.5 rounded-md text-sm transition-colors ${activeTab === item.name
                                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                    : 'hover:bg-gray-200 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300'
                                    }`}
                            >
                                <item.icon size={16} />
                                {item.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col w-full h-full overflow-hidden">
                {/* Toolbar */}
                <div className="h-12 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2b2b2b] flex items-center px-4 gap-4 transition-colors">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <span onClick={() => setActiveTab('Home')} className="hover:underline cursor-pointer">This PC</span>
                        <ChevronRight size={14} />
                        <span className="font-medium text-gray-800 dark:text-gray-200">{activeTab}</span>
                    </div>

                    {selectedFileId && (
                        <button
                            onClick={handleDelete}
                            className="ml-4 p-1.5 hover:bg-red-100 text-red-500 rounded transition-colors"
                            title="Delete"
                        >
                            <Trash2 size={16} />
                        </button>
                    )}

                    <div className="ml-auto relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder={`Search ${activeTab}`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-[#f3f3f3] dark:bg-[#333] border border-transparent focus:border-blue-500 dark:text-white rounded-md pl-9 pr-4 py-1.5 text-xs w-64 focus:outline-none transition-colors"
                        />
                    </div>
                </div>

                {/* File Grid */}
                <div className="flex-1 overflow-y-auto p-4">
                    {activeTab === 'Home' && <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Quick Access</h2>}

                    {isLoading ? (
                        <div className="text-sm text-gray-500 p-4">Loading files...</div>
                    ) : (
                        <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-4">
                            {filteredFiles.map(file => (
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
                                    onDoubleClick={(e) => {
                                        e.stopPropagation();
                                        handleOpenFile(file);
                                    }}
                                >
                                    <div className="w-16 h-16 flex items-center justify-center mb-2 bg-white dark:bg-[#333] rounded-lg shadow-sm group-hover:shadow transition-shadow">
                                        {getFileIcon(file.name)}
                                    </div>
                                    <span className="text-xs text-center text-gray-700 dark:text-gray-300 w-full truncate px-1 select-none">{file.name}</span>
                                    <span className="text-[10px] text-gray-400 dark:text-gray-500">{format(new Date(file.updatedAt), 'MMM d, yyyy')}</span>
                                    {file.isPublic && <span className="text-[9px] bg-green-100 text-green-700 px-1 rounded border border-green-200 mt-1">Public</span>}
                                </div>
                            ))}
                        </div>
                    )}

                    {!isLoading && filteredFiles.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                            <Folder size={48} className="mb-2 opacity-20" />
                            <span className="text-sm">No files found</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FileExplorer;
