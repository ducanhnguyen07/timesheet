import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailService } from './email.service'; // Import service chứa cron job
import { SendMailConfig } from '../configs/send-mail.config';
import { ConfigModule } from '@nestjs/config';
import { LoggerService } from '../../src/logging/log.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MailerModule.forRootAsync(SendMailConfig),
  ],
  providers: [EmailService, LoggerService],
})
export class EmailModule {}