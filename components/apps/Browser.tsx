"use client";

import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Search } from 'lucide-react';

const Browser = () => {
    const [url, setUrl] = useState('https://www.google.com/webhp?igu=1');
    const [inputUrl, setInputUrl] = useState('https://www.google.com');

    const handleNavigate = (e: React.FormEvent) => {
        e.preventDefault();
        let target = inputUrl;
        if (!target.startsWith('http')) {
            target = `https://${target}`;
        }
        // Simple check to allow embedding (many sites block iframes, so we use a safe default or specific allowed ones)
        // For demo, we might just stick to Google or Wikipedia if they allow it, or a custom page.
        // Google often blocks iframes. Let's use Wikipedia or Bing or just a placeholder if blocked.
        // Actually, google.com/webhp?igu=1 is a known trick for iframes.
        setUrl(target);
    };

    return (
        <div className="w-full h-full flex flex-col bg-white">
            {/* Browser Toolbar */}
            <div className="h-10 bg-[#f3f3f3] border-b border-gray-200 flex items-center px-2 gap-2">
                <div className="flex items-center gap-1">
                    <button className="p-1 hover:bg-gray-200 rounded-full text-gray-600"><ArrowLeft size={16} /></button>
                    <button className="p-1 hover:bg-gray-200 rounded-full text-gray-600"><ArrowRight size={16} /></button>
                    <button className="p-1 hover:bg-gray-200 rounded-full text-gray-600"><RotateCw size={16} /></button>
                </div>
                <form onSubmit={handleNavigate} className="flex-1">
                    <div className="relative">
                        <input
                            type="text"
                            value={inputUrl}
                            onChange={(e) => setInputUrl(e.target.value)}
                            className="w-full bg-white border border-gray-300 rounded-full py-1 pl-4 pr-8 text-sm focus:outline-none focus:border-blue-500"
                        />
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    </div>
                </form>
            </div>

            {/* Browser Content */}
            <div className="flex-1 relative">
                <iframe
                    src={url}
                    className="w-full h-full border-none"
                    title="Browser"
                    sandbox="allow-scripts allow-same-origin allow-forms"
                />
            </div>
        </div>
    );
};

export default Browser;
