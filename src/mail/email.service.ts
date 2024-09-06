import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MailerService } from '@nestjs-modules/mailer';
import { LoggerService } from '../../src/logging/log.service';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly loggerService: LoggerService,
  ) {}

  // @Cron(CronExpression.EVERY_30_SECONDS, { name: 'send mail to user' })
  async handleCron() {
    this.loggerService.logInfo('Send mail to user...');
    try {
      await this.mailerService.sendMail({
        to: process.env.EMAIL_TEST,
        from: process.env.EMAIL_USER,
        subject: 'Test email',
        text: 'This is a test email from NestJS cron job.',
      });

      this.loggerService.logInfo('Email sent successfully!');
    } catch (error) {
      this.loggerService.logError('Error sending email:', error);
    }
  }
}
