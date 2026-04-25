import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './empty-pot.css'

interface EmptyPotProps {
  index?: number
}

export default function EmptyPot({ index = 0 }: EmptyPotProps) {
  // 随机花盆颜色（更鲜艳显眼的色调）
  const potColors = [
    { main: '#FF3366', light: '#FF6B8A' }, // 鲜红
    { main: '#FFD700', light: '#FFE44D' }, // 金黄
    { main: '#00BFFF', light: '#33D9FF' }, // 亮蓝
    { main: '#FF00FF', light: '#FF66FF' }, // 洋红
    { main: '#00FF7F', light: '#4DFFA3' }, // 鲜绿
    { main: '#FF6600', light: '#FF9933' }, // 橙色
    { main: '#9400D3', light: '#C833FF' }, // 紫色
    { main: '#FF1493', light: '#FF5CB8' }, // 深粉
  ]
  const potColor = potColors[index % potColors.length]

  const handlePublish = () => {
    Taro.switchTab({
      url: '/pages/publish/index'
    })
  }

  return (
    <View
      className="empty-pot-container"
      style={{ '--pot-color': potColor.main, '--pot-color-light': potColor.light } as React.CSSProperties}
      onClick={handlePublish}
    >
      {/* 提示文字 */}
      <View className="empty-pot-text">点击种植</View>

      {/* 花盆 */}
      <View className="pot">
        {/* 花盆边缘 */}
        <View className="pot-rim" />
        {/* 花盆口 */}
        <View className="pot-opening" />
      </View>
    </View>
  )
}
