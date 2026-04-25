import { View, Text, Image, ScrollView } from '@tarojs/components'
import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Heart, MessageCircle, ArrowLeft, Send } from 'lucide-react-taro'
import Taro from '@tarojs/taro'
import { Network } from '@/network'
import './index.css'

interface MemeDetail {
  id: string
  content: string
  image_url: string
  explanation?: string
  like_count: number
  comment_count: number
  is_ai_generated: boolean
  user_nickname?: string
  created_at: string
}

interface Comment {
  id: string
  meme_id: string
  user_nickname?: string
  content: string
  created_at: string
}

export default function Detail() {
  const [meme, setMeme] = useState<MemeDetail | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [commentText, setCommentText] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // 获取路由参数
  const router = Taro.useRouter()
  const memeId = router.params.id

  const loadMemeDetail = async () => {
    if (!memeId) return

    try {
      setLoading(true)
      const res = await Network.request({
        url: '/api/memes',
        method: 'GET',
        data: { order: 'created_at', limit: 100 }
      })

      if (res.data && res.data.data) {
        const found = res.data.data.find((m: MemeDetail) => m.id === memeId)
        if (found) {
          setMeme(found)
          loadComments(memeId)
        }
      }
    } catch (error) {
      console.error('获取梗详情失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadComments = async (id: string) => {
    try {
      const res = await Network.request({
        url: '/api/comments',
        method: 'GET',
        data: { meme_id: id }
      })

      if (res.data && res.data.data) {
        setComments(res.data.data)
      }
    } catch (error) {
      console.error('获取评论失败:', error)
    }
  }

  const handleLike = async () => {
    if (!meme) return

    try {
      await Network.request({
        url: `/api/memes/${meme.id}/like`,
        method: 'POST'
      })
      Taro.showToast({ title: '点赞成功', icon: 'success' })
      loadMemeDetail()
    } catch (error) {
      console.error('点赞失败:', error)
      Taro.showToast({ title: '点赞失败', icon: 'none' })
    }
  }

  const handleSubmitComment = async () => {
    if (!commentText.trim()) {
      Taro.showToast({ title: '请输入留言内容', icon: 'none' })
      return
    }

    if (!meme) return

    // 获取用户信息
    const userInfo = Taro.getStorageSync('userInfo')
    if (!userInfo || !userInfo.id) {
      Taro.showToast({ title: '请先设置昵称', icon: 'none' })
      return
    }

    try {
      setSubmitting(true)

      const res = await Network.request({
        url: '/api/comments',
        method: 'POST',
        data: {
          meme_id: meme.id,
          user_id: userInfo.id,
          user_nickname: userInfo.nickname,
          content: commentText.trim()
        }
      })

      if (res.data && res.data.code === 200) {
        Taro.showToast({ title: '留言成功', icon: 'success' })
        setCommentText('')
        loadComments(meme.id)
        loadMemeDetail() // 更新评论数
      } else {
        Taro.showToast({ title: '留言失败', icon: 'none' })
      }
    } catch (error) {
      console.error('留言失败:', error)
      Taro.showToast({ title: '留言失败', icon: 'none' })
    } finally {
      setSubmitting(false)
    }
  }

  const formatTime = (timeStr: string) => {
    const date = new Date(timeStr)
    const now = new Date()
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diff < 60) return '刚刚'
    if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`
    if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`
    if (diff < 604800) return `${Math.floor(diff / 86400)}天前`

    return `${date.getMonth() + 1}-${date.getDate()}`
  }

  Taro.useDidShow(() => {
    loadMemeDetail()
  })

  if (loading) {
    return (
      <View className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Text className="block text-gray-500">加载中...</Text>
      </View>
    )
  }

  if (!meme) {
    return (
      <View className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Text className="block text-gray-500">梗不存在</Text>
      </View>
    )
  }

  return (
    <View className="min-h-screen bg-gray-50 pb-20">
      {/* 顶部导航栏 */}
      <View className="bg-white px-4 py-3 border-b border-gray-200 flex items-center">
        <View
          className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100"
          onClick={() => Taro.navigateBack()}
        >
          <ArrowLeft size={18} color="#374151" />
        </View>
        <Text className="block text-base font-semibold text-gray-900 ml-3 flex-1">梗详情</Text>
      </View>

      <ScrollView scrollY className="flex-1">
        {/* 梗图片 */}
        <View className="bg-white p-4 mb-3">
          <Image
            src={meme.image_url}
            mode="widthFix"
            className="w-full rounded-xl"
          />
        </View>

        {/* 梗解释（放在图片下面，放大加粗，有趣的字体效果） */}
        {meme.explanation && (
          <View className="bg-white px-4 py-4 mb-3 text-center">
            <Text
              className="block text-5xl font-black leading-relaxed"
              style={{
                animation: 'bounce 1.2s ease-in-out infinite, gradient 3s ease infinite',
                backgroundImage: 'linear-gradient(135deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3, #54a0ff, #00d2d3, #5f27cd)',
                backgroundSize: '500% 500%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                color: 'transparent',
                textShadow: `
                  2px 2px 0px rgba(0,0,0,0.1),
                  4px 4px 0px rgba(0,0,0,0.1),
                  6px 6px 0px rgba(0,0,0,0.1)
                `,
                letterSpacing: '0.05em',
                fontWeight: '900',
              }}
            >
              {meme.explanation}
            </Text>
          </View>
        )}

        {/* 梗内容 */}
        <Card className="mx-4 mb-3">
          <CardContent className="p-4">
            <View className="flex items-center justify-between mb-3">
              <View className="flex items-center">
                {meme.user_nickname && (
                  <>
                    <Avatar className="w-8 h-8 bg-orange-100">
                      <Text className="block text-sm font-bold text-orange-600">
                        {meme.user_nickname.charAt(0)}
                      </Text>
                    </Avatar>
                    <Text className="block text-sm text-gray-600 ml-2">
                      {meme.user_nickname}
                    </Text>
                  </>
                )}
              </View>
              {meme.is_ai_generated && (
                <Badge className="bg-blue-100 text-blue-600">
                  <Text className="block text-xs">AI生成</Text>
                </Badge>
              )}
            </View>

            <Text className="block text-lg font-semibold text-gray-900 mb-3">
              {meme.content}
            </Text>

            <View className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100">
              <View
                className="flex items-center gap-2"
                onClick={handleLike}
              >
                <Heart size={20} color="#ef4444" />
                <Text className="block text-sm text-gray-600">{meme.like_count}</Text>
              </View>
              <View className="flex items-center gap-2">
                <MessageCircle size={20} color="#6b7280" />
                <Text className="block text-sm text-gray-600">{meme.comment_count}</Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* 留言列表 */}
        <Card className="mx-4 mb-4">
          <CardContent className="p-4">
            <Text className="block text-base font-semibold text-gray-900 mb-4">
              留言 ({comments.length})
            </Text>

            {comments.length === 0 ? (
              <View className="text-center py-8">
                <Text className="block text-sm text-gray-400">还没有留言，快来抢沙发吧~</Text>
              </View>
            ) : (
              comments.map((comment) => (
                <View key={comment.id} className="mb-4 last:mb-0">
                  <View className="flex items-start">
                    {comment.user_nickname && (
                      <Avatar className="w-8 h-8 bg-gray-100 flex-shrink-0">
                        <Text className="block text-sm font-bold text-gray-600">
                          {comment.user_nickname.charAt(0)}
                        </Text>
                      </Avatar>
                    )}
                    <View className="ml-3 flex-1">
                      <View className="flex items-center justify-between mb-1">
                        <Text className="block text-sm font-medium text-gray-900">
                          {comment.user_nickname || '匿名'}
                        </Text>
                        <Text className="block text-xs text-gray-400">
                          {formatTime(comment.created_at)}
                        </Text>
                      </View>
                      <Text className="block text-sm text-gray-700">
                        {comment.content}
                      </Text>
                    </View>
                  </View>
                </View>
              ))
            )}
          </CardContent>
        </Card>
      </ScrollView>

      {/* 留言输入框（固定底部） */}
      <View className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 z-50">
        <View className="flex items-center gap-3">
          <View className="flex-1 bg-gray-100 rounded-full px-4 py-2">
            <Input
              className="w-full bg-transparent text-sm"
              placeholder="说点什么..."
              value={commentText}
              onInput={(e) => setCommentText(e.detail.value)}
              maxlength={200}
            />
          </View>
          <Button
            size="sm"
            className="bg-orange-500 text-white rounded-full px-4"
            onClick={handleSubmitComment}
            disabled={submitting || !commentText.trim()}
          >
            <Send size={16} color="white" />
          </Button>
        </View>
      </View>
    </View>
  )
}
