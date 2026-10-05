import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type FileType = 'file' | 'folder';

export interface FileNode {
  id: string;
  name: string;
  type: FileType;
  parentId: string | null;
  content?: string;
  createdAt: number;
  updatedAt: number;
}

interface FileSystemState {
  nodes: FileNode[];
  createNode: (node: Omit<FileNode, 'id' | 'createdAt' | 'updatedAt'>) => void;
  deleteNode: (id: string) => void;
  updateNode: (id: string, updates: Partial<FileNode>) => void;
  getNodeById: (id: string) => FileNode | undefined;
  getChildren: (parentId: string | null) => FileNode[];
  getPath: (id: string) => FileNode[];
}

const defaultNodes: FileNode[] = [
  { id: 'root', name: 'Root', type: 'folder', parentId: null, createdAt: Date.now(), updatedAt: Date.now() },
  { id: 'desktop', name: 'Desktop', type: 'folder', parentId: 'root', createdAt: Date.now(), updatedAt: Date.now() },
  { id: 'documents', name: 'Documents', type: 'folder', parentId: 'root', createdAt: Date.now(), updatedAt: Date.now() },
  { id: 'readme', name: 'README.md', type: 'file', parentId: 'desktop', content: '# Welcome to Virtual DexTop\n\nThis is your new web-based operating system.', createdAt: Date.now(), updatedAt: Date.now() },
];

export const useFileSystemStore = create<FileSystemState>()(
  persist(
    (set, get) => ({
      nodes: defaultNodes,

      createNode: (nodeData) => set((state) => {
        const newNode: FileNode = {
          ...nodeData,
          id: `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        return { nodes: [...state.nodes, newNode] };
      }),

      deleteNode: (id) => set((state) => {
        // Recursively delete children
        const getIdsToDelete = (nodeId: string, allNodes: FileNode[]): string[] => {
            const children = allNodes.filter(n => n.parentId === nodeId);
            return [nodeId, ...children.flatMap(c => getIdsToDelete(c.id, allNodes))];
        };
        const idsToDelete = getIdsToDelete(id, state.nodes);
        return { nodes: state.nodes.filter(n => !idsToDelete.includes(n.id)) };
      }),

      updateNode: (id, updates) => set((state) => ({
        nodes: state.nodes.map(n => n.id === id ? { ...n, ...updates, updatedAt: Date.now() } : n)
      })),

      getNodeById: (id) => {
          return get().nodes.find(n => n.id === id);
      },

      getChildren: (parentId) => {
          return get().nodes.filter(n => n.parentId === parentId);
      },

      getPath: (id) => {
          const path: FileNode[] = [];
          let currentId: string | null = id;
          const { nodes } = get();

          while (currentId) {
              const node = nodes.find(n => n.id === currentId);
              if (node) {
                  path.unshift(node);
                  currentId = node.parentId;
              } else {
                  break;
              }
          }
          return path;
      }
    }),
    {
      name: 'vfs-storage',
    }
  )
);
