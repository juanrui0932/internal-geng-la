import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { getSupabaseClient } from '@/storage/database/supabase-client';

@Injectable()
export class UsersService {
  private supabase = getSupabaseClient();

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

    // 创建新用户（不生成头像）
    const { data: user, error } = await this.supabase
      .from('users')
      .insert({
        nickname: data.nickname,
        avatar_url: null, // 不生成头像，为 null
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
