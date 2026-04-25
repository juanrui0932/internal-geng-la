import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { S3Storage } from 'coze-coding-dev-sdk';
import { ImageGenerationClient, Config } from 'coze-coding-dev-sdk';

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

  constructor(private configService: ConfigService) {
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

    // 生成梗名称图片
    const contentPrompt = `设计一个"玩内部梗啦！"风格的梗图，主题是"${content}"。
画面要求：
1. 表情包风格：夸张搞笑的卡通人物表情，生动有趣
2. 构图充满喜剧效果，色彩鲜艳明快
3. 可以包含梗的文字或符号元素，增加识别度
4. 适合网络传播和社交分享
5. 让人一看就明白这个梗的含义，同时忍不住笑出来
6. 风格统一：扁平化插画，线条简洁，色彩饱和度高
7. 可以加入emoji、表情符号等现代网络元素`;

    const contentResponse = await this.imageClient.generate({
      prompt: contentPrompt,
      size: '2K',
      watermark: false,
    });

    const contentHelper = this.imageClient.getResponseHelper(contentResponse);

    if (!contentHelper.success || !contentHelper.imageUrls || contentHelper.imageUrls.length === 0) {
      throw new Error(contentHelper.errorMessages?.join(', ') || 'AI生成梗名称图片失败');
    }

    const contentImageUrl = contentHelper.imageUrls[0];
    console.log('AI生成梗名称图片成功，imageUrl:', contentImageUrl);

    // 将梗名称图片上传到对象存储
    const axios = require('axios');
    const contentImageBuffer = await axios.get(contentImageUrl, { responseType: 'arraybuffer' });

    const contentFileKey = await this.storage.uploadFile({
      fileContent: Buffer.from(contentImageBuffer.data),
      fileName: `memes/ai_content_${Date.now()}.png`,
      contentType: 'image/png',
    });

    const contentSignedUrl = await this.storage.generatePresignedUrl({
      key: contentFileKey,
      expireTime: 86400 * 30,
    });

    // 生成梗解释图片（必填）
    const explanationPrompt = `设计一个"玩内部梗啦！"风格的梗解释插画，主题是"${explanation}"。
画面要求：
1. 场景化插画：用具体场景来展现梗的含义和情境
2. 夸张搞笑的卡通人物或动物，表情生动有趣
3. 构图充满戏剧性和喜剧效果，色彩鲜艳明快
4. 通过画面讲好梗的故事，让观众理解梗的来龙去脉
5. 适合在详情页展示，与梗名称图片形成呼应
6. 风格统一：扁平化插画，线条简洁，色彩饱和度高
7. 可以加入文字气泡、对话框等元素，增强叙事性`;

    const explanationResponse = await this.imageClient.generate({
      prompt: explanationPrompt,
      size: '2K',
      watermark: false,
    });

    const explanationHelper = this.imageClient.getResponseHelper(explanationResponse);

    if (!explanationHelper.success || !explanationHelper.imageUrls || explanationHelper.imageUrls.length === 0) {
      throw new Error(explanationHelper.errorMessages?.join(', ') || 'AI生成梗解释图片失败');
    }

    const explanationImageUrl = explanationHelper.imageUrls[0];
    console.log('AI生成梗解释图片成功，imageUrl:', explanationImageUrl);

    const explanationImageBuffer = await axios.get(explanationImageUrl, { responseType: 'arraybuffer' });

    const explanationFileKey = await this.storage.uploadFile({
      fileContent: Buffer.from(explanationImageBuffer.data),
      fileName: `memes/ai_explanation_${Date.now()}.png`,
      contentType: 'image/png',
    });

    const explanationSignedUrl = await this.storage.generatePresignedUrl({
      key: explanationFileKey,
      expireTime: 86400 * 30,
    });

    return {
      content_image_url: contentSignedUrl,
      content_image_key: contentFileKey,
      explanation_image_url: explanationSignedUrl,
      explanation_image_key: explanationFileKey,
    };
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
