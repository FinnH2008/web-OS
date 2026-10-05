'use client';

import { useFileSystemStore } from '@/store/fileSystemStore';
import { useWindowStore } from '@/store/windowStore';
import { useState } from 'react';
import { Folder, FileText, ChevronLeft, ChevronRight, File as FileIcon, Plus } from 'lucide-react';

export default function FileManager() {
    const [currentPathId, setCurrentPathId] = useState<string>('root');
    const { getChildren, getPath, createNode, deleteNode } = useFileSystemStore();
    const { openWindow } = useWindowStore();

    const currentChildren = getChildren(currentPathId);
    const path = getPath(currentPathId);

    const handleNodeDoubleClick = (node: { type: string; id: string; name: string }) => {
        if (node.type === 'folder') {
            setCurrentPathId(node.id);
        } else if (node.type === 'file') {
            openWindow({
                type: 'editor',
                title: node.name,
                content: { fileId: node.id }
            });
        }
    };

    const handleCreateFolder = () => {
        const name = prompt('Folder name:');
        if (name) {
            createNode({ name, type: 'folder', parentId: currentPathId });
        }
    };

    const handleCreateFile = () => {
        const name = prompt('File name:');
        if (name) {
            createNode({ name, type: 'file', parentId: currentPathId, content: '' });
        }
    };

    return (
        <div className="flex flex-col h-full bg-black/40 text-white">
            {/* Toolbar */}
            <div className="flex items-center gap-4 p-2 bg-black/40 border-b border-white/10">
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => {
                            if (path.length > 1) {
                                setCurrentPathId(path[path.length - 2].id);
                            }
                        }}
                        disabled={path.length <= 1}
                        className="p-1 rounded hover:bg-white/10 disabled:opacity-50"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button className="p-1 rounded hover:bg-white/10 opacity-50 cursor-not-allowed">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 flex items-center gap-2 bg-black/30 px-3 py-1 rounded-md border border-white/10 overflow-hidden text-sm">
                    {path.map((node, index) => (
                        <div key={node.id} className="flex items-center">
                            <span
                                className="cursor-pointer hover:underline text-white/80"
                                onClick={() => setCurrentPathId(node.id)}
                            >
                                {node.name}
                            </span>
                            {index < path.length - 1 && <span className="mx-1 text-white/40">/</span>}
                        </div>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    <button onClick={handleCreateFolder} className="p-1.5 rounded hover:bg-white/10 group relative" title="New Folder">
                        <Folder className="w-4 h-4 text-blue-400" />
                        <Plus className="w-2 h-2 absolute bottom-1 right-1 text-white" />
                    </button>
                    <button onClick={handleCreateFile} className="p-1.5 rounded hover:bg-white/10 group relative" title="New File">
                        <FileText className="w-4 h-4 text-white/80" />
                        <Plus className="w-2 h-2 absolute bottom-1 right-1 text-white" />
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-4 grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] auto-rows-max gap-4 overflow-y-auto content-start">
                {currentChildren.length === 0 && (
                    <div className="col-span-full flex items-center justify-center h-32 text-white/40">
                        This folder is empty
                    </div>
                )}
                {currentChildren.map(node => (
                    <div
                        key={node.id}
                        className="flex flex-col items-center justify-start p-2 rounded-lg hover:bg-white/10 cursor-pointer group"
                        onDoubleClick={() => handleNodeDoubleClick(node)}
                    >
                        <div className="w-12 h-12 flex items-center justify-center mb-1">
                            {node.type === 'folder' ? (
                                <Folder className="w-10 h-10 text-blue-400 drop-shadow-md" />
                            ) : node.name.endsWith('.md') || node.name.endsWith('.txt') ? (
                                <FileText className="w-10 h-10 text-white/80 drop-shadow-md" />
                            ) : (
                                <FileIcon className="w-10 h-10 text-white/60 drop-shadow-md" />
                            )}
                        </div>
                        <span className="text-xs text-center break-words w-full px-1 line-clamp-2">
                            {node.name}
                        </span>

                        {/* Context menu hint / quick delete */}
                        <button
                            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 p-1 bg-red-500/80 rounded-full hover:bg-red-500 text-white"
                            onClick={(e) => {
                                e.stopPropagation();
                                if(confirm(`Delete ${node.name}?`)) deleteNode(node.id);
                            }}
                        >
                            <svg className="w-2 h-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
