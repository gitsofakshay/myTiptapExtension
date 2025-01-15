import React, { useState, useEffect, useRef } from 'react';

export default function ImportExportButtons({ onImport, onExport }) {
    const [showImportMenu, setShowImportMenu] = useState(false);
    const [showExportMenu, setShowExportMenu] = useState(false);
    const importMenuRef = useRef(null);
    const exportMenuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (importMenuRef.current && !importMenuRef.current.contains(event.target)) {
                setShowImportMenu(false);
            }
            if (exportMenuRef.current && !exportMenuRef.current.contains(event.target)) {
                setShowExportMenu(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [importMenuRef, exportMenuRef]);

    const handleImport = (type) => {
        onImport(type);
        setShowImportMenu(false); // Close the import menu
    };

    const handleExport = (type) => {
        onExport(type);
        setShowExportMenu(false); // Close the export menu
    };

    return (
        <div className="flex justify-center space-x-4 my-4 relative z-50">
            {/* Import Button */}
            <div className="relative" ref={importMenuRef}>
                <button
                    onClick={() => {
                        setShowImportMenu(!showImportMenu);
                        setShowExportMenu(false);
                    }}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
                >
                    Import
                </button>
                {showImportMenu && (
                    <div className="absolute left-0 mt-2 w-48 bg-gradient-to-r from-blue-500 to-purple-500 border rounded-lg shadow-lg z-50">
                        <button
                            onClick={() => handleImport('txt')}
                            className="block w-full px-4 py-2 text-left text-black font-bold hover:bg-blue-600"
                        >
                            Import txt
                        </button>
                        <button
                            onClick={() => handleImport('html')}
                            className="block w-full px-4 py-2 text-left text-black font-bold hover:bg-blue-600"
                        >
                            Import html
                        </button>
                        <button
                            onClick={() => handleImport('pdf')}
                            className="block w-full px-4 py-2 text-left text-black font-bold hover:bg-blue-600"
                        >
                            Import pdf
                        </button>
                        <button
                            onClick={() => handleImport('docx')}
                            className="block w-full px-4 py-2 text-left text-black font-bold hover:bg-blue-600"
                        >
                            Import word
                        </button>
                    </div>
                )}
            </div>

            {/* Export Button */}
            <div className="relative" ref={exportMenuRef}>
                <button
                    onClick={() => {
                        setShowExportMenu(!showExportMenu);
                        setShowImportMenu(false);
                    }}
                    className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:ring-2 focus:ring-green-300"
                >
                    Export
                </button>
                {showExportMenu && (
                    <div className="absolute left-0 mt-2 w-48 bg-gradient-to-r from-green-500 to-teal-500 border rounded-lg shadow-lg z-50">
                        <button
                            onClick={() => handleExport('txt')}
                            className="block w-full px-4 py-2 text-left text-black font-bold hover:bg-green-600"
                        >
                            Export to txt
                        </button>
                        <button
                            onClick={() => handleExport('html')}
                            className="block w-full px-4 py-2 text-left text-black font-bold hover:bg-green-600"
                        >
                            Export to html
                        </button>
                        <button
                            onClick={() => handleExport('pdf')}
                            className="block w-full px-4 py-2 text-left text-black font-bold hover:bg-green-600"
                        >
                            Export to pdf
                        </button>
                        <button
                            onClick={() => handleExport('docx')}
                            className="block w-full px-4 py-2 text-left text-black font-bold hover:bg-green-600"
                        >
                            Export to word
                        </button>
                        <button
                            onClick={() => handleExport('email')}
                            className="block w-full px-4 py-2 text-left text-black font-bold hover:bg-green-600"
                        >
                            Export to Email Draft
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
