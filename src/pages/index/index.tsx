import { View, Text } from '@tarojs/components'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import FlowerMeme from '@/components/flower-meme'
import Taro from '@tarojs/taro'
import { Network } from '@/network'
import '@/components/garden/garden.css'

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

export default function Index() {
  const [memes, setMemes] = useState<Meme[]>([])
  const [loading, setLoading] = useState(false)

  const loadMemes = async () => {
    try {
      setLoading(true)
      const res = await Network.request({
        url: '/api/memes',
        method: 'GET',
        data: { order: 'created_at', limit: 20 }
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

  const handleFlowerClick = (memeId: string) => {
    Taro.navigateTo({
      url: `/pages/detail/index?id=${memeId}`
    })
  }

  // 页面加载时获取数据
  Taro.useDidShow(() => {
    loadMemes()
  })

  return (
    <View className="garden-container">
      {/* 太阳 */}
      <View className="sun" />

      {/* 云朵 */}
      <View className="cloud cloud-1" />
      <View className="cloud cloud-2" />

      {/* 底部草地 */}
      <View className="grass" />

      {/* 标题 */}
      <View className="garden-title">
        <Text className="garden-title-text">🌸 我的花园 🌸</Text>
      </View>

      {/* 花朵网格 */}
      {loading ? (
        <View className="garden-loading">
          <Text className="garden-loading-text">正在种植花朵...</Text>
        </View>
      ) : memes.length === 0 ? (
        <View className="garden-empty">
          <Text className="garden-empty-text">
            花园还没有花朵呢{'\n'}
            快去种植你的第一朵梗花吧！
          </Text>
          <Button
            className="bg-white text-orange-500 mt-6"
            onClick={() => Taro.switchTab({ url: '/pages/publish/index' })}
          >
            种植花朵
          </Button>
        </View>
      ) : (
        <View className="flowers-grid">
          {memes.map((meme, index) => (
            <FlowerMeme
              key={meme.id}
              meme={meme}
              index={index}
              onClick={() => handleFlowerClick(meme.id)}
            />
          ))}
        </View>
      )}
    </View>
  )
}
