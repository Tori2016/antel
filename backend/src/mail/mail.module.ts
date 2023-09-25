import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

ConfigModule.forRoot({
  envFilePath: `.${process.env.NODE_ENV}.env`,
});

const configService = new ConfigService();

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => {
        return {
          transport: {
            host: configService.get('MAIL_HOST'),
            secure: configService.get('MAIL_SECURE') === 'true',
            secureConnection: false,
            tls: {
              ciphers: "SSLv3",
            },
            requireTLS: true,
            port: configService.get('MAIL_PORT'),
            debug: true,
            connectionTimeout: 10000,
            auth: {
              user: configService.get('MAIL_USER'),
              pass: configService.get('MAIL_PASSWORD'),
            },
          },
          defaults: {
            from: `Antel <${configService.get('MAIL_FROM')}>`,
          },
          template: {
            dir: __dirname + '/templates',
            adapter: new HandlebarsAdapter(),
            options: {
              stric: true,
            },
          },
        };
      },
    }),
  ],
})
export class MailModule {}
