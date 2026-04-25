import { View, Text, Image } from '@tarojs/components'
import './flower-meme.css'

interface FlowerMemeProps {
  meme: any
  onClick?: () => void
  index?: number
}

export default function FlowerMeme({ meme, onClick, index = 0 }: FlowerMemeProps) {
  // 随机花盆颜色（更柔和的可爱色调）
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
