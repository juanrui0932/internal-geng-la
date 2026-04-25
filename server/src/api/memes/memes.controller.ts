import { Controller, Get, Post, Body, Param, UploadedFile, UseInterceptors, Query, HttpCode } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MemesService } from './memes.service';

interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

@Controller('memes')
export class MemesController {
  constructor(private readonly memesService: MemesService) {}

  // 获取梗列表
  @Get()
  @HttpCode(200)
  async getMemes(@Query('order') order: string = 'created_at', @Query('limit') limit: number = 20) {
    const memes = await this.memesService.getMemes(order, limit);
    return {
      code: 200,
      msg: 'success',
      data: memes,
    };
  }

  // 上传图片
  @Post('upload')
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: UploadedFile) {
    console.log('收到图片上传请求:', file?.originalname);

    if (!file) {
      throw new Error('未上传文件');
    }

    const result = await this.memesService.uploadImage(file);
    return {
      code: 200,
      msg: 'success',
      data: result,
    };
  }

  // AI 生成图片
  @Post('generate-image')
  @HttpCode(200)
  async generateImage(@Body() body: { prompt: string }) {
    console.log('收到AI生成图片请求，prompt:', body.prompt);

    const result = await this.memesService.generateImage(body.prompt);
    return {
      code: 200,
      msg: 'success',
      data: result,
    };
  }

  // 创建梗
  @Post()
  @HttpCode(200)
  async createMeme(@Body() body: {
    content: string;
    image_url: string;
    image_key: string;
    explanation?: string;
    is_ai_generated: boolean;
  }) {
    console.log('收到创建梗请求:', body);

    const meme = await this.memesService.createMeme(body);
    return {
      code: 200,
      msg: 'success',
      data: meme,
    };
  }

  // 点赞
  @Post(':id/like')
  @HttpCode(200)
  async likeMeme(@Param('id') id: string) {
    console.log('收到点赞请求:', id);

    const meme = await this.memesService.likeMeme(id);
    return {
      code: 200,
      msg: 'success',
      data: meme,
    };
  }
}
