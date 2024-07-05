import { diskStorage } from "multer";

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