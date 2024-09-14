import fs from 'fs'
import path from 'path'
require('dotenv').config();

export default function handler(req, res) {
  const { filePath } = req.query;
  const baseDir = process.env.BASE_DIR
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