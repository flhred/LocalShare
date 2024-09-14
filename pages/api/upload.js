import { IncomingForm } from 'formidable'
import fs from 'fs'
import path from 'path'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const form = new IncomingForm()
    form.uploadDir = path.join(process.env.HOME, 'Downloads')
    form.keepExtensions = true

    form.parse(req, (err, fields, files) => {
      if (err) return res.status(500).json({ error: 'Upload failed' })
      res.status(200).json({ message: 'File uploaded successfully' })
    })
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}