import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './empty-pot.css'

interface EmptyPotProps {
  index?: number
}

export default function EmptyPot({ index = 0 }: EmptyPotProps) {
  // 随机花盆颜色
  const potColors = [
    { main: '#FFB6C1', light: '#FFC0CB' }, // 浅粉
    { main: '#FFD700', light: '#FFEC8B' }, // 金黄
    { main: '#87CEEB', light: '#B0E0E6' }, // 天蓝
    { main: '#DDA0DD', light: '#EE82EE' }, // 紫罗兰
    { main: '#98FB98', light: '#90EE90' }, // 嫩绿
    { main: '#FFA07A', light: '#FFB347' }, // 浅橙
    { main: '#E6E6FA', light: '#F0F8FF' }, // 淡紫
    { main: '#F0E68C', light: '#FFFFE0' }, // 卡其
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
