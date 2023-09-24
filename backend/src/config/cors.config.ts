import { ConfigModule, ConfigService } from '@nestjs/config';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

ConfigModule.forRoot({
  envFilePath: `.${process.env.NODE_ENV}.env`,
});
const configService = new ConfigService();

const whiteList = [configService.get('CORS_ORIGIN_1')];

export const cors: CorsOptions = {
  origin: function (origin, callback) {
    if (!origin || whiteList.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log(`Error de CORS origin: ${origin}, no autorizado`);
      callback(new Error(`Error de CORS origin: ${origin}, no autorizado`));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  credentials: true,
};
