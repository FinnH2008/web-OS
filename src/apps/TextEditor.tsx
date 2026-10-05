'use client';

import { useFileSystemStore } from '@/store/fileSystemStore';
import { useWindowStore } from '@/store/windowStore';
import { useState, useRef } from 'react';
import { Save } from 'lucide-react';

export default function TextEditor() {
    const { activeWindowId, windows } = useWindowStore();
    const { updateNode, getNodeById } = useFileSystemStore();

    const windowData = windows.find(w => w.id === activeWindowId);
    const fileId = windowData?.content?.fileId as string | undefined;

    const fileNode = fileId ? getNodeById(fileId) : null;
    const initialContent = fileNode?.content || '';

    const [content, setContent] = useState(initialContent);
    const [isSaved, setIsSaved] = useState(true);
    const currentFileIdRef = useRef(fileId);

    // Sync content if fileId changes (e.g. reused window for different file)
    if (fileId !== currentFileIdRef.current) {
        setContent(initialContent);
        setIsSaved(true);
        currentFileIdRef.current = fileId;
    }

    const handleSave = () => {
        if (fileId) {
            updateNode(fileId, { content });
            setIsSaved(true);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
        setIsSaved(false);
    };

    if (!fileId) {
        return <div className="h-full flex items-center justify-center text-white/50">No file selected</div>;
    }

    return (
        <div className="flex flex-col h-full bg-black/40 text-white">
            <div className="flex items-center justify-between p-2 border-b border-white/10 bg-white/5">
                <span className="text-sm font-medium opacity-80 flex items-center gap-2">
                    {fileNode?.name || 'Unknown File'}
                    {!isSaved && <span className="w-2 h-2 rounded-full bg-yellow-500 inline-block"></span>}
                </span>

                <button
                    onClick={handleSave}
                    disabled={isSaved}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-500/20 hover:bg-blue-500/40 text-blue-300 rounded text-sm disabled:opacity-50 transition-colors"
                >
                    <Save className="w-4 h-4" /> Save
                </button>
            </div>

            <textarea
                value={content}
                onChange={handleChange}
                className="flex-1 w-full bg-transparent border-none outline-none resize-none p-4 text-gray-200 font-mono text-sm"
                spellCheck={false}
                placeholder="Start typing..."
            />
        </div>
    );
}
