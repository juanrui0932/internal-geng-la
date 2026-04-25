import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { S3Storage } from 'coze-coding-dev-sdk';
import { ImageGenerationClient, Config } from 'coze-coding-dev-sdk';
import { UsersService } from '../users/users.service';

interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

@Injectable()
export class MemesService {
  private storage: S3Storage;
  private imageClient: ImageGenerationClient;
  private supabase = getSupabaseClient();

  constructor(
    private configService: ConfigService,
    private usersService: UsersService
  ) {
    this.storage = new S3Storage({
      bucketName: this.configService.get('COZE_BUCKET_NAME'),
      region: 'cn-beijing',
    });

    const config = new Config();
    this.imageClient = new ImageGenerationClient(config);
  }

  // 获取梗列表
  async getMemes(order: string = 'created_at', limit: number = 20) {
    const { data, error } = await this.supabase
      .from('memes')
      .select(`
        *,
        users (
          avatar_url
        )
      `)
      .order(order, { ascending: false })
      .limit(limit);

    if (error) throw new Error(`获取梗列表失败: ${error.message}`);

    // 将 users.avatar_url 合并到 meme 对象中
    return data.map((meme: any) => ({
      ...meme,
      user_avatar_url: meme.users?.avatar_url || null,
    }));
  }

  // 上传图片到对象存储
  async uploadImage(file: UploadedFile) {
    console.log('上传图片到对象存储:', file.originalname, file.size);

    const fileKey = await this.storage.uploadFile({
      fileContent: file.buffer,
      fileName: `memes/${Date.now()}_${file.originalname}`,
      contentType: file.mimetype,
    });

    console.log('图片上传成功，fileKey:', fileKey);

    const imageUrl = await this.storage.generatePresignedUrl({
      key: fileKey,
      expireTime: 86400 * 30, // 30天有效期
    });

    return { image_url: imageUrl, image_key: fileKey };
  }

