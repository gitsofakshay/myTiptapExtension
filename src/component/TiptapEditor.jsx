import React,{ useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { EmojiExtension, ClearCopyExtension } from './MyExtension'

export default function TiptapEditor() {
  const [copyStatus, setCopyStatus] = useState(false); // State for copy button status

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
  ]

  const content = `<p>Type ":smile:" or press Mod-Shift-E for 😄</p>`
  const editor = useEditor({ extensions, content })

  if (!editor) {
    return null
  }

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
      <div className="flex space-x-2 mb-4">
      {/* Clear Button */}
      <button
        onClick={() => editor.commands.clearContent()}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Clear
      </button>
      {/* Copy Button */}
      <button
        onClick={() => editor.commands.copyContent()}
        className={`px-4 py-2 rounded ${
          copyStatus
            ? 'bg-green-500 text-white hover:bg-green-600'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
      >
        {copyStatus ? 'Copied!' : 'Copy'}
      </button>
    </div>
      <div className="prose prose-lg max-w-none p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

