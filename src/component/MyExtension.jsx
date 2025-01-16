import { Extension } from '@tiptap/core';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import html2pdf from 'html2pdf.js';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import mammoth from 'mammoth';

// Set the workerSrc for pdfjs-dist to use the local worker file
GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

// Extension to add emojis to the editor
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

// Extension to clear and copy content
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
              this.options.onCopy();
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
                  if (fileType === 'txt') {
                    content = await file.text();
                  } else if (fileType === 'html') {
                    content = await file.text();
                  } else if (fileType === 'pdf') {
                    const arrayBuffer = await file.arrayBuffer();
                    const pdf = await getDocument({ data: arrayBuffer }).promise;
                    const numPages = pdf.numPages;

                    // Prepare Tiptap-compatible content
                    let editorContent = {
                      type: "doc",
                      content: []
                    };

                    for (let i = 1; i <= numPages; i++) {
                      const page = await pdf.getPage(i);
                      const text = await page.getTextContent();

                      // Sort text items by vertical position (y-coordinate)
                      const sortedItems = text.items.sort((a, b) => {
                        if (a.transform[5] !== b.transform[5]) {
                          return b.transform[5] - a.transform[5];
                        }
                        return a.transform[4] - b.transform[4];
                      });

                      // Group items by lines based on y-coordinates
                      let lines = [];
                      let currentLine = [];
                      let currentY = sortedItems[0]?.transform[5] || 0;

                      for (const item of sortedItems) {
                        const y = item.transform[5];
                        if (Math.abs(currentY - y) > 2) {
                          lines.push(currentLine);
                          currentLine = [];
                          currentY = y;
                        }
                        currentLine.push(item);
                      }
                      lines.push(currentLine);

                      // Construct Tiptap-compatible paragraphs
                      for (const line of lines) {
                        const lineText = line
                          .sort((a, b) => a.transform[4] - b.transform[4])
                          .map((item) => item.str)
                          .join('');

                        if (lineText.trim()) {
                          editorContent.content.push({
                            type: "paragraph",
                            content: [
                              {
                                type: "text",
                                text: lineText
                              }
                            ]
                          });
                        }
                      }

                      if (i < numPages) {
                        editorContent.content.push({
                          type: "horizontalRule"
                        });
                      }
                    }

                    content = editorContent
                  } else if (fileType === 'docx') {
                    const arrayBuffer = await file.arrayBuffer();
                    const result = await mammoth.convertToHtml({ arrayBuffer });
                    content = result.value;
                  }
                  editor.commands.setContent(content);
                } catch (error) {
                  console.error('Error importing file:', error);
                }
              }
            };

            input.click();
          },
    };
  },
});

// Function to download exported file
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
      exportFile: (type) => ({ editor }) => {
        try {
          const content = editor.getHTML();
          const textContent = editor.getText();

          if (type === 'txt') {
            const blob = new Blob([textContent], { type: 'text/plain' });
            downloadFile(blob, 'content.txt');
          } else if (type === 'html') {
            const blob = new Blob([content], { type: 'text/html' });
            downloadFile(blob, 'content.html');
          } else if (type === 'pdf') {
            const options = {
              margin: 25,
              filename: 'content.pdf',
              image: { type: 'jpeg', quality: 0.98 },
              html2canvas: {
                scale: 2,
                useCORS: true,
              },
              jsPDF: {
                unit: 'pt',
                format: 'a4',
                orientation: 'portrait',
              },
            };

            // Generate the PDF from the HTML content
            html2pdf().set(options).from(content).save();
          } else if (type === 'docx') {
            try {
              // Parse the HTML content
              const parser = new DOMParser();
              const htmlDoc = parser.parseFromString(content, 'text/html');

              const paragraphs = Array.from(htmlDoc.body.childNodes).map((node) => {
                // Handle text styling (bold, italic)
                const textRun = new TextRun({
                  text: node.textContent || '',
                  bold: node.nodeName === 'B' || node.style?.fontWeight === 'bold',
                  italics: node.nodeName === 'I' || node.style?.fontStyle === 'italic',
                });

                return new Paragraph({
                  children: [textRun],
                });
              });

              // Create a new Document and add sections
              const doc = new Document({
                sections: [
                  {
                    children: paragraphs,
                  },
                ],
              });

              // Export the document as a Blob and download
              Packer.toBlob(doc).then((blob) => {
                downloadFile(blob, 'content.docx');
              });
            } catch (error) {
              console.error('Error exporting file:', error);
            }
          } else if (type === 'email') {
            const subject = "Exported Content";                        
            const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(textContent)}`;

            // Prompt to open in the user's email client
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