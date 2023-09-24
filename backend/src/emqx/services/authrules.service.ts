import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types, Model } from 'mongoose';
import { Response } from 'express';

import { HandleError, makeId } from '../../utils';

import { Authrule } from '../entities';
import { DeviceCredentialDto } from '../dto';
import { Device } from '../../devices/entities/device.schema';
import { Template } from '../../templates/entities/template.schema';
import { color } from 'console-log-colors';

@Injectable()
export class AuthrulesService {
  constructor(
    @InjectModel(Authrule.name)
    private readonly authruleModel: Model<Authrule>,
    @InjectModel(Device.name)
    private readonly deviceModel: Model<Device>,
    @InjectModel(Template.name)
    private readonly templateModel: Model<Template>,
  ) {}

  async webCredentials(userId: string, res: Response) {
    const credentials = await this.getWebCredentials(userId);
    res.json(credentials);

    setTimeout(() => {
      this.getWebCredentials(userId);
    }, 5000);
    return;
  }
  async webCredentialsReconnect(userId: string, res: Response) {
    const credentials = await this.getWebCredentialsReconnect(userId);
    res.json(credentials);

    setTimeout(() => {
      this.getWebCredentials(userId);
    }, 15000);
    return;
  }
  async deviceCredentilas(
    deviceCredentialDto: DeviceCredentialDto,
    res: Response,
  ) {
    const { dId, password } = deviceCredentialDto;
    try {
      const device = await this.deviceModel.findOne({ dId });

      if (!device) {
        throw new HandleError({
          type: 'UNAUTHORIZED',
          message: 'CREDENTIALS_INVALID',
        });
      }

      if (password != device.password) {
        throw new HandleError({
          type: 'UNAUTHORIZED',
          message: 'CREDENTIALS_INVALID',
        });
      }

      const userId = device.userId;

      const credentials = await this.getDeviceCredentials(userId, dId);

      const template = await this.templateModel.findOne({
        _id: device.template,
      });

      var variables = [];

      template.widgets.forEach((widget) => {
        var v = (({
          variable,
          variableFullName,
          variableType,
          variableSendFreq,
        }) => ({
          variable,
          variableFullName,
          variableType,
          variableSendFreq,
        }))(widget);

        variables.push(v);
      });

      const response = {
        username: credentials.username,
        password: credentials.password,
        topic: userId + '/' + dId + '/',
        variables,
      };

      res.json(response);

      setTimeout(() => {
        this.getDeviceCredentials(userId, dId);
      }, 10000);
    } catch (error) {
      console.log(error);
      throw HandleError.createSignatureError(error.message);
    }
  }
  async checkMqttSuperUser() {
    try {
      const superusers = await this.authruleModel.find({ type: 'superuser' });

      if (superusers.length > 0) {
        return;
      } else if (superusers.length === 0) {
        const newSuperuser = {
          publish: ['#'],
          subscribe: ['#'],
          userId: 'emqxmqttsuperuser',
          username: process.env.EMQX_NODE_SUPERUSER_USER,
          password: process.env.EMQX_NODE_SUPERUSER_PASSWORD,
          type: 'superuser',
          time: Date.now(),
          updatedTime: Date.now(),
        };
        await this.authruleModel.create(newSuperuser);
        console.log(color.green('✅ EMQX SUPERUSER CREATED ✅'));
      }
    } catch (error) {
      console.log(error);
    }
  }

  // F U N T I O N S
  async getWebCredentials(userId: string) {
    try {
      const authRule = await this.authruleModel.find({ userId, type: 'user' });

      if (authRule.length === 0) {
        const newAuthRule = {
          userId,
          username: await makeId(10),
          password: await makeId(10),
          publish: [userId + '/#'],
          subscribe: [userId + '/#'],
          type: 'user',
        };
        const result = await this.authruleModel.create(newAuthRule);
        return { username: result.username, password: result.password };
      }

      const newUserName = await makeId(10);
      const newPassword = await makeId(10);

      const ruleUpdated = await this.authruleModel.updateOne(
        { type: 'user', userId },
        {
          username: newUserName,
          password: newPassword,
          updatedTime: Date.now(),
        },
      );

      if (ruleUpdated.modifiedCount === 0) {
        throw new HandleError({
          type: 'BAD_REQUEST',
          message: 'CREDENTIALS_NOT_UPDATED',
        });
      }

      return { username: newUserName, password: newPassword };
    } catch (error) {
      console.log(error);
      throw HandleError.createSignatureError(error.message);
    }
  }
  async getWebCredentialsReconnect(userId: string) {
    try {
      const authRule = await this.authruleModel.find({ userId, type: 'user' });
      if (authRule.length === 1) {
        const newAuthRule = {
          username: authRule[0].username,
          password: authRule[0].password,
        };
        return newAuthRule;
      }
    } catch (error) {
      console.log(error);
    }
  }
  async getDeviceCredentials(userId: Types.ObjectId, dId: string) {
    try {
      const authRule = await this.authruleModel.find({
        userId,
        dId,
        type: 'device',
      });

      if (authRule.length === 0) {
        const newAuthRule = {
          userId,
          dId,
          username: await makeId(10),
          password: await makeId(10),
          publish: [
            userId + '/' + dId + '/+/sdata',
            userId + '/' + dId + '/+/status',
            userId + '/' + dId + '/+/data',
          ],
          subscribe: [userId + '/' + dId + '/+/actdata'],
          type: 'device',
        };
        const result = await this.authruleModel.create(newAuthRule);
        return { username: result.username, password: result.password };
      }

      const newUserName = await makeId(10);
      const newPassword = await makeId(10);

      const ruleUpdated = await this.authruleModel.updateOne(
        { type: 'device', userId },
        {
          username: newUserName,
          password: newPassword,
          updatedTime: Date.now(),
        },
      );

      if (ruleUpdated.modifiedCount === 0) {
        throw new HandleError({
          type: 'BAD_REQUEST',
          message: 'CREDENTIALS_NOT_UPDATED',
        });
      }

      return { username: newUserName, password: newPassword };
    } catch (error) {
      console.log(error);
      throw HandleError.createSignatureError(error.message);
    }
  }
}
