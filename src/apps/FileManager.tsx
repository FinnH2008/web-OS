'use client';

import { useFileSystemStore } from '@/store/fileSystemStore';
import { useWindowStore } from '@/store/windowStore';
import { useState } from 'react';
import { Folder, FileText, ChevronLeft, ChevronRight, File as FileIcon, Plus, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

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
        <div className="flex flex-col h-full bg-black/40 text-white font-sans">
            {/* Toolbar */}
            <div className="flex items-center gap-4 p-3 bg-black/40 border-b border-white/10">
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => {
                            if (path.length > 1) {
                                setCurrentPathId(path[path.length - 2].id);
                            }
                        }}
                        disabled={path.length <= 1}
                        className="p-1.5 rounded-lg hover:bg-white/10 disabled:opacity-30 transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-white/10 opacity-30 cursor-not-allowed transition-colors">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 flex items-center gap-2 bg-black/50 px-4 py-2 rounded-xl border border-white/10 overflow-hidden text-sm shadow-inner">
                    {path.map((node, index) => (
                        <div key={node.id} className="flex items-center">
                            <span
                                className="cursor-pointer hover:underline text-white/80 hover:text-white transition-colors"
                                onClick={() => setCurrentPathId(node.id)}
                            >
                                {node.name}
                            </span>
                            {index < path.length - 1 && <span className="mx-2 text-white/30">/</span>}
                        </div>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    <button onClick={handleCreateFolder} className="p-2 rounded-xl hover:bg-white/10 group relative transition-colors bg-white/5 border border-white/5" title="New Folder">
                        <Folder className="w-4 h-4 text-blue-400" />
                        <Plus className="w-2.5 h-2.5 absolute bottom-1.5 right-1.5 text-white drop-shadow-md" />
                    </button>
                    <button onClick={handleCreateFile} className="p-2 rounded-xl hover:bg-white/10 group relative transition-colors bg-white/5 border border-white/5" title="New File">
                        <FileText className="w-4 h-4 text-white/80" />
                        <Plus className="w-2.5 h-2.5 absolute bottom-1.5 right-1.5 text-white drop-shadow-md" />
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-6 grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] auto-rows-max gap-4 overflow-y-auto content-start">
                {currentChildren.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center h-48 text-white/30 gap-4">
                        <Folder className="w-16 h-16 opacity-20" />
                        <span>This folder is empty</span>
                    </div>
                )}
                {currentChildren.map(node => (
                    <motion.div
                        key={node.id}
                        drag
                        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                        dragElastic={0.2}
                        className="flex flex-col items-center justify-start p-3 rounded-2xl hover:bg-white/10 cursor-pointer group transition-colors relative"
                        onDoubleClick={() => handleNodeDoubleClick(node)}
                    >
                        <div className="w-16 h-16 flex items-center justify-center mb-3">
                            {node.type === 'folder' ? (
                                <Folder className="w-14 h-14 text-blue-400 drop-shadow-lg" />
                            ) : node.name.endsWith('.md') || node.name.endsWith('.txt') ? (
                                <FileText className="w-14 h-14 text-white/90 drop-shadow-lg" />
                            ) : (
                                <FileIcon className="w-14 h-14 text-white/70 drop-shadow-lg" />
                            )}
                        </div>
                        <span className="text-xs text-center break-words w-full px-1 line-clamp-2 text-white/80 group-hover:text-white font-medium">
                            {node.name}
                        </span>

                        <button
                            className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 p-1.5 bg-red-500 rounded-full hover:bg-red-400 text-white shadow-xl transition-all transform scale-75 group-hover:scale-100"
                            onClick={(e) => {
                                e.stopPropagation();
                                if(confirm(`Delete ${node.name}?`)) deleteNode(node.id);
                            }}
                            title="Delete"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
