import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: '3foxmarket/uploads',
    allowed_formats: ['jpg', 'png', 'jpeg', 'mp4', 'mov'],
  },
});

export const upload = multer({ storage });
