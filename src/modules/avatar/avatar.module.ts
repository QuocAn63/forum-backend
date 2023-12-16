import { Get, Module, Param, Res, StreamableFile } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';
import { cwd } from 'process';
import { AvatarController } from './avatar.controller';

@Module({
  imports: [],
  controllers: [AvatarController],
})
export class AvatarModule {}
