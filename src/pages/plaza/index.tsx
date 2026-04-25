import { View, Text, Image } from '@tarojs/components'
import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Heart, MessageCircle } from 'lucide-react-taro'
import Taro from '@tarojs/taro'
import { Network } from '@/network'
import './index.css'

interface Meme {
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

export default function Plaza() {
  const [memes, setMemes] = useState<Meme[]>([])
  const [loading, setLoading] = useState(false)

  const loadMemes = async () => {
    try {
      setLoading(true)
      const res = await Network.request({
        url: '/api/memes',
        method: 'GET',
        data: { order: 'like_count', limit: 30 }
      })
      console.log('获取梗列表响应:', res.data)
      if (res.data && res.data.data) {
        setMemes(res.data.data)
      } else {
        setMemes([])
      }
    } catch (error) {
      console.error('获取梗列表失败:', error)
      Taro.showToast({ title: '加载失败', icon: 'none' })
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (memeId: string) => {
    try {
      await Network.request({
        url: `/api/memes/${memeId}/like`,
        method: 'POST'
      })
      Taro.showToast({ title: '点赞成功', icon: 'success' })
      loadMemes()
    } catch (error) {
      console.error('点赞失败:', error)
      Taro.showToast({ title: '点赞失败', icon: 'none' })
    }
  }

  const handleCardClick = (memeId: string) => {
    Taro.navigateTo({
      url: `/pages/detail/index?id=${memeId}`
    })
  }

  Taro.useDidShow(() => {
    loadMemes()
  })

  return (
    <View className="min-h-screen bg-gray-50">
      {/* 头部标题 */}
      <View className="bg-white px-4 py-4 border-b border-gray-200">
        <Text className="block text-2xl font-bold text-gray-900">梗广场</Text>
        <Text className="block text-sm text-gray-500 mt-1">发现热门好梗</Text>
      </View>

      <View className="p-4">
        {loading ? (
          <View className="text-center py-8">
            <Text className="block text-gray-500">加载中...</Text>
          </View>
        ) : memes.length === 0 ? (
          <View className="flex flex-col items-center justify-center py-16">
            <Text className="block text-gray-500 mb-4">暂无梗内容</Text>
            <Text className="block text-sm text-gray-400">快来发布第一个梗吧</Text>
          </View>
        ) : (
          memes.map((meme) => (
            <Card key={meme.id} className="mb-4" onClick={() => handleCardClick(meme.id)}>
              <CardContent className="p-4">
                <Image
                  src={meme.image_url}
                  mode="widthFix"
                  className="w-full rounded-lg mb-3"
                  lazyLoad
                />

                <View className="mb-3">
                  <View className="flex items-center mb-2">
                    {meme.user_nickname && (
                      <View className="flex items-center mr-3">
                        <Avatar className="w-6 h-6 bg-orange-100">
                          <Text className="block text-xs font-bold text-orange-600">
                            {meme.user_nickname.charAt(0)}
                          </Text>
                        </Avatar>
                        <Text className="block text-xs text-gray-500 ml-2">
                          {meme.user_nickname}
                        </Text>
                      </View>
                    )}
                    {meme.is_ai_generated && (
                      <Badge className="bg-blue-100 text-blue-600">
                        <Text className="block text-xs">AI生成</Text>
                      </Badge>
                    )}
                  </View>
                  <Text className="block text-lg font-semibold text-gray-900 mb-2">
                    {meme.content}
                  </Text>
                  {meme.explanation && (
                    <Text className="block text-sm text-gray-600">
                      {meme.explanation}
                    </Text>
                  )}
                </View>

                <View className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <View className="flex items-center gap-4">
                    <View
                      className="flex items-center gap-1"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleLike(meme.id)
                      }}
                    >
                      <Heart size={16} color="#ef4444" className="mr-1" />
                      <Text className="block text-sm text-gray-600">{meme.like_count}</Text>
                    </View>
                    <View className="flex items-center gap-1">
                      <MessageCircle size={16} color="#6b7280" />
                      <Text className="block text-sm text-gray-600">{meme.comment_count}</Text>
                    </View>
                  </View>
                </View>
              </CardContent>
            </Card>
          ))
        )}
      </View>
    </View>
  )
}
