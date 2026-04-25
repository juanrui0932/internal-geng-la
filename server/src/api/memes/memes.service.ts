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

  // AI 生成图片
  async generateImage(prompt: string) {
    console.log('AI生成图片，prompt:', prompt);

    const response = await this.imageClient.generate({
      prompt: `"${prompt}" - 搞笑的梗图，有趣的表情包风格，适合社交分享`,
      size: '2K',
      watermark: false,
    });

    const helper = this.imageClient.getResponseHelper(response);

    if (!helper.success || !helper.imageUrls || helper.imageUrls.length === 0) {
      throw new Error(helper.errorMessages?.join(', ') || 'AI生成失败');
    }

    const imageUrl = helper.imageUrls[0];
    console.log('AI生成图片成功，imageUrl:', imageUrl);

    // 将 AI 生成的图片上传到对象存储
    const axios = require('axios');
    const imageBuffer = await axios.get(imageUrl, { responseType: 'arraybuffer' });

    const fileKey = await this.storage.uploadFile({
      fileContent: Buffer.from(imageBuffer.data),
      fileName: `memes/ai_${Date.now()}.png`,
      contentType: 'image/png',
    });

    const signedUrl = await this.storage.generatePresignedUrl({
      key: fileKey,
      expireTime: 86400 * 30,
    });

    return { image_url: signedUrl, image_key: fileKey };
  }

  // 创建梗
  async createMeme(data: {
    content: string;
    image_url: string;
    image_key: string;
    explanation?: string;
    is_ai_generated: boolean;
  }) {
    console.log('创建梗:', data);

    const { data: meme, error } = await this.supabase
      .from('memes')
      .insert(data)
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
