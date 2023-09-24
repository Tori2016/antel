import { v4 as uuid } from 'uuid';
import { extname } from 'path';

export const filePdfNamer = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: Function,
) => {
  if (!file) return callback(new Error('File is Empty'), false);

  const fileExtension = extname(file.originalname);
  const randomNum = uuid().substring(0, 8);
  const buffer = Buffer.from(
    file.originalname.replace(fileExtension, ''),
    'binary',
  );
  const decodedString = buffer.toString('utf8');

  const originalName = decodedString
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/ /g, '-');

  const fileName = `${originalName}_${randomNum}${fileExtension}`;

  callback(null, fileName);
};
