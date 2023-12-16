import { Controller, Get, Param, Res, StreamableFile } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';
import { cwd } from 'process';

@Controller('avatars')
export class AvatarController {
  constructor(private configService: ConfigService) {}

  @Get(':filename')
  async getAvatar(
    @Param('filename') filename: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    res.set({
      'Content-Type': 'image/jpeg',
      'Content-Disposition': `inline; filename="${filename}"`,
    });

    const avatarLocation = join(
      cwd(),
      this.configService.getOrThrow<string>('AVATARS_FOLDER'),
      filename,
    );

    const file = createReadStream(avatarLocation);

    file.pipe(res);
  }
}
