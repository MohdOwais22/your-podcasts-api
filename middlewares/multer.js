import multer from 'multer';
// import { CloudinaryStorage } from 'multer-storage-cloudinary';
// import cloudinary from 'cloudinary';

// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary.v2,
//   params: {
//     folder: 'podcast',
//     allowed_formats: ['mp3', 'mp4', 'avi', 'mov'],
//     resource_type: 'auto',
//   },
// });

// // Set up multer middleware for file uploads
// export const singleUpload = multer({
//   storage: storage,
//   fileFilter: function (req, file, cb) {
//     // Set the public_id and resource_type
//     const originalname = file.originalname.split('.')[0];
//     const resource_type = file.mimetype.startsWith('audio') ? 'audio' : 'video';
//     req.body.public_id = `podcast/${originalname}`;
//     req.body.resource_type = resource_type;
//     cb(null, true);
//   },
//   limits: {
//     fileSize: 25000000,
//     fieldSize: 25 * 1024 * 1024
//   },
// }).single('file');

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    const fileExt = file.originalname.split('.').pop();
    const filename = `${new Date().getTime()}.${fileExt}`;
    cb(null, filename);
  },
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'audio/mp3' || file.mimetype === 'audio/mpeg' || file.mimetype === 'video/mp4') {
    cb(null, true);
  } else {
    cb(
      {
        message: 'Unsupported File Format',
      },
      false
    );
  }
};

export const singleUpload = multer({
  storage,
  limits: {
    fieldNameSize: 200,
    fieldSize: 200 * 1024 * 1024,
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter,
}).single('file');
