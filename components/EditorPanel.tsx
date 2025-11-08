import React, { useState, useRef } from 'react';
import { EditorType } from '../types';
import { HtmlIcon, CssIcon, JsIcon, EyeIcon } from './icons/Icons';

interface EditorPanelProps {
    htmlCode: string;
    cssCode: string;
    jsCode: string;
    setHtmlCode: (code: string) => void;
    setCssCode: (code: string) => void;
    setJsCode: (code: string) => void;
}

const Editor: React.FC<{ value: string; onChange: (val: string) => void }> = ({ value, onChange }) => (
    <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-full bg-gray-900 text-gray-200 p-4 font-mono text-sm outline-none resize-none"
        spellCheck="false"
    />
);

const WYSIWYGEditor: React.FC<{ value: string; onChange: (val: string) => void }> = ({ value, onChange }) => {
    const editorRef = useRef<HTMLDivElement>(null);

    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
        onChange(e.currentTarget.innerHTML);
    };

    return (
        <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            dangerouslySetInnerHTML={{ __html: value }}
            className="w-full h-full bg-white text-black p-4 font-sans text-sm outline-none"
            style={{ minHeight: '100%' }}
        />
    );
};


const EditorPanel: React.FC<EditorPanelProps> = ({ htmlCode, cssCode, jsCode, setHtmlCode, setCssCode, setJsCode }) => {
    const [activeEditor, setActiveEditor] = useState<EditorType>('html');
    const [isWysiwyg, setIsWysiwyg] = useState(false);

    // FIX: Replaced JSX.Element with React.ReactElement to fix "Cannot find namespace 'JSX'" error.
    const editors: { id: EditorType; label: string; icon: React.ReactElement; value: string; setter: (code: string) => void }[] = [
        { id: 'html', label: 'HTML', icon: <HtmlIcon />, value: htmlCode, setter: setHtmlCode },
        { id: 'css', label: 'CSS', icon: <CssIcon />, value: cssCode, setter: setCssCode },
        { id: 'js', label: 'JavaScript', icon: <JsIcon />, value: jsCode, setter: setJsCode },
    ];

    const activeEditorData = editors.find(e => e.id === activeEditor)!;

    return (
        <div className="flex flex-col h-full bg-gray-900">
            <div className="flex items-center justify-between bg-gray-800 border-b border-gray-700">
                <div className="flex">
                    {editors.map(editor => (
                        <button
                            key={editor.id}
                            onClick={() => setActiveEditor(editor.id)}
                            className={`flex items-center space-x-2 px-4 py-2 text-sm ${activeEditor === editor.id ? 'bg-gray-900 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
                        >
                            {editor.icon}
                            <span>{editor.label}</span>
                        </button>
                    ))}
                </div>
                 {activeEditor === 'html' && (
                    <button 
                        onClick={() => setIsWysiwyg(!isWysiwyg)} 
                        className={`flex items-center space-x-2 mr-2 px-3 py-1 rounded text-xs ${isWysiwyg ? 'bg-blue-600' : 'bg-gray-700'}`}
                        title={isWysiwyg ? "Switch to Code View" : "Switch to WYSIWYG View"}
                    >
                       <EyeIcon />
                    </button>
                )}
            </div>
            <div className="flex-grow overflow-auto">
                {activeEditor === 'html' && isWysiwyg ? (
                    <WYSIWYGEditor value={activeEditorData.value} onChange={activeEditorData.setter} />
                ) : (
                    <Editor value={activeEditorData.value} onChange={activeEditorData.setter} />
                )}
            </div>
        </div>
    );
};

export default EditorPanel;