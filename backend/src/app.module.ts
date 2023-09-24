import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';

import { EnvConfiguration, JoiValidationSchema } from './config';

import { AppController } from './app.controller';

import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DevicesModule } from './devices/devices.module';
import { EventMailModule } from './event-mail/event-mail.module';
import { MailModule } from './mail/mail.module';
import { TemplatesModule } from './templates/templates.module';
import { EmqxModule } from './emqx/emqx.module';
import { DatasModule } from './datas/datas.module';
import { FilesModule } from './files/files.module';
import { AuthrulesService } from './emqx/services';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
      isGlobal: true,
      load: [EnvConfiguration],
      validationSchema: JoiValidationSchema,
    }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    EventEmitterModule.forRoot(),
    EventMailModule,
    AuthModule,
    FilesModule,
    UsersModule,
    TemplatesModule,
    DevicesModule,
    MailModule,
    EmqxModule,
    DatasModule,
  ],
  controllers: [AppController],
  providers: [AuthrulesService],
})
export class AppModule {}
