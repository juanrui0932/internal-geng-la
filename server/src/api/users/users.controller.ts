import { Controller, Get, Post, Body, Param, HttpCode, ConflictException } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 创建用户
  @Post()
  @HttpCode(200)
  async createUser(@Body() body: { nickname: string }) {
    console.log('收到创建用户请求:', body.nickname);

    try {
      const user = await this.usersService.createUser(body);
      return {
        code: 200,
        msg: 'success',
        data: user,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        return {
          code: 400,
          msg: error.message,
          data: null,
        };
      }
      throw error;
    }
  }

  // 获取用户信息
  @Get(':id')
  @HttpCode(200)
  async getUser(@Param('id') id: string) {
    const user = await this.usersService.getUser(id);
    return {
      code: 200,
      msg: 'success',
      data: user,
    };
  }

  // 获取用户发布的梗
  @Get(':id/memes')
  @HttpCode(200)
  async getUserMemes(@Param('id') id: string) {
    const memes = await this.usersService.getUserMemes(id);
    return {
      code: 200,
      msg: 'success',
      data: memes,
    };
  }
}
