import { ConfigModule, ConfigService } from "@nestjs/config";

export const ThrottlerConfig = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => [
    {
      ttl: config.get('THROTTLE_TTL'),
      limit: config.get('THROTTLE_LIMIT'),
    },
  ],
};