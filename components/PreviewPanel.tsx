
import React, { useState } from 'react';
import { LogEntry } from '../types';
import { ChevronDownIcon, ChevronUpIcon, TrashIcon, TerminalIcon } from './icons/Icons';

interface PreviewPanelProps {
    srcDoc: string;
    logs: LogEntry[];
    iframeRef: React.RefObject<HTMLIFrameElement>;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({ srcDoc, logs, iframeRef }) => {
    const [isConsoleOpen, setConsoleOpen] = useState(true);
    const [localLogs, setLocalLogs] = useState<LogEntry[]>([]);

    React.useEffect(() => {
        setLocalLogs(logs);
    }, [logs]);

    const clearConsole = () => {
        setLocalLogs([]);
    };

    const getLogColor = (type: LogEntry['type']) => {
        switch (type) {
            case 'error': return 'text-red-400';
            case 'warn': return 'text-yellow-400';
            default: return 'text-gray-300';
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-800">
            <div className={`flex-grow ${isConsoleOpen ? 'h-3/5' : 'h-full'}`}>
                <iframe
                    ref={iframeRef}
                    srcDoc={srcDoc}
                    title="preview"
                    sandbox="allow-scripts allow-same-origin"
                    className="w-full h-full border-none bg-white"
                />
            </div>
            {isConsoleOpen && <div className="h-1 bg-gray-700 cursor-row-resize"></div>}
            <div className={`bg-gray-900 border-t border-gray-700 ${isConsoleOpen ? 'flex-grow h-2/5 flex flex-col' : ''}`}>
                <div className="flex items-center justify-between p-2 bg-gray-800 cursor-pointer" onClick={() => setConsoleOpen(!isConsoleOpen)}>
                    <div className="flex items-center space-x-2">
                        <TerminalIcon />
                        <span className="font-semibold">Console</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button onClick={(e) => { e.stopPropagation(); clearConsole(); }} className="hover:text-white" title="Clear console"><TrashIcon /></button>
                        {isConsoleOpen ? <ChevronDownIcon /> : <ChevronUpIcon />}
                    </div>
                </div>
                {isConsoleOpen && (
                    <div className="flex-grow p-2 overflow-y-auto font-mono text-sm">
                        {localLogs.length === 0 && <div className="text-gray-500">Console is empty.</div>}
                        {localLogs.map((log, index) => (
                            <div key={index} className={`flex items-start ${getLogColor(log.type)} border-b border-gray-800 py-1`}>
                                <span className="mr-2 text-gray-500">{log.timestamp}</span>
                                <pre className="whitespace-pre-wrap break-all">{log.message}</pre>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PreviewPanel;
