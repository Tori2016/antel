import { Injectable } from '@nestjs/common';
import { join } from 'path';
import * as fs from 'fs';
import { Response } from 'express';

import { HandleError } from '../utils';

@Injectable()
export class FilesService {
  findAvatar(imageName: string) {
    try {
      const path = join(__dirname, '../../uploads/avatars', imageName);
      if (!fs.existsSync(path)) {
        throw new HandleError({
          type: 'NOT_FOUND',
          message: 'IMAGE_NOT_FOUND',
        });
      }
      return path;
    } catch (error) {
      throw HandleError.createSignatureError(error.message);
    }
  }

  deleteAvatar(imageName: string, res: Response) {
    try {
      const path = join(__dirname, '../../uploads/avatars', imageName);
      if (!fs.existsSync(path)) {
        throw new HandleError({
          type: 'NOT_FOUND',
          message: 'IMAGE_NOT_FOUND',
        });
      }
      fs.unlink(path, (err) => {
        if (err) {
          throw new HandleError({
            type: 'BAD_REQUEST',
            message: 'IMAGE_DELETED_ERROR',
          });
        }
      });
      res.json({ message: 'FILE_DELETED' });
    } catch (error) {
      throw HandleError.createSignatureError(error.message);
    }
  }
}
