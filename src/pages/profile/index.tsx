import { View, Text } from '@tarojs/components'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { Settings, CircleQuestionMark, LogOut } from 'lucide-react-taro'
import Taro from '@tarojs/taro'
import './index.css'

export default function Profile() {
  const handleLogout = () => {
    Taro.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '已退出登录', icon: 'success' })
        }
      }
    })
  }

  const handleSetting = () => {
    Taro.showToast({ title: '功能开发中', icon: 'none' })
  }

  const handleHelp = () => {
    Taro.showToast({ title: '功能开发中', icon: 'none' })
  }

  return (
    <View className="min-h-screen bg-gray-50">
      {/* 头部信息 */}
      <View className="bg-white p-6 mb-4">
        <View className="flex items-center">
          <Avatar className="w-16 h-16 bg-orange-500">
            <Text className="block text-2xl font-bold text-white">内</Text>
          </Avatar>
          <View className="ml-4">
            <Text className="block text-xl font-bold text-gray-900">梗王</Text>
            <Text className="block text-sm text-gray-500 mt-1">搞笑社区达人</Text>
          </View>
        </View>
      </View>

      {/* 功能列表 */}
      <Card className="mx-4 mb-4">
        <CardContent className="p-0">
          <View
            className="flex items-center justify-between p-4 border-b border-gray-100"
            onClick={handleSetting}
          >
            <View className="flex items-center">
              <Settings size={20} color="#6b7280" />
              <Text className="block text-base text-gray-700 ml-3">设置</Text>
            </View>
          </View>
          <View
            className="flex items-center justify-between p-4"
            onClick={handleHelp}
          >
            <View className="flex items-center">
              <CircleQuestionMark size={20} color="#6b7280" />
              <Text className="block text-base text-gray-700 ml-3">帮助与反馈</Text>
            </View>
          </View>
        </CardContent>
      </Card>

      {/* 退出登录 */}
      <View className="mx-4">
        <Button
          className="w-full bg-white text-red-500 border border-red-200"
          onClick={handleLogout}
        >
          <View className="flex items-center justify-center gap-2">
            <LogOut size={18} color="#ef4444" />
            <Text className="block">退出登录</Text>
          </View>
        </Button>
      </View>

      {/* 底部信息 */}
      <View className="text-center mt-8 pb-8">
        <Text className="block text-xs text-gray-400">内部梗啦！ - 让笑声传递</Text>
      </View>
    </View>
  )
}
