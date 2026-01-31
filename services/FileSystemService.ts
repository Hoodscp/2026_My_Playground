export interface IFile {
    _id: string;
    name: string;
    content: string;
    type: string;
    owner: string;
    isPublic: boolean;
    isTrashed: boolean;
    createdAt: string;
    updatedAt: string;
}

export const FileSystemService = {
    fetchFiles: async (trash: boolean = false): Promise<IFile[]> => {
        const res = await fetch(`/api/files?trash=${trash}`);
        const data = await res.json();
        if (!data.success) {
            throw new Error('Failed to fetch files');
        }
        return data.data;
    },

    async createFile(name: string, content: string = '', type: string = 'text', isPublic: boolean = false): Promise<IFile> {
        const response = await fetch('/api/files', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, content, type, isPublic }),
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.error);
        return data.data;
    },

    async updateFile(id: string, content: string, isPublic?: boolean): Promise<IFile> {
        const body: any = { content };
        if (isPublic !== undefined) body.isPublic = isPublic;

        const response = await fetch(`/api/files/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.error);
        return data.data;
    },

    deleteFile: async (id: string): Promise<void> => {
        const res = await fetch(`/api/files/${id}`, {
            method: 'DELETE',
        });
        const data = await res.json();
        if (!data.success) {
            throw new Error(data.error?.message || 'Failed to delete file');
        }
    },

    restoreFile: async (id: string): Promise<void> => {
        const res = await fetch(`/api/files/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isTrashed: false }),
        });
        const data = await res.json();
        if (!data.success) {
            throw new Error(data.error || 'Failed to restore file');
        }
    },
};
