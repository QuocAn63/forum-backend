import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { join } from 'path';

export const DevDatabaseOption: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
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
    logging: true,
    logger: 'advanced-console',
    synchronize: configService.getOrThrow('DB_SYCHRONIZE'),
    migrations: [join(__dirname, '..', 'migrations/**/*.{js,ts}')],
  }),
  inject: [ConfigService],
};

export const TestDatabaseOption: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.getOrThrow('DB_HOST'),
    port: configService.getOrThrow('DB_PORT')
      ? Number.parseInt(configService.getOrThrow('DB_PORT'))
      : 5432,
    username: configService.getOrThrow('DB_USERNAME'),
    password: configService.getOrThrow('DB_PASSWORD'),
    database: configService.getOrThrow('DB_TEST_DBNAME'),
    schema: configService.getOrThrow('DB_SCHEMA'),
    entities: ['src/modules/**/entities/*.entity.ts'],
    autoLoadEntities: true,
    synchronize: configService.getOrThrow('DB_SYCHRONIZE'),
  }),
  inject: [ConfigService],
};
