import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { EmojiExtension, ClearCopyExtension, ImportExtension, ExportExtension, ImportRandomTextExtension } from './MyExtension';
import ImportExportButton from './ImportExportButton';

export default function TiptapEditor() {
  const [copyStatus, setCopyStatus] = useState(false); // State for copy button status
  const [isLoading, setIsLoading] = useState(false)

  const emojis = [
    { name: 'smile', icon: '😄' },
    { name: 'heart', icon: '❤️' },
    { name: 'thumbs_up', icon: '👍' },
    { name: 'clap', icon: '👏' },
    { name: 'party', icon: '🎉' },
    { name: 'laugh', icon: '😂' },
    { name: 'wink', icon: '😉' },
    { name: 'thinking', icon: '🤔' },
    { name: 'sunglasses', icon: '😎' },
    { name: 'fire', icon: '🔥' },
    { name: 'star', icon: '⭐' },
    { name: 'rocket', icon: '🚀' },
    { name: 'ok_hand', icon: '👌' },
    { name: 'thumbs_down', icon: '👎' },
    { name: 'cry', icon: '😢' },
    { name: 'angry', icon: '😡' },
    { name: 'love', icon: '😍' },
    { name: 'surprise', icon: '😲' },
    { name: 'confused', icon: '😕' },
    { name: 'sleepy', icon: '😴' },
    { name: 'check', icon: '✔️' },
    { name: 'cross', icon: '❌' },
    { name: 'lightbulb', icon: '💡' },
    { name: 'question', icon: '❓' },
    { name: 'exclamation', icon: '❗' },
    { name: 'wave', icon: '👋' },
    { name: 'prayer', icon: '🙏' },
  ];

  const extensions = [
    StarterKit,
    EmojiExtension, // Custom extension to add emojis
    // Custom extension to clear and copy content
    ClearCopyExtension.configure({
      onCopy: () => {
        setCopyStatus(true); // Set status to "Copied!"
        setTimeout(() => setCopyStatus(false), 2000); // Reset after 2 seconds
      },
    }),
    ImportExtension, // Custom extension to import files
    ExportExtension, // Custom extension to export files
    ImportRandomTextExtension, // Custom extension to insert random text
  ];

  const content = `<p>Type ":smile:" or press Mod-Shift-E for 😄</p>`;
  const editor = useEditor({ extensions, content });

  if (!editor) {
    return null;
  }

  // Handling import
  const handleImport = (type) => {
    if (type === 'txt') {
      editor.commands.importFile('txt'); // Import .txt files
    } else if (type === 'html') {
      editor.commands.importFile('html'); // Import .html files
    } else if (type === 'pdf') {
      editor.commands.importFile('pdf'); // Import .pdf files
    } else if (type === 'docx') {
      editor.commands.importFile('docx'); // Import .docx files
    }
  };

  // Handling export
  const handleExport = (type) => {
    if (type === 'txt') {
      editor.commands.exportFile('txt'); // Export .txt files
    } else if (type === 'html') {
      editor.commands.exportFile('html'); // Export .html files
    } else if (type === 'pdf') {
      editor.commands.exportFile('pdf'); // Export .pdf files
    } else if (type === 'docx') {
      editor.commands.exportFile('docx'); // Export .docx files
    } else if (type === 'email') {
      editor.commands.exportFile('email'); // Export as email
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap justify-center space-x-2 p-4 bg-gray-200 rounded-lg shadow-inner mb-4">
        {emojis.map((emoji) => (
          <button
            key={emoji.name}
            onClick={() => editor.commands.insertEmoji(emoji.name)}
            className="text-2xl p-2 hover:bg-gray-300 rounded-full"
          >
            {emoji.icon}
          </button>
        ))}
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0 md:space-x-4 mb-4">
        {/* Import and Export Buttons */}
        <div className="flex space-x-2">
          <ImportExportButton onImport={handleImport} onExport={handleExport} />
        </div>
        <div className="flex space-x-2">
          {/* Insert Random Text Button */}
          <button
            onClick={() => {
              editor.commands.getRandomText(setIsLoading)
            }}
            className={`px-6 py-2 text-white rounded-lg focus:ring-2 focus:ring-black-300 ${isLoading
              ? 'bg-gray-500 cursor-not-allowed' // Disabled button style
              : 'bg-green-500 hover:bg-green-600'
              }`}
            disabled={isLoading} // Disable the button while loading
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 100 8v4a8 8 0 01-8-8z"
                  ></path>
                </svg>
                <span>Loading...</span>
              </div>
            ) : (
              'Get Random Text'
            )}
          </button>

          {/* Clear Button */}
          <button
            onClick={() => editor.commands.clearContent()}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:ring-2 focus:ring-red-300"
          >
            Clear
          </button>

          {/* Copy Button */}
          <button
            onClick={() => editor.commands.copyContent()}
            className={`px-6 py-2 rounded-lg focus:ring-2 ${copyStatus
              ? 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-300'
              : 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-300'
              }`}
          >
            {copyStatus ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      <div id="your-content-id" className="prose prose-lg max-w-none p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}