import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateTemplateDto } from './dto/create-template.dto';
import { DeleteDto, FindAllDto } from '../common/dto';

import { Template } from './entities/template.schema';
import { HandleError } from '../utils';
import { Device } from '../devices/entities/device.schema';

@Injectable()
export class TemplatesService {
  constructor(
    @InjectModel(Template.name)
    private readonly templateModel: Model<Template>,
    @InjectModel(Device.name)
    private readonly deviceModel: Model<Device>,
  ) {}

  async create(userId: string, createTemplateDto: CreateTemplateDto) {
    try {
      await this.templateModel.create({
        ...createTemplateDto,
        userId,
      });

      return { message: 'TEMPLATE_CREATED' };
    } catch (error) {
      throw HandleError.createSignatureError(error.message);
    }
  }

  async findAll(findAllDto: FindAllDto): Promise<Template[]> {
    const { limit = 0, offset = 0, userId } = findAllDto;

    try {
      if (!userId) {
        const templates: Template[] = await this.templateModel
          .find()
          .limit(limit)
          .skip(offset);
        return templates;
      } else {
        const templates: Template[] = await this.templateModel.find({ userId });
        return templates;
      }
    } catch (error) {
      throw HandleError.createSignatureError('INTERNAL_SERVER_ERROR');
    }
  }

  async remove(deleteDto: DeleteDto) {
    const { userId, templateId } = deleteDto;

    try {
      const devices = await this.deviceModel.find({
        userId,
        template: templateId,
      });

      if (devices.length > 0) {
        throw new HandleError({
          type: 'BAD_REQUEST',
          message: 'TEMPLATE_IN_USE',
        });
      }

      const templateDeleted = await this.templateModel.deleteOne({
        _id: templateId,
        userId,
      });

      if (templateDeleted.deletedCount === 0) {
        throw new HandleError({
          type: 'BAD_REQUEST',
          message: 'TEMPLATE_NOT_DELETED',
        });
      }

      return { message: 'TEMPLATE_DELETED' };
    } catch (error) {
      throw HandleError.createSignatureError(error.message);
    }
  }
}
