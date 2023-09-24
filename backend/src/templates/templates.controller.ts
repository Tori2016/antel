import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';

import { TemplatesService } from './templates.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { DeleteDto, FindAllDto } from '../common/dto';

import { Auth } from '../auth/decorators';
import { Template } from './entities/template.schema';
import { ParseMongoIdPipe } from '../common/pipes';
import { ValidRoles } from '../common/interfaces';

@Controller('templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Post(':id')
  @Auth(ValidRoles.ADMIN)
  create(
    @Param('id', ParseMongoIdPipe) userId: string,
    @Body() createTemplateDto: CreateTemplateDto,
  ) {
    return this.templatesService.create(userId, createTemplateDto);
  }

  @Get()
  @Auth()
  findAll(@Query() findAllDto: FindAllDto): Promise<Template[]> {
    return this.templatesService.findAll(findAllDto);
  }

  @Delete()
  @Auth()
  remove(@Query() deleteDto: DeleteDto) {
    return this.templatesService.remove(deleteDto);
  }
}
