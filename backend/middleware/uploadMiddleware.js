
import multer from 'multer'
import path from 'path'
import crypto from 'crypto'
import fs from 'fs'
import { fileURLToPath } from 'url'

const currentFile = fileURLToPath(import.meta.url)
const currentDirectory = path.dirname(currentFile)

const uploadDirectory = path.resolve(
  currentDirectory,
  '../uploads'
)

// Ensure uploads folder exists
fs.mkdirSync(uploadDirectory, { recursive: true })

// Allowed image types
const allowedTypes = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
}

// Configure file storage
const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, uploadDirectory)
  },

  filename: (_req, file, callback) => {
    const extension = allowedTypes[file.mimetype]
    const uniqueName = `product-${crypto.randomUUID()}${extension}`

    callback(null, uniqueName)
  },
})

// Validate image files
const fileFilter = (_req, file, callback) => {
  if (!allowedTypes[file.mimetype]) {
    return callback(
      new Error('Only JPEG, PNG and WEBP images are allowed.')
    )
  }

  callback(null, true)
}

// Configure Multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 5,
  },
})

// Upload maximum 5 product images
export const uploadProductImages = upload.array('images', 5)
