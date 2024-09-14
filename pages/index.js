import { useState, useEffect } from 'react'
import Head from 'next/head' // Import Head component
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
      <Head>
        <title>Local Share</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="flex items-center justify-between m-2">
        <a href="/" className="flex">
          <img src="/logo.svg" className="h-8 mr-3" alt="LocalShare Logo"/>
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Local Share</span>
        </a>
      </div>

      <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 m-2">
        <form onSubmit={handleUpload} className="max-w-sm mx-auto">
          <div className="mb-4">
            <input className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="file_input_help" name="file" type="file" />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">SVG, PNG, JPG or GIF.</p>

            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Upload</button>
          </div>
        </form>
      </div>
      
      <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 m-2">
        <div className='inline-flex items-center'>
          <button onClick={navigateUp} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center m-2">
              <ArrowLeft className="mr-2" size={16} />
              Previous
          </button>
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{currentPath || 'Root'}</h5>
        </div>
        <ul className="text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
          {files.map(file => (
            <li key={file.path} className="inline-flex items-center w-full px-4 py-2 border-b border-gray-200 dark:border-gray-600">
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
    </div>
  )
}
