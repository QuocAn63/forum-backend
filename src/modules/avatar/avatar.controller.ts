import { Controller, Get, NotFoundException, Param, Res, StreamableFile } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { extname, join } from 'path';

@Controller('avatars')
export class AvatarController {
  constructor(private configService: ConfigService) {
  
  }

  @Get(':filename')
  async getAvatar(
    @Param('filename') filename: string,
    @Res() res: Response,
  ){
    try {
      const ext = extname(filename).replace(".", "")
      const fileDir = join(process.cwd(), this.configService.getOrThrow("AVATARS_FOLDER"), filename)
      
      return res.sendFile(fileDir, {headers: {'Content-Type': `image/${ext}`}})
    } catch (err) {
      throw new NotFoundException("Image not found.")
    }
  }
}
