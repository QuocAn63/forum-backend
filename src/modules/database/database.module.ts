import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
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
        synchronize: configService.getOrThrow('DB_SYCHRONIZE'),
      }),
    }),
  ],
  providers: [],
  controllers: [],
  exports: [],
})
export class DatabaseModule {}
