import { Injectable } from '@nestjs/common';
import { getSupabaseClient } from '@/storage/database/supabase-client';

@Injectable()
export class CommentsService {
  private supabase = getSupabaseClient();

  // 获取评论列表
  async getComments(memeId: string) {
    const { data, error } = await this.supabase
      .from('comments')
      .select('*')
      .eq('meme_id', memeId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`获取评论列表失败: ${error.message}`);
    return data;
  }

  // 创建评论
  async createComment(data: { meme_id: string; content: string }) {
    console.log('创建评论:', data);

    const { data: comment, error } = await this.supabase
      .from('comments')
      .insert(data)
      .select()
      .single();

    if (error) throw new Error(`创建评论失败: ${error.message}`);

    // 更新梗的评论数
    const { data: meme } = await this.supabase
      .from('memes')
      .select('comment_count')
      .eq('id', data.meme_id)
      .single();

    const newCount = (meme?.comment_count || 0) + 1;

    await this.supabase
      .from('memes')
      .update({ comment_count: newCount })
      .eq('id', data.meme_id);

    return comment;
  }
}
