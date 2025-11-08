
import React, { useState } from 'react';
import { Project } from '../../types';
import { TrashIcon, XIcon } from '../icons/Icons';

interface ProjectsModalProps {
    projects: Project[];
    activeProject: Project | null;
    onLoad: (project: Project) => void;
    onSave: (name: string) => void;
    onDelete: (id: string) => void;
    onNew: () => void;
    onClose: () => void;
}

const ProjectsModal: React.FC<ProjectsModalProps> = ({ projects, activeProject, onLoad, onSave, onDelete, onNew, onClose }) => {
    const [projectName, setProjectName] = useState(activeProject?.name || '');

    const handleSave = () => {
        onSave(projectName);
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-lg p-6 text-white">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Projects</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><XIcon /></button>
                </div>
                
                <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Save Project</h3>
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            placeholder={activeProject ? "Rename project..." : "New project name..."}
                            className="flex-grow bg-gray-700 border border-gray-600 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md">
                            {activeProject ? 'Update' : 'Save'}
                        </button>
                    </div>
                </div>

                <div className="border-t border-gray-700 pt-4">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-semibold">Load Project</h3>
                         <button onClick={onNew} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md text-sm">
                            New Project
                        </button>
                    </div>
                    <div className="max-h-60 overflow-y-auto bg-gray-900 p-2 rounded-md">
                        {projects.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">No saved projects.</p>
                        ) : (
                            projects.map(p => (
                                <div key={p.id} className="flex justify-between items-center p-2 rounded-md hover:bg-gray-700">
                                    <button onClick={() => onLoad(p)} className={`text-left flex-grow ${p.id === activeProject?.id ? 'text-blue-400 font-bold' : ''}`}>
                                        {p.name}
                                    </button>
                                    <button onClick={() => onDelete(p.id)} className="text-gray-400 hover:text-red-500 ml-4"><TrashIcon /></button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectsModal;
