import fs from 'fs'
import path from 'path'

export default function handler(req, res) {
  const { query: { dir = '' } } = req
  const baseDir = path.join(process.env.HOME, 'Downloads')
  const currentDir = path.join(baseDir, dir)
  console.log(process.env.HOME) 
  // Ensure the requested directory is within the base directory
  if (!currentDir.startsWith(baseDir)) {
    return res.status(403).json({ error: 'Access denied' })
  }

  try {
    const files = fs.readdirSync(currentDir, { withFileTypes: true })
    const fileList = files.map(file => ({
      name: file.name,
      isDirectory: file.isDirectory(),
      path: path.join(dir, file.name)
    }))
    res.status(200).json(fileList)
  } catch (error) {
    res.status(500).json({ error: 'Unable to read directory' })
  }
}