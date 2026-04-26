import { View, Text } from '@tarojs/components'
import { useState, useEffect } from 'react'
import './welcome.css'

interface WelcomePageProps {
  onEnter: () => void
}

export default function WelcomePage({ onEnter }: WelcomePageProps) {
  const [showTitle, setShowTitle] = useState(false)
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    // 逐字显示标题
    setTimeout(() => setShowTitle(true), 300)
    // 显示按钮
    setTimeout(() => setShowButton(true), 2000)
  }, [])

  const titleText = '欢迎来到内部梗的世界！'

  return (
    <View className="welcome-container">
      {/* 粒子背景 */}
      <View className="particles">
        {Array.from({ length: 20 }).map((_, i) => (
          <View
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
            }}
          />
        ))}
      </View>

      {/* 花朵装饰 */}
      <Text className="flower-decoration top-left">🌸</Text>
      <Text className="flower-decoration top-right">🌺</Text>
      <Text className="flower-decoration bottom-left">🌼</Text>
      <Text className="flower-decoration bottom-right">🌻</Text>

      {/* 光圈效果 */}
      <View className="glow-circle" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />

      {/* 欢迎文字 */}
      <View className="welcome-text-container">
        {showTitle && (
          <View className="welcome-title">
            {titleText.split('').map((char, index) => (
              <Text
                key={index}
                className="welcome-char"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {char}
              </Text>
            ))}
          </View>
        )}

        {showButton && (
          <View className="start-button" onClick={onEnter}>
            <Text>开始探索</Text>
          </View>
        )}
      </View>
    </View>
  )
}
