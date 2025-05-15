import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import type { SentMessageInfo } from 'nodemailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  sendEmail(config: ISendMailOptions): Promise<SentMessageInfo> {
    return this.mailerService.sendMail(config);
  }
}
