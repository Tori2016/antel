import { Injectable } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { Interval, Timeout } from '@nestjs/schedule';

import { firstValueFrom } from 'rxjs';
import { color } from 'console-log-colors';

import { IWebhook } from '../interfaces';

global.saveResource = null;
global.alarmResource = null;

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
export class ApiService {
  constructor(private readonly httpService: HttpService) {}

  @Timeout(configService.get('EMQX_RESOURCES_DELAY'))
  async listResources() {
    const emqxUrl = `${configService.get('EMQX_API_URI')}/resources`;
    try {
      const { data, status } = await firstValueFrom(
        this.httpService.get(emqxUrl, auth),
      );

      if (status === 200) {
        if (data.data.length === 0) {
          await this.createResources();
        } else if (data.data.length === 2) {
          data.data.forEach((resource: IWebhook) => {
            if (resource.description == 'alarm-webhook') {
              global.alarmResource = resource;
              console.log(color.green('✅ ALARM RESOURCE FOUND ✅'));
              // console.log(global.alarmResource);
            }
            if (resource.description == 'save-webhook') {
              global.saveResource = resource;
              console.log(color.green('✅ SAVE RESOURCE FOUND ✅'));
              // console.log(global.saveResource);
            }
          });
        } else {
          function printWarning() {
            console.log(
              color.red('DELETE ALL WEBHOOK EMQX RESOURCES AND RESTART NODE'),
            );
            setTimeout(() => {
              printWarning();
            }, 3000);
          }
          printWarning();
        }
      } else {
        console.log(color.red('ERROR: Request EMQX API'));
      }
    } catch (error) {
      console.log(error);
      console.log(color.red('ERROR: Listing Resources'));
    }
  }

  async createResources() {
    const emqxUrl = `${configService.get('EMQX_API_URI')}/resources`;

    const resSave = {
      type: 'web_hook',
      description: 'save-webhook',
      config: {
        url: `${configService.get('API_URI')}/webhooks/save`,
      },
    };

    const resAlarm = {
      type: 'web_hook',
      description: 'alarm-webhook',
      config: {
        url: `${configService.get('API_URI')}/webhooks/alarm`,
      },
    };

    try {
      const res1 = await firstValueFrom(
        this.httpService.post(emqxUrl, resSave, auth),
      );
      if (res1.status === 200) {
        console.log(color.green('Save resource created! ✅'));
      }

      const res2 = await firstValueFrom(
        this.httpService.post(emqxUrl, resAlarm, auth),
      );
      if (res2.status === 200) {
        console.log(color.green('Alarm resource created! ✅'));
        console.log('\n');
      }

      setTimeout(async () => {
        await this.listResources();
      }, 1000);
    } catch (error) {
      console.log(error);
      console.log(color.red('ERROR: Creating Resources'));
    }
  }
}
