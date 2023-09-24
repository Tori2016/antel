import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { SeedersModule } from './seeders/seeders.module';

ConfigModule.forRoot({
  envFilePath: `.${process.env.NODE_ENV}.env`,
});

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('DB_URI'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
        authSource: 'admin',
        connectionFactory: (connection) => {
          connection.plugin(require('mongoose-autopopulate'));
          return connection;
        },
      }),
      inject: [ConfigService],
    }),
    SeedersModule,
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
