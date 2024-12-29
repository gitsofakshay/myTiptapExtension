import './App.css'
import TiptapEditor from './component/TiptapEditor'

function App() {

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-blue-600 mb-6 text-center">My Tiptap Editor</h1>      
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-6">
        <TiptapEditor />
      </div>
    </div>
  )
}

export default App
