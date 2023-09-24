import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { Model } from 'mongoose';
import { firstValueFrom } from 'rxjs';

import { DeleteDto, FindAllDto } from '../common/dto';
import { CreateDeviceDto } from './dto/create-device.dto';

import { HandleError, makeId } from '../utils';

import { Device } from './entities/device.schema';
import { Template } from '../templates/entities/template.schema';
import { Alarmrule, Authrule, Saverule } from '../emqx/entities';
import { UpdateSaveruleDto } from './dto';

ConfigModule.forRoot({
  envFilePath: `.${process.env.NODE_ENV}.env`,
});
const configService = new ConfigService();

const auth = {
  auth: {
    username: 'admin',
    password: configService.get('EMQX_DEFAULT_APPLICATION_SECRET'),
  },
};

@Injectable()
export class DevicesService {
  constructor(
    private readonly httpService: HttpService,
    @InjectModel(Device.name)
    private readonly deviceModel: Model<Device>,
    @InjectModel(Template.name)
    private readonly templateModel: Model<Template>,
    @InjectModel(Saverule.name)
    private readonly saveruleModel: Model<Saverule>,
    @InjectModel(Alarmrule.name)
    private readonly alarmruleModel: Model<Alarmrule>,
    @InjectModel(Authrule.name)
    private readonly authruleModel: Model<Authrule>,
  ) {}

  async create(userId: string, createDeviceDto: CreateDeviceDto) {
    const { ...newDevice } = createDeviceDto;

    try {
      const newSaverule = await this.createSaveRule(
        userId,
        newDevice.dId,
        true,
      );

      if (!newSaverule) {
        throw new HandleError({
          type: 'BAD_REQUEST',
          message: 'SAVERULE_NOT_CREATED',
        });
      }

      await this.deviceModel.create({
        ...newDevice,
        userId,
        saveRule: newSaverule.id,
        password: await makeId(10),
      });

      if (!(await this.selectDevice(userId, newDevice.dId))) {
        throw new HandleError({
          type: 'BAD_REQUEST',
          message: 'DEVICE_NOT_SELECTED',
        });
      }

      await this.updateTemplateCounter(newDevice.template, 1);

      return { message: 'DEVICE_CREATED' };
    } catch (error) {
      if (error.code === 11000) {
        throw HandleError.createSignatureError(
          `${error.code}-${JSON.stringify(error.keyValue)}`,
        );
      }
      throw HandleError.createSignatureError(error.message);
    }
  }

  async findAll(findAllDto: FindAllDto) {
    const { limit = 0, offset = 0, userId } = findAllDto;

    try {
      if (!userId) {
        const devices: Device[] = await this.deviceModel.find();
        return devices;
      } else {
        var devices: any[] = await this.deviceModel.find({ userId });

        devices = JSON.parse(JSON.stringify(devices));

        const alarmRules = await this.getAlarmRules(userId);

        devices.forEach((device: any, index: number) => {
          devices[index].alarmRules = alarmRules.filter(
            (alarmRule: any) => alarmRule.dId == device.dId,
          );
        });

        return devices;
      }
    } catch (error) {
      throw HandleError.createSignatureError(error.message);
    }
  }

  async selectedDevice(userId: string, dId: string) {
    try {
      if (!(await this.selectDevice(userId, dId))) {
        throw new HandleError({
          type: 'BAD_REQUEST',
          message: 'DEVICE_NOT_SELECTED',
        });
      }
      return { message: 'DEVICE_SELECTED' };
    } catch (error) {
      throw HandleError.createSignatureError(error.message);
    }
  }

  async remove(deleteDto: DeleteDto) {
    const { userId, dId, templateId } = deleteDto;

    try {
      if (!(await this.deleteSaveRule(dId))) {
        throw new HandleError({
          type: 'BAD_REQUEST',
          message: 'SAVERULE_NOT_DELETED',
        });
      }

      if (!(await this.deleteAllAlarmRules(userId, dId))) {
        throw new HandleError({
          type: 'BAD_REQUEST',
          message: 'ALARMSRULE_NOT_DELETED',
        });
      }

      if (!(await this.updateTemplateCounter(templateId, -1))) {
        throw new HandleError({
          type: 'BAD_REQUEST',
          message: 'TEMPLATE_COUNTER_NOT_UPDATED',
        });
      }

      if (!(await this.deleteMqttDeviceCredentials(dId))) {
        throw new HandleError({
          type: 'BAD_REQUEST',
          message: 'CREDENTIALS_NOT_DELETED',
        });
      }

      const deviceDeleted = await this.deviceModel.deleteOne({ userId, dId });

      if (deviceDeleted.deletedCount === 0) {
        throw new HandleError({
          type: 'BAD_REQUEST',
          message: 'DEVICE_NOT_DELETED',
        });
      }

      const devices = await this.deviceModel.find({ userId });

      if (devices.length >= 1) {
        var found = false;
        devices.forEach((devices) => {
          if (devices.selected == true) {
            found = true;
          }
        });

        if (!found) {
          await this.deviceModel.updateMany({ userId }, { selected: false });

          await this.deviceModel.updateOne(
            { userId, dId: devices[0].dId },
            { selected: true },
          );
        }
      }

      return { message: 'DEVICE_DELETED' };
    } catch (error) {
      throw HandleError.createSignatureError(error.message);
    }
  }

