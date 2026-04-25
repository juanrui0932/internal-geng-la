import { View, Text } from '@tarojs/components'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Laugh } from 'lucide-react-taro'
import Taro from '@tarojs/taro'
import { Network } from '@/network'
import './index.css'

export default function Welcome() {
  const [nickname, setNickname] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 检查是否已有昵称，如果有则直接跳转
  useEffect(() => {
    const savedNickname = Taro.getStorageSync('nickname')
    const savedUserInfo = Taro.getStorageSync('userInfo')

    if (savedNickname && savedUserInfo) {
      // 已有昵称，直接跳转到首页
      Taro.switchTab({ url: '/pages/index/index' })
    }
  }, [])

  const handleStart = async () => {
    if (!nickname || nickname.trim().length < 2) {
      Taro.showToast({ title: '昵称至少2个字符', icon: 'none' })
      return
    }

    if (nickname.trim().length > 20) {
      Taro.showToast({ title: '昵称最多20个字符', icon: 'none' })
      return
    }

    try {
      setIsSubmitting(true)

      // 调用后端创建用户
      const res = await Network.request({
        url: '/api/users',
        method: 'POST',
        data: { nickname: nickname.trim() }
      })

      console.log('创建用户响应:', res.data)

      if (res.data && res.data.code === 200) {
        // 保存用户信息到本地
        Taro.setStorageSync('userInfo', res.data.data)
        // 单独保存昵称到本地，下次自动登录
        Taro.setStorageSync('nickname', nickname.trim())

        Taro.showToast({ title: '欢迎加入！', icon: 'success' })

        // 延迟跳转到首页
        setTimeout(() => {
          Taro.switchTab({ url: '/pages/index/index' })
        }, 1500)
      } else {
        Taro.showToast({ title: '设置失败，请重试', icon: 'none' })
      }
    } catch (error) {
      console.error('创建用户失败:', error)
      Taro.showToast({ title: '设置失败，请重试', icon: 'none' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <View className="min-h-screen bg-gradient-to-b from-orange-50 to-white p-4 flex flex-col items-center justify-center">
      <Card className="w-full max-w-sm bg-white bg-opacity-80 backdrop-blur-sm">
        <CardContent className="p-6 flex flex-col items-center">
          {/* Logo */}
          <View className="mb-6">
            <Laugh size={64} color="#f97316" />
          </View>

          {/* 标题 */}
          <Text className="block text-2xl font-bold text-gray-900 mb-2">
            玩内部梗啦！
          </Text>
          <Text className="block text-sm text-gray-500 mb-8">
            先取个昵称，开始分享快乐吧
          </Text>

          {/* 昵称输入 */}
          <View className="w-full mb-3">
            <Text className="block text-sm font-semibold text-gray-700 mb-2">
              昵称
            </Text>
            <View className="bg-gray-50 rounded-xl px-4 py-3">
              <Input
                className="w-full bg-transparent"
                placeholder="请输入你的昵称"
                value={nickname}
                onInput={(e) => setNickname(e.detail.value)}
                maxlength={20}
              />
            </View>
          </View>

          {/* 提示 */}
          <Text className="block text-xs text-gray-400 mb-6 text-left w-full">
            2-20个字符，建议使用好听又好记的名字
          </Text>

          {/* 按钮 */}
          <Button
            className="w-full bg-orange-500 text-white py-3"
            onClick={handleStart}
            disabled={isSubmitting}
          >
            <Text className="block">{isSubmitting ? '设置中...' : '开始玩梗'}</Text>
          </Button>
        </CardContent>
      </Card>

      {/* 底部装饰 */}
      <View className="mt-8">
        <Text className="block text-xs text-gray-400">让笑声传递，让快乐分享</Text>
      </View>
    </View>
  )
}
