
import React, { useState, useRef, useEffect } from 'react';
import { PlayIcon, DownloadIcon, SaveIcon, FolderOpenIcon, CodeIcon, HelpCircleIcon, LinkIcon } from './icons/Icons';

interface ToolbarProps {
    onRun: () => void;
    onDownload: (type: 'html' | 'css' | 'js' | 'single-html' | 'zip' | 'png') => void;
    onSave: () => void;
    onLoad: () => void;
    onToggleLayout: () => void;
    onHelp: () => void;
    onResources: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ onRun, onDownload, onSave, onLoad, onToggleLayout, onHelp, onResources }) => {
    const [isDownloadOpen, setDownloadOpen] = useState(false);
    const downloadRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (downloadRef.current && !downloadRef.current.contains(event.target as Node)) {
                setDownloadOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    
    return (
        <header className="bg-gray-900 text-white p-2 flex items-center justify-between border-b border-gray-700">
            <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-blue-400">Live Web IDE</h1>
            </div>
            <div className="flex items-center space-x-2">
                <button onClick={onRun} className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded-md transition-colors">
                    <PlayIcon />
                    <span>Run</span>
                </button>
                <div className="relative" ref={downloadRef}>
                    <button onClick={() => setDownloadOpen(!isDownloadOpen)} className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-md transition-colors">
                        <DownloadIcon />
                        <span>Download</span>
                    </button>
                    {isDownloadOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10">
                            <a onClick={() => { onDownload('html'); setDownloadOpen(false); }} className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 cursor-pointer">index.html</a>
                            <a onClick={() => { onDownload('css'); setDownloadOpen(false); }} className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 cursor-pointer">styles.css</a>
                            <a onClick={() => { onDownload('js'); setDownloadOpen(false); }} className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 cursor-pointer">script.js</a>
                            <div className="border-t border-gray-700 my-1"></div>
                            <a onClick={() => { onDownload('single-html'); setDownloadOpen(false); }} className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 cursor-pointer">Standalone HTML</a>
                            <a onClick={() => { onDownload('zip'); setDownloadOpen(false); }} className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 cursor-pointer">Project ZIP</a>
                            <a onClick={() => { onDownload('png'); setDownloadOpen(false); }} className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 cursor-pointer">Screenshot (PNG)</a>
                        </div>
                    )}
                </div>
                <button onClick={onSave} className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded-md transition-colors">
                    <SaveIcon />
                    <span>Projects</span>
                </button>
                <button onClick={onResources} className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded-md transition-colors" title="External Resources">
                    <LinkIcon />
                </button>
                <button onClick={onToggleLayout} className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded-md transition-colors" title="Toggle Layout">
                    <CodeIcon />
                </button>
                 <button onClick={onHelp} className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded-md transition-colors" title="Help">
                    <HelpCircleIcon />
                </button>
            </div>
        </header>
    );
};

export default Toolbar;
