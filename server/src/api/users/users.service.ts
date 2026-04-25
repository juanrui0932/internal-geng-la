import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { S3Storage } from 'coze-coding-dev-sdk';
import { ImageGenerationClient, Config } from 'coze-coding-dev-sdk';

@Injectable()
export class UsersService {
  private storage: S3Storage;
  private imageClient: ImageGenerationClient;
  private supabase = getSupabaseClient();

  constructor(private configService: ConfigService) {
    this.storage = new S3Storage({
      bucketName: this.configService.get('COZE_BUCKET_NAME'),
      region: 'cn-beijing',
    });

    const config = new Config();
    this.imageClient = new ImageGenerationClient(config);
  }

  // 根据昵称生成梗图头像
  async generateAvatar(nickname: string) {
    console.log('根据昵称生成头像:', nickname);

    const prompt = `结合"${nickname}"这个昵称，设计一个诙谐幽默的头像，夸张搞笑的卡通人物表情，生动有趣的动漫风格，充满喜剧效果，色彩鲜艳明快，适合作为社交媒体头像，让人一看就觉得好笑和亲切`;

    const response = await this.imageClient.generate({
      prompt: prompt,
      size: '2K',
      watermark: false,
    });

    const helper = this.imageClient.getResponseHelper(response);

    if (!helper.success || !helper.imageUrls || helper.imageUrls.length === 0) {
      console.error('AI生成头像失败:', helper.errorMessages);
      return null; // 生成失败返回 null，不影响用户创建
    }

    const imageUrl = helper.imageUrls[0];
    console.log('AI生成头像成功，imageUrl:', imageUrl);

    // 将 AI 生成的头像上传到对象存储
    const axios = require('axios');
    const imageBuffer = await axios.get(imageUrl, { responseType: 'arraybuffer' });

    const fileKey = await this.storage.uploadFile({
      fileContent: Buffer.from(imageBuffer.data),
      fileName: `avatars/${Date.now()}_${nickname}.png`,
      contentType: 'image/png',
    });

    const signedUrl = await this.storage.generatePresignedUrl({
      key: fileKey,
      expireTime: 86400 * 365, // 1年有效期
    });

    return { avatar_url: signedUrl };
  }

  // 创建或登录用户
  async createUser(data: { nickname: string }) {
    console.log('创建/登录用户:', data);

    // 检查昵称是否已存在
    const { data: existing } = await this.supabase
      .from('users')
      .select('*')
      .eq('nickname', data.nickname)
      .single();

    if (existing) {
      // 昵称已存在，直接返回用户信息（登录）
      console.log('用户已存在，直接登录:', existing);
      return existing;
    }

    // 生成头像
    const avatarResult = await this.generateAvatar(data.nickname);

    // 创建新用户
    const { data: user, error } = await this.supabase
      .from('users')
      .insert({
        nickname: data.nickname,
        avatar_url: avatarResult?.avatar_url || null,
      })
      .select()
      .single();

    if (error) throw new Error(`创建用户失败: ${error.message}`);
    return user;
  }

  // 获取用户信息
  async getUser(id: string) {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error(`获取用户失败: ${error.message}`);
    if (!data) throw new NotFoundException('用户不存在');
    return data;
  }

  // 获取用户发布的梗
  async getUserMemes(userId: string) {
    const { data, error } = await this.supabase
      .from('memes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw new Error(`获取用户梗列表失败: ${error.message}`);
    return data;
  }
}
