import { Module } from '@nestjs/common';
import { MailService } from './services/mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import * as Handlebars from 'handlebars';
import { ConfigModule, ConfigService } from '@nestjs/config';

const templatesDir =
  process.env.NODE_ENV === 'production'
    ? join(__dirname, 'templates') // dist/infrastructure/mail/templates
    : join(process.cwd(), 'src/infrastructure/mail/templates'); // dev-режим

const FROM_TITLE =
  process.env.NODE_ENV === 'production' ? 'Climatic' : 'Climatic Dev';
@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get('MAIL_HOST'),
          port: configService.get('MAIL_PORT'),
          auth: {
            user: configService.get('MAIL_USER'),
            pass: configService.get('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `"${FROM_TITLE}" <${configService.get('MAIL_FROM')}>`,
        },
        template: {
          dir: templatesDir,
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  controllers: [],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {
  constructor() {
    // Register Handlebars helpers
    Handlebars.registerHelper('eq', (a, b) => a === b);
  }
}
