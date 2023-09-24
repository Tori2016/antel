import { extname } from 'path';

export const fileFilterImg = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: Function,
) => {
  if (!file) return callback(new Error('File is Empty'), false);

  const fileExtension = extname(file.originalname);
  const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

  if (validExtensions.includes(fileExtension)) {
    return callback(null, true);
  }

  callback(null, false);
};
