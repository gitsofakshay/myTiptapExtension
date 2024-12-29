# Tiptap Custom Extensions

This project demonstrates custom extensions created for the [Tiptap Editor](https://tiptap.dev/), a modern, extensible, and framework-agnostic rich text editor. These extensions enhance the editor's functionality by introducing new features like emoji insertion, text clearing, content copying, and more!

## 🚀 Features

### 1. Emoji Extension
- **Use Case**: Easily insert emojis into your content using commands or a toolbar button.
- **Key Features**:
  - Type `:smile:` to insert 😊 or use the toolbar.
  - Available emojis:
    - 😄 (smile)
    - ❤️ (heart)
    - 👍 (thumbs up)
    - 👏 (clap)
    - 🎉 (party)
    - ✨ (sparkles)
    - 💡 (idea)
    - 🔥 (fire)
  - Highly customizable with more emojis as needed.

### 2. Text Clear Extension
- **Use Case**: Quickly clear all content from the editor.
- **Key Features**:
  - One-click functionality to clear the editor.
  - Useful for resetting content during live editing sessions.

### 3. Copy Content Extension
- **Use Case**: Copy all editor content to the clipboard.
- **Key Features**:
  - Copies the editor's current content with a single click.
  - Displays a "Copied!" confirmation message with a green button state.

### 4. 🛠️ Installation

  1. Clone this repository:
     ```bash
      git clone https://github.com/your-username/tiptap-custom-extensions.git
     cd tiptap-custom-extensions
  2. Install dependencies:
     ```bash
     npm create vite@latest tiptap-extension -- --template react
     npm install @tiptap/core @tiptap/react @tiptap/starter-kit
  3. Start the development server:
     ```bash
     npm run dev

### 5.Usage Instructions
- **Emoji Insertion**:
  - Type the emoji shortcode (e.g., :smile:) in the editor.
  - Use the toolbar button to select and insert emojis.
- **Clear Content**:
  - Click the Clear button to remove all text from the editor.
- **Copy Content**:
  - Click the Copy button to copy all editor content to the clipboard.
  - The button text changes to "Copied!" and turns green to confirm success.
### 6.📚 Technology Stack
  Frontend: React.js
  Editor: Tiptap
  Styling: Tailwind CSS

### 7.🤝 Contributing
Feel free to contribute by adding new features, improving existing functionality, or reporting issues. Open a pull request or create an issue to get started!

### 8.📜 License
This project is licensed under the MIT License. See the LICENSE file for details.

🌟 Star this repository if you find it helpful! Your feedback is appreciated.
