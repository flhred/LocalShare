import { useState, useEffect } from 'react'
import { Folder, File, ArrowLeft } from 'lucide-react'

export default function Home() {
  const [files, setFiles] = useState([])
  const [currentPath, setCurrentPath] = useState('')

  useEffect(() => {
    fetchFiles(currentPath)
  }, [currentPath])

  const fetchFiles = async (path) => {
    const res = await fetch(`/api/files?dir=${encodeURIComponent(path)}`)
    const data = await res.json()
    setFiles(data)
  }

  const handleUpload = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })
    fetchFiles(currentPath)
  }

  const navigateToDirectory = (path) => {
    setCurrentPath(path)
  }

  const navigateUp = () => {
    const parentPath = currentPath.split('/').slice(0, -1).join('/')
    setCurrentPath(parentPath)
  }

  return (
    <div className="container mx-auto max-w-sm p-4">
      <h1 className="text-4xl font-extrabold dark:text-white">Local File Server</h1>
      <form onSubmit={handleUpload} className="max-w-sm mx-auto">
        <div class="mb-4">
          <input class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="file_input_help" name="file" type="file" />
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">SVG, PNG, JPG or GIF.</p>

          <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Upload</button>
        </div>
      </form>
      <div className="mb-4">
        <button onClick={navigateUp} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
          <ArrowLeft className="mr-2" size={16} />
          Previous Directory
        </button>
      </div>
      <h2 className="text-xl font-semibold mb-2 dark:text-white">Directory: {currentPath || 'Root'}</h2>
      <ul class="text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
        {files.map(file => (
          <li key={file.path} class="inline-flex items-center w-full px-4 py-2 border-b border-gray-200 dark:border-gray-600">
            {file.isDirectory ? (
              <Folder className="mr-2" size={20} />
            ) : (
              <File className="mr-2" size={20} />
            )}
            {file.isDirectory ? (
              <button
                onClick={() => navigateToDirectory(file.path)}
                className="text-blue-500 hover:underline"
              >
                {file.name}
              </button>
            ) : (
              <a
                href={`/api/download?filePath=${encodeURIComponent(file.path)}`}
                className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                download
              >
                {file.name}
              </a>
            )}
          </li>
        ))}
      </ul>

    </div>
  )
}
