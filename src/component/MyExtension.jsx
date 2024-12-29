import { Extension } from '@tiptap/core';

//Extension to add emojis to the editor
export const EmojiExtension = Extension.create({
  name: 'emoji',

  addOptions() {
    return {
      emojis: {
        smile: '😄',
        heart: '❤️',
        thumbs_up: '👍',
        clap: '👏',
        party: '🎉',      
        laugh:'😂',
        wink: '😉' ,
        thinking: '🤔',
        sunglasses: '😎',
        fire: '🔥', 
        star: '⭐',
        rocket: '🚀',
        ok_hand: '👌',
        thumbs_down: '👎',
        cry: '😢', 
        angry: '😡',
        love: '😍',
        surprise: '😲',
        confused: '😕',
        sleepy: '😴',
        check: '✔️',
        cross: '❌',
        lightbulb: '💡',
        question: '❓',
        exclamation: '❗', 
        wave: '👋',
        prayer: '🙏' ,
      },
    };
  },

  addCommands() {
    return {
      insertEmoji: (emojiName) => ({ chain }) => {
        const emoji = this.options.emojis[emojiName];
        if (!emoji) {
          console.error(`Emoji "${emojiName}" not found`);
          return false;
        }
        return chain().insertContent(emoji).run();
      },
    };
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Shift-E': () => this.editor.commands.insertEmoji('smile'),
    };
  },
});

//Extension to clear and copy content
export const ClearCopyExtension = Extension.create({
  name: 'clearCopy',

  addCommands() {
    return {
      // Command to clear the editor's content
      clearContent: () => ({ commands }) => {
        return commands.setContent('');
      },

      // Command to copy the editor's content to the clipboard
      copyContent: () => ({ editor }) => {
        const text = editor.getText(); // Get plain text from the editor
        if (navigator.clipboard) {
          navigator.clipboard.writeText(text).then(() => {
            if (this.options.onCopy) {
              this.options.onCopy(); // Call the callback on successful copy
            }
          });
        } else {
          console.error('Clipboard API is not available.');
        }
        return true;
      },
    };
  },
});


export default { EmojiExtension, ClearCopyExtension};