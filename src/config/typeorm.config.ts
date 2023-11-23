import { ConfigService } from '@nestjs/config';
import { configDotenv } from 'dotenv';
import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';

configDotenv({ path: '.env' });

const configService = new ConfigService();

export const typeormConfig = {
  type: 'postgres',
  host: configService.getOrThrow('DB_HOST'),
  port: configService.getOrThrow('DB_PORT')
    ? Number.parseInt(configService.getOrThrow('DB_PORT'))
    : 5432,
  username: configService.getOrThrow('DB_USERNAME'),
  password: configService.getOrThrow('DB_PASSWORD'),
  database: configService.getOrThrow('DB_DBNAME'),
  schema: configService.getOrThrow('DB_SCHEMA'),
  autoLoadEntities: true,
  synchronize: configService.getOrThrow('DB_SYCHRONIZE'),
  migrations: [join(__dirname, '..', 'migrations/**/*.{js,ts}')],
};

export default new DataSource(typeormConfig as DataSourceOptions);
