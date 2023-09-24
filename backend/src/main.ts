import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import * as morgan from 'morgan';
import { json } from 'express';

import { AppModule } from './app.module';
import { cors } from './config';
import { startMqttClient } from './utils';

import { AuthrulesService } from './emqx/services';

async function bootstrap() {
  const logger = new Logger(' 🔥🔥🔥 ');
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const authrulesService = app.get(AuthrulesService);

  app.enableCors(cors);
  app.use(morgan('tiny'));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.use(cookieParser());
  app.setGlobalPrefix('api');
  app.use(json({ limit: '60mb' }));
  app.enableVersioning({
    defaultVersion: '1',
    type: VersioningType.URI,
  });
  await app.listen(configService.get('PORT'));
  logger.log(`Server is running in ${await app.getUrl()}`);
  console.log('\n');

  // TODO: Funciones de config inicial MQTT
  await authrulesService.checkMqttSuperUser();

  setTimeout(() => {
    startMqttClient();
  }, configService.get('EMQX_START_MQTT_DELAY'));
}

bootstrap();
