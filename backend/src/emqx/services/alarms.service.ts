import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Model } from 'mongoose';

import { AlarmRuleDto, UpdateAlarmruleDto } from '../dto';
import { Alarmrule } from '../entities';
import { HandleError } from '../../utils';

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
export class AlarmsService {
  constructor(
    private readonly httpService: HttpService,
    @InjectModel(Alarmrule.name)
    private readonly alarmruleModel: Model<Alarmrule>,
  ) {}

  async createAlarmRule(userId: string, alarmRuleDto: AlarmRuleDto) {
    const {
      condition,
      deviceName,
      dId,
      status,
      triggerTime,
      setPoint,
      variable,
      unit,
      variableFullName,
    } = alarmRuleDto;

    const emqxUrl = `${configService.get('EMQX_API_URI')}/rules`;
    const topic = `${userId}/${dId}/${variable}/sdata`;
    const rawsql = `SELECT username, topic, payload FROM "${topic}" WHERE payload.value ${condition} ${setPoint} AND is_not_null(payload.value)`;

    const newRule = {
      rawsql: rawsql,
      actions: [
        {
          name: 'data_to_webserver',
          params: {
            $resource: global.alarmResource.id,
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
      description: 'ALARM-RULE',
      enabled: status,
    };

    try {
      const res = await firstValueFrom(
        this.httpService.post(emqxUrl, newRule, auth),
      );
      if (res.status === 200 && res.data.data) {
        const newAlarmrule = await this.alarmruleModel.create({
          user: userId,
          dId,
          emqxRuleId: res.data.data.id,
          status,
          variable,
          variableFullName,
          unit,
          setPoint,
          condition,
          triggerTime,
        });

        if (!newAlarmrule) {
          throw new HandleError({
            type: 'BAD_REQUEST',
            message: 'ALARM_NOT_CREATED',
          });
        }

        const emqxUrl = `${configService.get('EMQX_API_URI')}/rules/${
          newAlarmrule.emqxRuleId
        }`;

        const body =
          '{"userId":"' +
          userId +
          '","email":"' +
          newAlarmrule.user.email +
          '","dId":"' +
          dId +
          '","deviceName":"' +
          deviceName +
          '","payload":${payload},"topic":"${topic}","emqxRuleId":"' +
          newAlarmrule.emqxRuleId +
          '","setPoint":' +
          setPoint +
          ',"condition":"' +
          condition +
          '","variable":"' +
          variable +
          '","variableFullName":"' +
          variableFullName +
          '","unit":"' +
          unit +
          '","triggerTime":' +
          triggerTime +
          '}';

        newRule.actions[0].params.body = body;

        await firstValueFrom(this.httpService.put(emqxUrl, newRule, auth));

        return { message: 'ALARM_RULE_CREATED' };
      }
    } catch (error) {
      console.log(error);
      throw HandleError.createSignatureError(error.message);
    }
  }

  async deleteAlarmRule(emqxRuleId: string) {
    const emqxUrl = `${configService.get('EMQX_API_URI')}/rules/${emqxRuleId}`;
    try {
      const res = await firstValueFrom(this.httpService.delete(emqxUrl, auth));

      if (res.status === 200) {
        const alarmDeleted = await this.alarmruleModel.deleteOne({
          emqxRuleId,
        });

        if (alarmDeleted.deletedCount === 0) {
          throw new HandleError({
            type: 'BAD_REQUEST',
            message: 'ALARM_NOT_DELETED_IN_MONGO',
          });
        }
      } else {
        throw new HandleError({
          type: 'BAD_REQUEST',
          message: 'ALARM_NOT_DELETED_IN_EMQX',
        });
      }

      return { message: 'ALARM_DELETED' };
    } catch (error) {
      console.log(error);
      throw HandleError.createSignatureError(error.message);
    }
  }

  async updateAlarmRule(
    emqxRuleId: string,
    updateAlarmruleDto: UpdateAlarmruleDto,
  ) {
    const emqxUrl = `${configService.get('EMQX_API_URI')}/rules/${emqxRuleId}`;
    const { status } = updateAlarmruleDto;

    const toSend = {
      enabled: status,
    };

    try {
      const res = await firstValueFrom(
        this.httpService.put(emqxUrl, toSend, auth),
      );

      if (res.data.data && res.status === 200) {
        const alarmUpdated = await this.alarmruleModel.updateOne(
          { emqxRuleId },
          { status },
        );
        if (alarmUpdated.modifiedCount === 0) {
          throw new HandleError({
            type: 'BAD_REQUEST',
            message: 'ALARM_NOT_UPDATED_IN_MONGO',
          });
        }
      } else {
        throw new HandleError({
          type: 'BAD_REQUEST',
          message: 'ALARM_NOT_UPDATED_IN_EMQX',
        });
      }

      return { message: 'ALARM_UPDATED' };
    } catch (error) {
      console.log(error);
      throw HandleError.createSignatureError(error.message);
    }
  }
}