  // F U N T I O N S
  async selectDevice(userId: string, dId: string) {
    try {
      await this.deviceModel.updateMany({ userId }, { selected: false });

      const updateOneDevice = await this.deviceModel.findOneAndUpdate(
        { dId, userId },
        { selected: true },
      );
      if (!updateOneDevice) return false;

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async updateTemplateCounter(templateId: string, number: number) {
    try {
      await this.templateModel.updateOne(
        { _id: templateId },
        { $inc: { counter: number } },
      );
      return true;
    } catch (error) {
      return false;
    }
  }

  // E M Q X
  async createSaveRule(userId: string, dId: string, status: boolean) {
    const emqxUrl = `${configService.get('EMQX_API_URI')}/rules`;
    const topic = `${userId}/${dId}/+/sdata`;
    const rawsql = `SELECT topic, payload FROM "${topic}" WHERE payload.save = 1`;

    const newRule = {
      rawsql: rawsql,
      actions: [
        {
          name: 'data_to_webserver',
          params: {
            $resource: global.saveResource.id,
            body:
              '{"userId":"' +
              userId +
              '","payload":${payload},"topic":"${topic}"}',
            headers: {
              token: configService.get<string>('EMQX_API_TOKEN'),
              'content-type': 'application/json',
            },
            method: 'POST',
          },
        },
      ],
      description: 'SAVE-RULE',
      enabled: status,
    };

    try {
      const res = await firstValueFrom(
        this.httpService.post(emqxUrl, newRule, auth),
      );
      if (res.status === 200 && res.data.data) {
        const newSaverule = await this.saveruleModel.create({
          userId,
          dId,
          emqxRuleId: res.data.data.id,
          status,
        });
        return newSaverule;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }

  async getAlarmRules(userId: string) {
    try {
      const rules = await this.alarmruleModel.find({ user: userId });
      return rules;
    } catch (error) {
      console.log(error);
    }
  }

  async updateSaveruleStatus(updateSaveruleDto: UpdateSaveruleDto) {
    const { emqxRuleId, status } = updateSaveruleDto;
    const emqxUrl = `${configService.get('EMQX_API_URI')}/rules/${emqxRuleId}`;
    const newRule = { enabled: status };

    try {
      const res = await firstValueFrom(
        this.httpService.put(emqxUrl, newRule, auth),
      );

      if (res.status === 200 && res.data.data) {
        const updateSaverule = await this.saveruleModel.findOneAndUpdate(
          { emqxRuleId },
          { status },
        );

        if (!updateSaverule) {
          throw new HandleError({
            type: 'BAD_REQUEST',
            message: 'SAVERULE_NOT_UPDATED',
          });
        }

        return { message: 'SAVERULE_UPDATED' };
      } else {
        throw new HandleError({
          type: 'BAD_REQUEST',
          message: 'SAVERULE_NOT_UPDATED',
        });
      }
    } catch (error) {
      throw HandleError.createSignatureError(error.message);
    }
  }

  async deleteSaveRule(dId: string) {
    try {
      const rule = await this.saveruleModel.findOne({ dId });
      const emqxUrl = `${configService.get('EMQX_API_URI')}/rules/${
        rule.emqxRuleId
      }`;

      await firstValueFrom(this.httpService.delete(emqxUrl, auth));

      const saveRuleDeleted = await this.saveruleModel.deleteOne({ dId });
      if (saveRuleDeleted.deletedCount === 0) return false;

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async deleteAllAlarmRules(userId: string, dId: string) {
    try {
      const rules = await this.alarmruleModel.find({ user: userId, dId });

      if (rules.length > 0) {
        this.asyncForEach(rules, async (rule: any) => {
          const emqxUrl = `${configService.get('EMQX_API_URI')}/rules/${
            rule.emqxRuleId
          }`;
          await firstValueFrom(this.httpService.delete(emqxUrl, auth));
        });

        const alarmsDeleted = await this.alarmruleModel.deleteMany({
          user: userId,
          dId,
        });

        if (alarmsDeleted.deletedCount === 0) return false;
      }

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async asyncForEach(array: any, callback: any) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

  async deleteMqttDeviceCredentials(dId: string) {
    try {
      await this.authruleModel.deleteMany({ dId, type: 'device' });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
