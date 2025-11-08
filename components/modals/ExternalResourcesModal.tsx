
import React, { useState } from 'react';
import { TrashIcon, XIcon, PlusIcon } from '../icons/Icons';

interface ExternalResourcesModalProps {
    resources: string[];
    onSave: (resources: string[]) => void;
    onClose: () => void;
}

const ExternalResourcesModal: React.FC<ExternalResourcesModalProps> = ({ resources, onSave, onClose }) => {
    const [currentResources, setCurrentResources] = useState([...resources]);
    const [newResource, setNewResource] = useState('');

    const handleAdd = () => {
        if (newResource.trim() && !currentResources.includes(newResource.trim())) {
            setCurrentResources([...currentResources, newResource.trim()]);
            setNewResource('');
        }
    };

    const handleRemove = (res: string) => {
        setCurrentResources(currentResources.filter(r => r !== res));
    };

    const handleSave = () => {
        onSave(currentResources);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-lg p-6 text-white">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">External Resources</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><XIcon /></button>
                </div>

                <div className="mb-4">
                    <p className="text-sm text-gray-400 mb-2">Add URLs for external CSS stylesheets or JavaScript files.</p>
                    <div className="flex space-x-2">
                        <input
                            type="url"
                            value={newResource}
                            onChange={(e) => setNewResource(e.target.value)}
                            placeholder="https://example.com/styles.css"
                            className="flex-grow bg-gray-700 border border-gray-600 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 p-2 rounded-md" title="Add Resource">
                            <PlusIcon />
                        </button>
                    </div>
                </div>

                <div className="max-h-60 overflow-y-auto bg-gray-900 p-2 rounded-md mb-4">
                    {currentResources.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">No external resources.</p>
                    ) : (
                        currentResources.map((res, i) => (
                            <div key={i} className="flex justify-between items-center p-2 rounded-md hover:bg-gray-700 text-sm">
                                <span className="truncate text-gray-300">{res}</span>
                                <button onClick={() => handleRemove(res)} className="text-gray-400 hover:text-red-500 ml-4"><TrashIcon /></button>
                            </div>
                        ))
                    )}
                </div>
                
                <div className="mt-6 flex justify-end space-x-2">
                    <button onClick={onClose} className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded-md">
                        Cancel
                    </button>
                   <button onClick={handleSave} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md">
                        Save and Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExternalResourcesModal;
