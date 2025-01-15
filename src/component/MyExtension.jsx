import { Extension } from '@tiptap/core';
import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph } from 'docx';
import { getDocument } from 'pdfjs-dist';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

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
        laugh: '😂',
        wink: '😉',
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
        prayer: '🙏',
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


// Extension to import content
export const ImportExtension = Extension.create({
  name: 'import',

  addCommands() {
    return {
      importFile:
        (fileType) =>
          ({ editor }) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = {
              txt: '.txt',
              html: '.html',
              pdf: '.pdf',
              docx: '.docx',
            }[fileType];

            input.onchange = async (event) => {
              const file = event.target.files[0];
              if (file) {
                let content = '';
                try {
                  if (fileType === 'pdf') {
                    // Set the workerSrc to the path of the worker script
                    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

                    // Use pdfjs-dist to extract text from the PDF
                    const arrayBuffer = await file.arrayBuffer();
                    const pdf = await getDocument(arrayBuffer).promise;

                    for (let i = 1; i <= pdf.numPages; i++) {
                      const page = await pdf.getPage(i);
                      const textContent = await page.getTextContent();
                      content += textContent.items.map((item) => item.str).join(' ') + '\n';
                    }
                  } else if (fileType === 'docx') {
                    // Extract text from .docx file using mammoth
                    const arrayBuffer = await file.arrayBuffer();
                    const result = await mammoth.extractRawText({ arrayBuffer });
                    content = result.value; // Extracted plain text content
                  } else if (fileType === 'html') {
                    // Handle HTML import
                    content = await file.text();
                    // Parse HTML to text
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(content, 'text/html');
                    content = doc.body.textContent || '';
                  } else if (fileType === 'txt') {
                    // Handle TXT import
                    content = await file.text();
                  }

                  // Transform raw content into a format compatible with Tiptap's schema
                  const formattedContent = {
                    type: 'doc',
                    content: [
                      {
                        type: 'paragraph',
                        content: [
                          {
                            type: 'text',
                            text: content,
                          },
                        ],
                      },
                    ],
                  };

                  // Insert content into the editor
                  editor.commands.setContent(formattedContent);
                } catch (error) {
                  console.error(`Error importing ${fileType} file:`, error);
                  alert(`Failed to import ${fileType} file. Please try again.`);
                }
              }
            };

            input.click();
          },
    };
  },
});


// function to download exported file
function downloadFile(blob, filename) {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

// Extension to export content
export const ExportExtension = Extension.create({
  name: 'export',

  addCommands() {
    return {
      exportFile: (type) => () => {
        try {
          const content = this.editor.getHTML(); // Get editor content as HTML
          const textContent = this.editor.getText(); // Get editor content as plain text

          if (type === 'txt') {
            const blob = new Blob([textContent], { type: 'text/plain' });
            downloadFile(blob, 'content.txt');
          } else if (type === 'html') {
            const blob = new Blob([content], { type: 'text/html' });
            downloadFile(blob, 'content.html');
          } else if (type === 'pdf') {
            const pdf = new jsPDF();
            const pageWidth = pdf.internal.pageSize.getWidth() - 20; // Page width minus margins
            const pageHeight = pdf.internal.pageSize.getHeight() - 20; // Page height minus margins
            const margin = 10; // Margin for the content
            const lineHeight = 4; // Line height for text
            const fontSize = 12; // Font size for content
            let cursorY = margin; // Starting position for text

            pdf.setFontSize(fontSize);

            // Split text into lines that fit within the page width
            const lines = pdf.splitTextToSize(textContent, pageWidth);

            // Loop through lines and add to PDF, handling page breaks
            lines.forEach((line) => {
              if (cursorY + lineHeight > pageHeight) {
                pdf.addPage(); // Add a new page when content exceeds page height
                cursorY = margin; // Reset cursor to top margin
              }
              pdf.text(line, margin, cursorY);
              cursorY += lineHeight; // Move cursor down for next line
            });

            pdf.save('content.pdf');
          } else if (type === 'docx') {
            const doc = new Document({
              sections: [
                {
                  children: [new Paragraph(textContent)],
                },
              ],
            });
            Packer.toBlob(doc).then((blob) => {
              downloadFile(blob, 'content.docx');
            });
          } else if (type === 'email') {
            const emailContent = encodeURIComponent(textContent);
            const mailtoLink = `mailto:?subject=Exported Content&body=${emailContent}`;
            window.location.href = mailtoLink;
          }
        } catch (error) {
          console.error('Error exporting file:', error);
        }
      },
    };
  },
});

export default { EmojiExtension, ClearCopyExtension, ImportExtension, ExportExtension };