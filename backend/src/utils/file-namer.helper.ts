import { v4 as uuid } from 'uuid';
import { extname } from 'path';

export const fileNamer = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: Function,
) => {
  if (!file) return callback(new Error('File is Empty'), false);

  const fileExtension = extname(file.originalname);
  const randomNum = uuid().substring(0, 18);
  const fileName = `${randomNum}${fileExtension}`;

  callback(null, fileName);
};
