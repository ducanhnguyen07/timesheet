import { v2 as cloudinary } from 'cloudinary';
import { diskStorage } from 'multer';

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  useFactory: () => {
    return cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  },
};

export const multerConfig = {
  storage: diskStorage({
    destination: './public',
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const fileExtName = file.originalname.split('.').pop();
      const fileName = `${file.fieldname}-${uniqueSuffix}.${fileExtName}`;
      cb(null, fileName);
    },
  }),
};