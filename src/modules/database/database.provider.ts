import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { join } from 'path';
import { cwd } from 'process';

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
    entities: ['../../src/modules/**/entities/*.entity.ts'],
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
    autoLoadEntities: true,
    entities: ['../../src/modules/**/entities/*.entity.ts'],
    synchronize: configService.getOrThrow('DB_SYCHRONIZE'),
  }),
  inject: [ConfigService],
};
