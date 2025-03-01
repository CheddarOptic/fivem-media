import { Controller, Get, Post, Param, Delete, UseInterceptors, UploadedFile, Res, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { MediaService } from './media.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { ConfigService } from '@nestjs/config';

interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}

@Controller('api/media')
export class MediaController {
  constructor(
    private readonly mediaService: MediaService,
    private readonly configService: ConfigService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {    
    limits: {
        fileSize: 200 * 1024 * 1024, // 200MB
    },
    }))
  async uploadFile(@UploadedFile() file: MulterFile, @Res() res: Response) {
    if (!file) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'No file uploaded',
        success: false
      });
    }

    let type = 'unknown';
    if (file.mimetype.startsWith('image/')) {
      type = 'image';
    } else if (file.mimetype.startsWith('video/')) {
      type = 'video';
    } else if (file.mimetype.startsWith('audio/')) {
      type = 'audio';
    }

    const createMediaDto: CreateMediaDto = {
      originalname: file.originalname,
      filename: file.filename,
      path: `media/${file.filename}`,
      mimetype: file.mimetype,
      size: file.size,
      type,
    };

    const media = await this.mediaService.create(createMediaDto);
    const baseUrl = this.configService.get('BASE_URL');
    
    return res.status(HttpStatus.CREATED).json({
      message: 'File uploaded successfully',
      media: {
        ...media,
        url: `${baseUrl}/media/${file.filename}`,
        directLink: `${baseUrl}/api/media/${media.id}`,
        success: true
      },
    });
  }

  @Get()
  async findAll(@Res() res: Response) {
    const media = await this.mediaService.findAll();
    const baseUrl = this.configService.get('BASE_URL');
    
    const mediaWithUrls = media.map(item => ({
      ...item,
      url: `${baseUrl}/media/${item.filename}`,
      directLink: `${baseUrl}/api/media/${item.id}`,
    }));
    
    return res.status(HttpStatus.OK).json(mediaWithUrls);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const media = await this.mediaService.incrementViews(id);
      
      return res.redirect(`/media/${media.filename}`);
    } catch (error) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: error.message,
      });
    }
  }

  @Get('info/:id')
  async getInfo(@Param('id') id: string, @Res() res: Response) {
    try {
      const media = await this.mediaService.findOne(id);
      const baseUrl = this.configService.get('BASE_URL');
      
      return res.status(HttpStatus.OK).json({
        ...media,
        url: `${baseUrl}/media/${media.filename}`,
        directLink: `${baseUrl}/api/media/${media.id}`,
      });
    } catch (error) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: error.message,
      });
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      await this.mediaService.remove(id);
      
      return res.status(HttpStatus.OK).json({
        message: 'Media deleted successfully',
      });
    } catch (error) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: error.message,
      });
    }
  }
}