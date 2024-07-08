import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MailerService } from '@nestjs-modules/mailer'; // Hoặc thư viện gửi email bạn sử dụng

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly mailerService: MailerService) {}

  @Cron(CronExpression.EVERY_30_SECONDS, { name: 'send mail to user' })
  async handleCron() {
    this.logger.debug('Send mail to user...');
    try {
      await this.mailerService.sendMail({
        to: process.env.EMAIL_TEST,
        from: process.env.EMAIL_USER,
        subject: 'Test email',
        text: 'This is a test email from NestJS cron job.',
      });

      this.logger.debug('Email sent successfully!');
    } catch (error) {
      this.logger.error('Error sending email:', error);
    }
  }
}