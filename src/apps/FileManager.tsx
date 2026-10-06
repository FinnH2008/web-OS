'use client';

import { useFileSystemStore } from '@/store/fileSystemStore';
import { useWindowStore } from '@/store/windowStore';
import { useState } from 'react';
import { Folder, FileText, ChevronLeft, ChevronRight, File as FileIcon, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FileManager() {
    const [currentPathId, setCurrentPathId] = useState<string>('root');
    const { getChildren, getPath, createNode, deleteNode, updateNode } = useFileSystemStore();
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
        <div className="flex flex-col h-full bg-black/40 text-white font-sans">
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

                <div className="flex-1 flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-lg border border-white/10 overflow-hidden text-sm shadow-inner">
                    {path.map((node, index) => (
                        <div key={node.id} className="flex items-center">
                            <span
                                className="cursor-pointer hover:underline text-white/80 hover:text-white transition-colors"
                                onClick={() => setCurrentPathId(node.id)}
                            >
                                {node.name}
                            </span>
                            {index < path.length - 1 && <span className="mx-1 text-white/40">/</span>}
                        </div>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    <button onClick={handleCreateFolder} className="p-1.5 rounded-lg hover:bg-white/10 group relative transition-colors" title="New Folder">
                        <Folder className="w-5 h-5 text-blue-400" />
                        <Plus className="w-2.5 h-2.5 absolute bottom-1 right-1 text-white drop-shadow-md" />
                    </button>
                    <button onClick={handleCreateFile} className="p-1.5 rounded-lg hover:bg-white/10 group relative transition-colors" title="New File">
                        <FileText className="w-5 h-5 text-white/80" />
                        <Plus className="w-2.5 h-2.5 absolute bottom-1 right-1 text-white drop-shadow-md" />
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-4 grid grid-cols-[repeat(auto-fill,minmax(90px,1fr))] auto-rows-max gap-4 overflow-y-auto content-start">
                {currentChildren.length === 0 && (
                    <div className="col-span-full flex items-center justify-center h-40 text-white/40">
                        This folder is empty
                    </div>
                )}
                {currentChildren.map(node => (
                    <motion.div
                        key={node.id}
                        drag
                        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                        dragElastic={0.2}
                        onDragEnd={(e, info) => {
                            // Simple visual drag, drop functionality into folders requires complex intersection logic
                            // Not implemented in this basic VFS simulation, snaps back.
                        }}
                        className="flex flex-col items-center justify-start p-2 rounded-xl hover:bg-white/10 cursor-pointer group transition-colors relative"
                        onDoubleClick={() => handleNodeDoubleClick(node)}
                    >
                        <div className="w-14 h-14 flex items-center justify-center mb-2">
                            {node.type === 'folder' ? (
                                <Folder className="w-12 h-12 text-blue-400 drop-shadow-lg" />
                            ) : node.name.endsWith('.md') || node.name.endsWith('.txt') ? (
                                <FileText className="w-12 h-12 text-white/90 drop-shadow-lg" />
                            ) : (
                                <FileIcon className="w-12 h-12 text-white/70 drop-shadow-lg" />
                            )}
                        </div>
                        <span className="text-xs text-center break-words w-full px-1 line-clamp-2 text-white/90 group-hover:text-white">
                            {node.name}
                        </span>

                        <button
                            className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 p-1 bg-red-500 rounded-full hover:bg-red-400 text-white shadow-lg transition-all transform scale-75 group-hover:scale-100"
                            onClick={(e) => {
                                e.stopPropagation();
                                if(confirm(`Delete ${node.name}?`)) deleteNode(node.id);
                            }}
                        >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
