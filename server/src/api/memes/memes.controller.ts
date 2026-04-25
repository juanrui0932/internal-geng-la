import { Controller, Get, Post, Delete, Body, Param, UploadedFile, UseInterceptors, Query, HttpCode } from '@nestjs/common';
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

  // AI 生成图片（生成两张：梗名称图片和梗解释图片）
  @Post('generate-images')
  @HttpCode(200)
  async generateImages(@Body() body: { content: string; explanation: string }) {
    console.log('收到AI生成图片请求，content:', body.content, 'explanation:', body.explanation);

    const result = await this.memesService.generateImages(body.content, body.explanation);
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
    content_image_url: string;
    content_image_key: string;
    explanation: string;
    explanation_image_url?: string | null;
    explanation_image_key?: string | null;
    is_ai_generated: boolean;
    user_id: string;
    user_nickname: string;
  }) {
    console.log('收到创建梗请求:', body);

    const meme = await this.memesService.createMeme(body);
    return {
      code: 200,
      msg: 'success',
      data: meme,
    };
  }

  // 删除梗
  @Delete(':id')
  @HttpCode(200)
  async deleteMeme(@Param('id') id: string, @Body() body: { user_id: string }) {
    console.log('收到删除梗请求:', id, '用户:', body.user_id);

    const result = await this.memesService.deleteMeme(id, body.user_id);
    return {
      code: 200,
      msg: 'success',
      data: result,
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
