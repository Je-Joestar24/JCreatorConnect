import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
const profilesDir = path.join(uploadsDir, 'profiles');
const bannersDir = path.join(uploadsDir, 'banners');
const postsDir = path.join(uploadsDir, 'posts');

[uploadsDir, profilesDir, bannersDir, postsDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Disk storage for local file fallback
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determine destination based on route or file field
    if (file.fieldname === 'image') {
      // Check route to determine destination
      if (req.path?.includes('profile-picture')) {
        cb(null, profilesDir);
      } else if (req.path?.includes('banner')) {
        cb(null, bannersDir);
      } else if (req.path?.includes('/posts/') && req.path?.includes('/image')) {
        cb(null, postsDir);
      } else {
        cb(null, uploadsDir);
      }
    } else {
      cb(null, uploadsDir);
    }
  },
  filename: (req, file, cb) => {
    // Generate unique filename: userId_timestamp.extension
    const userId = req.user?._id || 'unknown';
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const filename = `${userId}_${timestamp}${ext}`;
    cb(null, filename);
  },
});

// Configure multer for file uploads
// Use memory storage for Cloudinary, but we'll also save to disk as fallback
const memoryStorage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
  }
};

// Configure multer with both memory and disk storage
// Memory storage for Cloudinary, disk storage for fallback
const uploadMemory = multer({
  storage: memoryStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter,
});

const uploadDisk = multer({
  storage: diskStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter,
});

// Middleware for single image upload (memory for Cloudinary)
const uploadSingle = uploadMemory.single('image');

// Middleware for single image upload (disk for local storage)
const uploadSingleDisk = uploadDisk.single('image');

// Middleware for multiple image uploads
const uploadMultiple = uploadMemory.array('images', 5);

export {
  uploadSingle,
  uploadSingleDisk,
  uploadMultiple,
  uploadMemory as upload,
  uploadsDir,
  profilesDir,
  bannersDir,
  postsDir,
};

