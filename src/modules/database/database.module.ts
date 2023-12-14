import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DevDatabaseOption, TestDatabaseOption } from './database.provider';

@Module({})
export class DatabaseModule {
  static forRootAsync(env: 'DEV' | 'PROD' | 'TEST'): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forRootAsync(
          env === 'DEV' ? DevDatabaseOption : TestDatabaseOption,
        ),
      ],
      providers: [],
      exports: [DatabaseModule],
      controllers: [],
    };
  }
}
