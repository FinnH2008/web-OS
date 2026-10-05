'use client';

import { useState, useRef, useEffect } from 'react';
import { useFileSystemStore } from '@/store/fileSystemStore';
import { useSystemStore } from '@/store/systemStore';

interface CommandOutput {
  id: number;
  content: string | React.ReactNode;
  type: 'input' | 'output' | 'error';
}

export default function TerminalApp() {
  const [history, setHistory] = useState<CommandOutput[]>([
    { id: 0, content: 'Virtual DexTop Terminal v1.0.0', type: 'output' },
    { id: 1, content: 'Type "help" for a list of commands.', type: 'output' },
  ]);
  const [input, setInput] = useState('');
  const [currentPathId, setCurrentPathId] = useState('root');

  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const user = useSystemStore(state => state.user);
  const { getPath, getChildren,  createNode, deleteNode } = useFileSystemStore();

  const currentPath = getPath(currentPathId).map(n => n.name).join('/');
  const prompt = `${user?.username || 'user'}@dextop:~/${currentPath}$ `;

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.trim();
    const args = cmd.split(' ').filter(Boolean);
    const command = args[0].toLowerCase();

    setHistory(prev => [...prev, { id: Date.now(), content: `${prompt}${cmd}`, type: 'input' }]);

    let output: string | React.ReactNode = '';
    let isError = false;

    switch (command) {
      case 'help':
        output = 'Available commands: help, clear, ls, cd, mkdir, touch, rm, whoami, echo';
        break;
      case 'clear':
        setHistory([]);
        setInput('');
        return;
      case 'whoami':
        output = user?.username || 'guest';
        break;
      case 'echo':
        output = args.slice(1).join(' ');
        break;
      case 'ls':
        const children = getChildren(currentPathId);
        output = (
            <div className="flex flex-wrap gap-4">
                {children.map(c => (
                    <span key={c.id} className={c.type === 'folder' ? 'text-blue-400 font-bold' : 'text-white'}>
                        {c.name}
                    </span>
                ))}
            </div>
        );
        if (children.length === 0) output = '';
        break;
      case 'pwd':
        output = `/${currentPath}`;
        break;
      case 'cd':
        if (!args[1]) {
            setCurrentPathId('root');
        } else if (args[1] === '..') {
            const pathArr = getPath(currentPathId);
            if (pathArr.length > 1) {
                setCurrentPathId(pathArr[pathArr.length - 2].id);
            }
        } else {
            const target = getChildren(currentPathId).find(c => c.name === args[1] && c.type === 'folder');
            if (target) {
                setCurrentPathId(target.id);
            } else {
                output = `cd: ${args[1]}: No such file or directory`;
                isError = true;
            }
        }
        break;
      case 'mkdir':
        if (!args[1]) {
            output = 'mkdir: missing operand';
            isError = true;
        } else {
            createNode({ name: args[1], type: 'folder', parentId: currentPathId });
        }
        break;
      case 'touch':
        if (!args[1]) {
            output = 'touch: missing file operand';
            isError = true;
        } else {
            createNode({ name: args[1], type: 'file', parentId: currentPathId, content: '' });
        }
        break;
      case 'rm':
        if (!args[1]) {
             output = 'rm: missing operand';
             isError = true;
        } else {
             const target = getChildren(currentPathId).find(c => c.name === args[1]);
             if (target) {
                 deleteNode(target.id);
             } else {
                 output = `rm: cannot remove '${args[1]}': No such file or directory`;
                 isError = true;
             }
        }
        break;
      default:
        output = `Command not found: ${command}`;
        isError = true;
    }

    if (output) {
      setHistory(prev => [...prev, { id: Date.now() + 1, content: output, type: isError ? 'error' : 'output' }]);
    }

    setInput('');
  };

  return (
    <div
        className="h-full w-full bg-black/80 text-gray-200 font-mono text-sm p-2 overflow-auto custom-scrollbar flex flex-col"
        onClick={() => inputRef.current?.focus()}
    >
      <div className="flex-1 flex flex-col">
          {history.map((item) => (
            <div
                key={item.id}
                className={`mb-1 ${item.type === 'error' ? 'text-red-400' : ''}`}
            >
              {item.type === 'input' ? (
                 <span>{item.content}</span>
              ) : (
                 <div className="whitespace-pre-wrap">{item.content}</div>
              )}
            </div>
          ))}

          <form onSubmit={handleCommand} className="flex items-center mt-1">
            <span className="text-green-400 mr-2 shrink-0">{prompt}</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent outline-none border-none text-white focus:ring-0 p-0"
              autoFocus
              spellCheck={false}
              autoComplete="off"
            />
          </form>
          <div ref={endOfMessagesRef} />
      </div>
    </div>
  );
}
