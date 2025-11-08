
import React from 'react';
import { XIcon } from '../icons/Icons';

interface HelpModalProps {
    onClose: () => void;
}

const Shortcut: React.FC<{ keys: string; desc: string }> = ({ keys, desc }) => (
    <div className="flex justify-between items-center py-2 border-b border-gray-700">
        <span className="text-gray-300">{desc}</span>
        <kbd className="bg-gray-600 px-2 py-1 rounded-md text-sm font-mono">{keys}</kbd>
    </div>
);


const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-lg p-6 text-white">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Help & Shortcuts</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><XIcon /></button>
                </div>
                <div className="space-y-2">
                    <Shortcut keys="Ctrl/Cmd + S" desc="Save Project (opens Projects modal)" />
                    <Shortcut keys="Ctrl/Cmd + Enter" desc="Run/Refresh Preview" />
                    <Shortcut keys="Ctrl/Cmd + Shift + E" desc="Export Project as ZIP" />
                </div>
                <div className="mt-6 text-center">
                   <button onClick={onClose} className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-md">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HelpModal;
