import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import InitSeeder from './seeds/init.seed';

config();

const configService = new ConfigService();

const dataSourceOptions: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: configService.getOrThrow('DATABASE_HOST'),
  port: configService.getOrThrow('DATABASE_PORT'),
  database: configService.getOrThrow('DATABASE'),
  username: configService.getOrThrow('DATABASE_USERNAME'),
  password: configService.getOrThrow('DATABASE_PASSWORD'),
  synchronize: false,
  entities: [`${__dirname}/../src/**/*.entity{.ts,.js}`],
  migrations: [`${__dirname}/../typeorm/migrations/*{.ts,.js}`],
  seeds: [InitSeeder],
}

export default new DataSource(dataSourceOptions);
