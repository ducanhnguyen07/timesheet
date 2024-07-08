import { ConfigModule, ConfigService } from '@nestjs/config';

export const SendMailConfig = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    transport: {
      service: 'gmail',
      auth: {
        user: configService.getOrThrow('EMAIL_USER'),
        pass: configService.getOrThrow('EMAIL_PASSWORD'),
      },
    },
    defaults: {
      from: '"No Reply" <noreply@example.com>',
    },
  })
};
