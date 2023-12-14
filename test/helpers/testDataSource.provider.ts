import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

export const DataSourceProvider = {
  provide: DataSource,
  useFactory: (configService: ConfigService) => {
    const dataSource = new DataSource({
      type: 'postgres',
      host: configService.getOrThrow('DB_HOST'),
      port: configService.getOrThrow('DB_PORT')
        ? Number.parseInt(configService.getOrThrow('DB_PORT'))
        : 5432,
      username: configService.getOrThrow('DB_USERNAME'),
      password: configService.getOrThrow('DB_PASSWORD'),
      database: configService.getOrThrow('DB_TEST_DBNAME'),
      schema: configService.getOrThrow('DB_SCHEMA'),
      synchronize: false,
      entities: ['src/modules/**/entities/*.entity.ts'],
    });

    return dataSource.initialize();
  },
  inject: [ConfigService],
};
