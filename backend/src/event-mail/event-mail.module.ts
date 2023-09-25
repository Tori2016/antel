import { Module } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { User } from '../users/entities/user.schema';
import { IAlarm } from '../emqx/interfaces';
import { unixToDate, unixToHora } from '../utils';

ConfigModule.forRoot({
  envFilePath: `.${process.env.NODE_ENV}.env`,
});

const configService = new ConfigService();

@Module({})
export class EventMailModule {
  constructor(private readonly mailService: MailerService) {}

  @OnEvent('user-create')
  public handleUserCreatedEvent(user: User) {
    this.mailService.sendMail({
      to: user.email,
      subject: 'Bienvenido a Antel Ingeniería',
      template: 'createuser',
      context: {
        firstName: user.firstName,
        lastName: user.lastName,
        user: user.email,
        password: user.password,
        token: user.token,
        url: configService.get('CORS_ORIGIN_1'),
      },
    });
  }

  @OnEvent('forgot-password')
  public handleForgotCreatedEvent(user: User) {
    this.mailService.sendMail({
      to: user.email,
      subject: 'Antel - Restablecer contraseña',
      template: 'forgot-password',
      context: {
        token: user.token,
        url: configService.get('CORS_ORIGIN_1'),
      },
    });
  }

  @OnEvent('alarm-rule')
  public handleAlarmRuleEvent(alarm: IAlarm) {
    this.mailService.sendMail({
      from: `Antel <${configService.get('MAIL_ALARMS')}>`,
      bcc: 'soporte@antel.com.co',
      to: alarm.email,
      subject: '¡ALERTA! - Nueva alarma en el sistema',
      template: 'alarm-rule',
      context: {
        dId: alarm.dId,
        deviceName: alarm.deviceName,
        variable: alarm.variableFullName,
        currentValue: alarm.payload.value,
        condition: alarm.condition,
        setPoint: alarm.setPoint,
        unit: alarm.unit,
        date: unixToDate(String(alarm.time)),
        time: unixToHora(String(alarm.time)),
      },
    });
  }
}
