import { View, Text, Image } from '@tarojs/components'
import './flower-meme.css'

interface FlowerMemeProps {
  meme: any
  onClick?: () => void
  index?: number
}

export default function FlowerMeme({ meme, onClick, index = 0 }: FlowerMemeProps) {
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

  return (
    <View className="flower-container" style={{ '--pot-color': potColor.main, '--pot-color-light': potColor.light } as React.CSSProperties} onClick={onClick}>
      {/* 花盆 */}
      <View className="pot">
        {/* 花盆边缘 */}
        <View className="pot-rim" />
        {/* 花盆口 */}
        <View className="pot-opening" />
      </View>

      {/* 花茎 */}
      <View className="stem">
        {/* 叶子 - 左 */}
        <View className="leaf leaf-left" />
        {/* 叶子 - 右 */}
        <View className="leaf leaf-right" />
      </View>

      {/* 花头（梗图） */}
      <View className="flower-head">
        {/* 外层花瓣装饰 */}
        <View className="petals-outer">
          {[...Array(8)].map((_, i) => (
            <View
              key={i}
              className="petal"
              style={{
                transform: `rotate(${i * 45}deg)`,
                backgroundColor: potColors[(index + i) % potColors.length].main,
              }}
            />
          ))}
        </View>

        {/* 梗图花心 */}
        <View className="flower-center">
          <Image
            src={meme.image_url}
            mode="aspectFill"
            className="meme-image"
          />
        </View>
      </View>

      {/* 梗名字 */}
      <View className="meme-name">
        <Text className="meme-name-text">{meme.content}</Text>
      </View>
    </View>
  )
}
