import { Controller, Get, Post, Body, Param, Query, HttpCode } from '@nestjs/common';
import { CommentsService } from './comments.service';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  // 获取评论列表
  @Get()
  @HttpCode(200)
  async getComments(@Query('meme_id') memeId: string) {
    console.log('收到获取评论请求, memeId:', memeId);

    if (!memeId) {
      throw new Error('meme_id 参数必填');
    }

    const comments = await this.commentsService.getComments(memeId);
    return {
      code: 200,
      msg: 'success',
      data: comments,
    };
  }

  // 创建评论
  @Post()
  @HttpCode(200)
  async createComment(@Body() body: { meme_id: string; content: string }) {
    console.log('收到创建评论请求:', body);

    const comment = await this.commentsService.createComment(body);
    return {
      code: 200,
      msg: 'success',
      data: comment,
    };
  }
}
