import fs from 'fs'
import path from 'path'
require('dotenv').config();

export default function handler(req, res) {
  const { query: { dir = '' } } = req
  const baseDir = process.env.BASE_DIR
  const currentDir = path.join(baseDir, dir)

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