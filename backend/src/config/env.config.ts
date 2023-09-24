import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';

ConfigModule.forRoot({
  envFilePath: `.${process.env.NODE_ENV}.env`,
});

const configService = new ConfigService();

export const EnvConfiguration = () => ({
  port: configService.get<number>('PORT'),
  corsOrigin1: configService.get<string>('CORS_ORIGIN_1'),
  dbUri: configService.get<string>('DB_URI'),
  apiUri: configService.get<string>('API_URI'),
  hashSalt: configService.get<number>('HASH_SALT'),
  jwtSecretAccess: configService.get<string>('JWT_SECRET_ACCESS'),
  jwtSecretRefresh: configService.get<string>('JWT_SECRET_REFRESH'),
  mailHost: configService.get<string>('MAIL_HOST'),
  mailPort: configService.get<number>('MAIL_PORT'),
  mailSecure: configService.get<boolean>('MAIL_SECURE'),
  mailUser: configService.get<string>('MAIL_SECURE'),
  mailPassword: configService.get<string>('MAIL_PASSWORD'),
  mailFrom: configService.get<string>('MAIL_FROM'),
  mailAlarms: configService.get<string>('MAIL_ALARMS'),
  emqxHost: configService.get<string>('EMQX_HOST'),
  emqxApiUri: configService.get<string>('EMQX_API_URI'),
  emqxApiToken: configService.get<string>('EMQX_API_TOKEN'),
  emqxResourcesDelay: configService.get<number>('EMQX_RESOURCES_DELAY'),
  emqxStartMqttDelay: configService.get<number>('EMQX_START_MQTT_DELAY'),
  emqxAppSecret: configService.get<string>('EMQX_DEFAULT_APPLICATION_SECRET'),
  emqxNodeSuperuserUser: configService.get<string>('EMQX_NODE_SUPERUSER_USER'),
  emqxNodeSuperuserPass: configService.get<string>(
    'EMQX_NODE_SUPERUSER_PASSWORD',
  ),
});

export const JoiValidationSchema = Joi.object({
  PORT: Joi.number().required().default(3000),
  CORS_ORIGIN_1: Joi.string().required(),
  DB_URI: Joi.string().required(),
  API_URI: Joi.string().required(),
  HASH_SALT: Joi.number().required(),
  JWT_SECRET_ACCESS: Joi.string().required(),
  JWT_SECRET_REFRESH: Joi.string().required(),
  MAIL_HOST: Joi.string().required(),
  MAIL_PORT: Joi.number().required(),
  MAIL_SECURE: Joi.boolean().required(),
  MAIL_USER: Joi.string().required(),
  MAIL_PASSWORD: Joi.string().required(),
  MAIL_FROM: Joi.string().required(),
  MAIL_ALARMS: Joi.string().required(),
  EMQX_HOST: Joi.string().required(),
  EMQX_API_URI: Joi.string().required(),
  EMQX_API_TOKEN: Joi.string().required(),
  EMQX_RESOURCES_DELAY: Joi.number().required(),
  EMQX_START_MQTT_DELAY: Joi.number().required(),
  EMQX_DEFAULT_APPLICATION_SECRET: Joi.string().required(),
  EMQX_NODE_SUPERUSER_USER: Joi.string().required(),
  EMQX_NODE_SUPERUSER_PASSWORD: Joi.string().required(),
});
