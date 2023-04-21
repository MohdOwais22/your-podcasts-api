import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from 'cloudinary';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: 'podcast',
    allowed_formats: ['mp3', 'mp4', 'avi', 'mov'],
    resource_type: 'auto',
  },
});

// Set up multer middleware for file uploads
export const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    // Set the public_id and resource_type
    const originalname = file.originalname.split('.')[0];
    const resource_type = file.mimetype.startsWith('audio') ? 'audio' : 'video';
    req.body.public_id = `podcast/${originalname}`;
    req.body.resource_type = resource_type;
    cb(null, true);
  },
});
