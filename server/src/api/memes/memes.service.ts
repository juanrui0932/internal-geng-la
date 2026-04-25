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
      .select('*')
      .order(order, { ascending: false })
      .limit(limit);

    if (error) throw new Error(`获取梗列表失败: ${error.message}`);
    return data;
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
  async generateImages(content: string, explanation?: string) {
    console.log('AI生成两张图片，content:', content, 'explanation:', explanation);

    // 生成梗名称图片
    const contentPrompt = `结合"${content}"这个梗的主题，设计一个诙谐幽默的表情包风格图片，夸张搞笑的卡通人物或动物表情，生动有趣的场景插画，充满喜剧效果的构图，色彩鲜艳明快，适合网络传播和社交分享，让人一看就忍不住笑出来`;

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

    const result = {
      content_image_url: contentSignedUrl,
      content_image_key: contentFileKey,
      explanation_image_url: null as string | null,
      explanation_image_key: null as string | null,
    };

    // 如果有梗解释，生成梗解释图片
    if (explanation && explanation.trim()) {
      const explanationPrompt = `结合"${explanation}"这个梗的解释，设计一个诙谐幽默的表情包风格图片，夸张搞笑的卡通人物或动物表情，生动有趣的场景插画，充满喜剧效果的构图，色彩鲜艳明快，适合网络传播和社交分享，让人一看就忍不住笑出来`;

      const explanationResponse = await this.imageClient.generate({
        prompt: explanationPrompt,
        size: '2K',
        watermark: false,
      });

      const explanationHelper = this.imageClient.getResponseHelper(explanationResponse);

      if (explanationHelper.success && explanationHelper.imageUrls && explanationHelper.imageUrls.length > 0) {
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

        result.explanation_image_url = explanationSignedUrl;
        result.explanation_image_key = explanationFileKey;
      }
    }

    return result;
  }

  // 创建梗
  async createMeme(data: {
    content: string;
    content_image_url: string;
    content_image_key: string;
    explanation?: string;
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
