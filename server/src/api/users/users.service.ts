import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { getSupabaseClient } from '@/storage/database/supabase-client';

@Injectable()
export class UsersService {
  private supabase = getSupabaseClient();

  // 创建用户
  async createUser(data: { nickname: string }) {
    console.log('创建用户:', data);

    // 检查昵称是否已存在
    const { data: existing } = await this.supabase
      .from('users')
      .select('id')
      .eq('nickname', data.nickname)
      .single();

    if (existing) {
      throw new ConflictException('昵称已存在');
    }

    const { data: user, error } = await this.supabase
      .from('users')
      .insert(data)
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
