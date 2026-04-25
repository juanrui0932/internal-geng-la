import { View, Image } from '@tarojs/components'
import './flower-meme.css'

interface FlowerMemeProps {
  meme: any
  onClick?: () => void
  index?: number
}

export default function FlowerMeme({ meme, onClick, index = 0 }: FlowerMemeProps) {
  // 随机花盆颜色
  const potColors = ['#FF6B6B', '#Feca57', '#48dbfb', '#ff9ff3', '#54a0ff', '#00d2d3', '#5f27cd']
  const potColor = potColors[index % potColors.length]

  return (
    <View className="flower-container" onClick={onClick}>
      {/* 花盆 */}
      <View className="pot" style={{ backgroundColor: potColor }}>
        {/* 花盆边缘 */}
        <View className="pot-rim" style={{ backgroundColor: potColor }} />
        {/* 花盆口 */}
        <View className="pot-opening" style={{ backgroundColor: `${potColor}99` }} />
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
                backgroundColor: potColors[(index + i) % potColors.length],
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
    </View>
  )
}