  // AI 生成图片（生成两张：梗名称图片和梗解释图片）
  async generateImages(content: string, explanation: string) {
    console.log('AI生成两张图片，content:', content, 'explanation:', explanation);

    const axios = require('axios');

    // 精简提示词
    const contentPrompt = `${content}，幽默搞笑卡通图`;
    const explanationPrompt = `${explanation}，幽默搞笑插画`;

    // 并行生成两张图片（使用720P分辨率，速度更快，成功率更高）
    const startTime = Date.now();
    console.log('开始并行生成两张图片...');

    try {
      const [contentResponse, explanationResponse] = await Promise.all([
        this.imageClient.generate({
          prompt: contentPrompt,
          size: '720P',  // 改为720P，速度更快
          watermark: false,
        }).catch(err => {
          console.error('生成梗名称图片失败:', err);
          return null;
        }),
        this.imageClient.generate({
          prompt: explanationPrompt,
          size: '720P',  // 改为720P，速度更快
          watermark: false,
        }).catch(err => {
          console.error('生成梗解释图片失败:', err);
          return null;
        }),
      ]);

      console.log('两张图片AI生成完成，耗时:', (Date.now() - startTime) / 1000, '秒');

      // 检查生成结果
      if (!contentResponse || !explanationResponse) {
        throw new Error('AI生成图片失败，请重试');
      }

      const contentHelper = this.imageClient.getResponseHelper(contentResponse);
      const explanationHelper = this.imageClient.getResponseHelper(explanationResponse);

      if (!contentHelper.success || !contentHelper.imageUrls || contentHelper.imageUrls.length === 0) {
        throw new Error(contentHelper.errorMessages?.join(', ') || 'AI生成梗名称图片失败');
      }

      if (!explanationHelper.success || !explanationHelper.imageUrls || explanationHelper.imageUrls.length === 0) {
        throw new Error(explanationHelper.errorMessages?.join(', ') || 'AI生成梗解释图片失败');
      }

      const contentImageUrl = contentHelper.imageUrls[0];
      const explanationImageUrl = explanationHelper.imageUrls[0];
      console.log('AI生成梗名称图片成功，imageUrl:', contentImageUrl);
      console.log('AI生成梗解释图片成功，imageUrl:', explanationImageUrl);

      // 并行下载两张图片
      console.log('开始并行下载两张图片...');
      const [contentImageBuffer, explanationImageBuffer] = await Promise.all([
        axios.get(contentImageUrl, { responseType: 'arraybuffer' }),
        axios.get(explanationImageUrl, { responseType: 'arraybuffer' }),
      ]);

      console.log('两张图片下载完成');

      // 并行上传两张图片到对象存储
      console.log('开始并行上传两张图片到对象存储...');
      const [contentFileKey, explanationFileKey] = await Promise.all([
        this.storage.uploadFile({
          fileContent: Buffer.from(contentImageBuffer.data),
          fileName: `memes/ai_content_${Date.now()}.png`,
          contentType: 'image/png',
        }),
        this.storage.uploadFile({
          fileContent: Buffer.from(explanationImageBuffer.data),
          fileName: `memes/ai_explanation_${Date.now()}.png`,
          contentType: 'image/png',
        }),
      ]);

      console.log('两张图片上传完成');

      // 并行生成签名URL
      const [contentSignedUrl, explanationSignedUrl] = await Promise.all([
        this.storage.generatePresignedUrl({
          key: contentFileKey,
          expireTime: 86400 * 30,
        }),
        this.storage.generatePresignedUrl({
          key: explanationFileKey,
          expireTime: 86400 * 30,
        }),
      ]);

      console.log('AI生成图片总耗时:', (Date.now() - startTime) / 1000, '秒');

      return {
        content_image_url: contentSignedUrl,
        content_image_key: contentFileKey,
        explanation_image_url: explanationSignedUrl,
        explanation_image_key: explanationFileKey,
      };
    } catch (error) {
      console.error('AI生成图片过程出错:', error);
      throw new Error(error.message || 'AI生成图片失败，请重试');
    }
  }

  // 创建梗
  async createMeme(data: {
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
    console.log('创建梗:', data);

    // 检查用户是否存在，如果不存在则创建
    const { data: user } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', data.user_id)
      .single();

    if (!user) {
      console.log('用户不存在，重新创建用户:', data.user_nickname);
      const newUser = await this.usersService.createUser({ nickname: data.user_nickname });
      // 更新 user_id 为新用户的 id
      data.user_id = newUser.id;
    }

    const { data: meme, error } = await this.supabase
      .from('memes')
      .insert({
        ...data,
        image_key: data.content_image_key, // 兼容字段
        image_url: data.content_image_url, // 兼容字段
      })
      .select()
      .single();

    if (error) throw new Error(`创建梗失败: ${error.message}`);
    return meme;
  }

  // 删除梗
  async deleteMeme(id: string, userId: string) {
    console.log('删除梗:', id, '用户:', userId);

    // 检查梗是否存在
    const { data: meme, error: fetchError } = await this.supabase
      .from('memes')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !meme) {
      throw new Error('梗不存在');
    }

    // 删除梗（所有用户都可以删除）
    const { error: deleteError } = await this.supabase
      .from('memes')
      .delete()
      .eq('id', id);

    if (deleteError) throw new Error(`删除梗失败: ${deleteError.message}`);
    return { message: '删除成功' };
  }

  // 点赞
  async likeMeme(id: string) {
    console.log('点赞梗:', id);

    // 先获取当前点赞数
    const { data: current } = await this.supabase
      .from('memes')
      .select('like_count')
      .eq('id', id)
      .single();

    const newCount = (current?.like_count || 0) + 1;

    const { data, error } = await this.supabase
      .from('memes')
      .update({ like_count: newCount })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`点赞失败: ${error.message}`);
    return data;
  }
}
