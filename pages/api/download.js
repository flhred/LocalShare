import fs from 'fs'
import path from 'path'

export default function handler(req, res) {
  const { filePath } = req.query;
  const baseDir = path.join(process.env.HOME, 'Downloads')
  const fullPath = path.join(baseDir, filePath);

  // Check if the file exists
  if (fs.existsSync(fullPath)) {
    res.setHeader('Content-Disposition', `attachment; filename=${path.basename(filePath)}`);
    const fileStream = fs.createReadStream(fullPath);
    fileStream.pipe(res);
  } else {
    res.status(404).json({ message: 'File not found' });
  }
}