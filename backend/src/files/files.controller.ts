import {
  Controller,
  Get,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  HttpCode,
  Res,
  Param,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { diskStorage } from 'multer';
import { Response } from 'express';

import { Auth } from '../auth/decorators';
import { fileFilterImg, fileNamer } from '../utils';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  // A V A T A R
  @Get('avatar/:avatarName')
  @HttpCode(HttpStatus.OK)
  findAvatar(@Res() res: Response, @Param('avatarName') imageName: string) {
    const path = this.filesService.findAvatar(imageName);
    res.sendFile(path);
  }

  @Post('avatar')
  @Auth()
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilterImg,
      storage: diskStorage({
        destination: './uploads/avatars',
        filename: fileNamer,
      }),
    }),
  )
  uploadAvatar(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('INVALID_FILE');
    }
    return { message: 'FILE_UPLOADED', avatarName: file.filename };
  }

  @Delete('avatar/:avatarName')
  @Auth()
  @HttpCode(HttpStatus.OK)
  deleteAvatar(@Res() res: Response, @Param('avatarName') imageName: string) {
    return this.filesService.deleteAvatar(imageName, res);
  }
}
