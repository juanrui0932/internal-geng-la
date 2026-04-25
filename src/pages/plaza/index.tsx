import { View, Text } from '@tarojs/components'
import { useState } from 'react'
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
      console.log('获取热门梗列表响应:', res.data)
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
        <Text className="garden-title-text">🌺 热门花园 🌺</Text>
      </View>

      {/* 花朵网格 */}
      {loading ? (
        <View className="garden-loading">
          <Text className="garden-loading-text">正在采摘花朵...</Text>
        </View>
      ) : memes.length === 0 ? (
        <View className="garden-empty">
          <Text className="garden-empty-text">
            热门花园还没有花朵{'\n'}
            快来发布你的梗花吧！
          </Text>
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
