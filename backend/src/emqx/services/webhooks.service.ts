import { Injectable } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Request, Response } from 'express';
import { Model } from 'mongoose';

import { Device } from '../../devices/entities/device.schema';

import { HandleError } from '../../utils';
import { AlarmWebhookDto, SaveWebhookDto } from '../dto';
import { IAlarm } from '../interfaces';

import { Data } from '../../datas/entities/data.schema';
import { Alarmrule, Notification } from '../entities';

ConfigModule.forRoot({
  envFilePath: `.${process.env.NODE_ENV}.env`,
});
const configService = new ConfigService();

@Injectable()
export class WebhooksService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    @InjectModel(Device.name)
    private readonly deviceModel: Model<Device>,
    @InjectModel(Data.name)
    private readonly dataModel: Model<Data>,
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,
    @InjectModel(Alarmrule.name)
    private readonly alarmruleModel: Model<Alarmrule>,
  ) {}

  async saveWebhook(saveWebhookDto: SaveWebhookDto, req: Request) {
    const { userId, payload, topic } = saveWebhookDto;
    try {
      if (req.headers.token != configService.get('EMQX_API_TOKEN')) {
        throw new HandleError({
          type: 'UNAUTHORIZED',
          message: 'TOKEN_EMQX_NOT_VALID',
        });
      }

      const splittedTopic = topic.split('/');
      const dId = splittedTopic[1];
      const variable = splittedTopic[2];

      const device = await this.deviceModel.find({ userId, dId });

      if (device) {
        if (payload.type === 'sensor') {
          var sensorData: any = new Object();
          sensorData.type = payload.type;
          sensorData.value = payload.value;

          await this.dataModel.create({
            userId,
            dId,
            variable,
            value: sensorData,
            time: Date.now(),
          });
        } else if (payload.type === 'gps') {
          var position: any = new Object();
          position.type = payload.type;
          position.lat = payload.lat;
          position.lng = payload.lng;

          await this.dataModel.create({
            userId,
            dId,
            variable,
            value: position,
            time: Date.now(),
          });
        }
      } else {
        throw new HandleError({
          type: 'NOT_FOUND',
          message: 'DEVICE_NOT_FOUND',
        });
      }

      return { message: 'DATA_SAVE' };
    } catch (error) {
      console.log(error);
      throw HandleError.createSignatureError(error.message);
    }
  }

  async alarmWebhook(
    alarmWebhookDto: AlarmWebhookDto,
    req: Request,
    res: Response,
  ) {
    const incomingAlarm = {
      ...alarmWebhookDto,
      time: Date.now(),
    };
    try {
      if (req.headers.token != configService.get('EMQX_API_TOKEN')) {
        throw new HandleError({
          type: 'UNAUTHORIZED',
          message: 'TOKEN_EMQX_NOT_VALID',
        });
      }
      res.status(200).json();

      await this.updateAlarmCounter(incomingAlarm.emqxRuleId);

      const lastNotif = await this.notificationModel
        .find({
          dId: incomingAlarm.dId,
          emqxRuleId: incomingAlarm.emqxRuleId,
        })
        .sort({ time: -1 })
        .limit(1);

      if (lastNotif.length === 0) {
        this.saveNotifToMongo(incomingAlarm);
        this.sendMqttNotif(incomingAlarm);
        // TODO: Activar en producción
        this.eventEmitter.emit('alarm-rule', incomingAlarm);
      } else {
        const lastNotifToNowMins = (Date.now() - lastNotif[0].time) / 1000 / 60;

        if (lastNotifToNowMins > incomingAlarm.triggerTime) {
          this.saveNotifToMongo(incomingAlarm);
          this.sendMqttNotif(incomingAlarm);
          // TODO: Activar en producción
          this.eventEmitter.emit('alarm-rule', incomingAlarm);
        }
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json();
    }
  }

  async getNotifications(userId: string) {
    try {
      const notifications = await this.notificationModel.find({
        userId,
        readed: false,
      });
      if (!notifications) {
        return { message: 'NOTIFICATION_NOT_FOUND' };
      }
      return notifications;
    } catch (error) {
      console.log(error);
      throw HandleError.createSignatureError('INTERNAL_SERVER_ERROR');
    }
  }

  async readNotifications(userId: string, notifId: string) {
    try {
      console.log(userId);
      console.log(notifId);
      const updatedNotif = await this.notificationModel.updateOne(
        {
          _id: notifId,
          userId,
        },
        { readed: true },
      );
      if (updatedNotif.modifiedCount === 0) {
        throw new HandleError({
          type: 'BAD_REQUEST',
          message: 'NOTIFICATION_NOT_UPDATED',
        });
      }
      return { message: 'NOTIFICATION_UPDATED' };
    } catch (error) {
      console.log(error);
      throw HandleError.createSignatureError(error.message);
    }
  }

  // F U N T I O N S
  saveNotifToMongo(incomingAlarm: AlarmWebhookDto) {
    try {
      this.notificationModel.create({
        ...incomingAlarm,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async updateAlarmCounter(emqxRuleId: string) {
    try {
      await this.alarmruleModel.updateOne(
        { emqxRuleId },
        { $inc: { counter: 1 } },
      );
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  sendMqttNotif(notif: IAlarm) {
    const topic = `${notif.userId}/alert-did/alert-var/notif`;
    const msg = `¡ALERTA EN DISPOSITIVO! ${notif.deviceName}, ${notif.variableFullName} es ${notif.condition} que ${notif.setPoint}`;
    global.mqttClient.publish(topic, msg);
  }
}
