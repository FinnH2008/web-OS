'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Home, Search } from 'lucide-react';

export default function BrowserApp() {
    const [url, setUrl] = useState('https://www.wikipedia.org');
    const [input, setInput] = useState('https://www.wikipedia.org');
    const [loading, setLoading] = useState(true);

    const handleNavigate = (e: React.FormEvent) => {
        e.preventDefault();
        let target = input.trim();
        if (!target.startsWith('http://') && !target.startsWith('https://')) {
            target = `https://${target}`;
        }
        setUrl(target);
        setInput(target);
        setLoading(true);
    };

    return (
        <div className="flex flex-col h-full bg-white text-black">
            <div className="flex flex-col border-b border-gray-300 bg-gray-100">
                <div className="flex items-end px-2 pt-2 gap-1 h-8">
                    <div className="bg-white px-4 py-1 rounded-t-lg border-t border-l border-r border-gray-300 text-xs flex items-center gap-2 max-w-[200px]">
                        <span className="truncate">{url}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 p-2 bg-white border-t border-gray-200">
                    <button className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600 transition-colors disabled:opacity-50">
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600 transition-colors disabled:opacity-50" disabled>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                        className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600 transition-colors"
                        onClick={() => setLoading(true)}
                    >
                        <RotateCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                        className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600 transition-colors"
                        onClick={() => { setUrl('https://www.wikipedia.org'); setInput('https://www.wikipedia.org'); }}
                    >
                        <Home className="w-4 h-4" />
                    </button>

                    <form onSubmit={handleNavigate} className="flex-1 flex items-center relative">
                        <div className="absolute left-3 text-gray-400">
                            <Search className="w-3.5 h-3.5" />
                        </div>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="w-full bg-gray-100 border border-gray-300 rounded-full pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                            placeholder="Search or enter web address"
                        />
                    </form>
                </div>
            </div>

            <div className="flex-1 bg-white relative">
                <iframe
                    src={url}
                    className="w-full h-full border-none"
                    onLoad={() => setLoading(false)}
                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                    title="Browser Viewport"
                />
            </div>
        </div>
    );
}
