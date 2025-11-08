
import React from 'react';

const Icon: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather">
        {children}
    </svg>
);

export const PlayIcon = () => <Icon><polygon points="5 3 19 12 5 21 5 3"></polygon></Icon>;
export const DownloadIcon = () => <Icon><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></Icon>;
export const SaveIcon = () => <Icon><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></Icon>;
export const FolderOpenIcon = () => <Icon><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></Icon>;
export const CodeIcon = () => <Icon><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></Icon>;
export const EyeIcon = () => <Icon><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></Icon>;
export const TrashIcon = () => <Icon><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></Icon>;
export const XIcon = () => <Icon><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></Icon>;
export const HtmlIcon = () => <Icon><path d="M14 12l-4-4-4 4"></path><path d="M10 20v-8"></path><path d="M20 12l-4 4-4-4"></path><path d="M16 4v8"></path></Icon>;
export const CssIcon = () => <Icon><path d="M10 18l-5-5 5-5"></path><path d="M14 6l5 5-5 5"></path></Icon>;
export const JsIcon = () => <Icon><path d="M17 6.1H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-10a2 2 0 00-2-2z"></path><path d="M10 16.1h1.9a1.9 1.9 0 001.9-1.9v-.2a1.9 1.9 0 00-1.9-1.9H10v4z"></path></Icon>;
export const ChevronDownIcon = () => <Icon><polyline points="6 9 12 15 18 9"></polyline></Icon>;
export const ChevronUpIcon = () => <Icon><polyline points="18 15 12 9 6 15"></polyline></Icon>;
export const TerminalIcon = () => <Icon><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></Icon>;
export const HelpCircleIcon = () => <Icon><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></Icon>;
export const LinkIcon = () => <Icon><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></Icon>;
export const PlusIcon = () => <Icon><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></Icon>;
