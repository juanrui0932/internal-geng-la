import { View, Text, Image } from '@tarojs/components'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Upload, Sparkles, X } from 'lucide-react-taro'
import Taro from '@tarojs/taro'
import { Network } from '@/network'
import './index.css'

export default function Publish() {
  const [content, setContent] = useState('')
  const [explanation, setExplanation] = useState('')
  const [contentImageUrl, setContentImageUrl] = useState('') // 梗名称图片
  const [contentImageFile, setContentImageFile] = useState<string>('')
  const [explanationImageUrl, setExplanationImageUrl] = useState('') // 梗解释图片
  const [explanationImageFile, setExplanationImageFile] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const handleChooseContentImage = async () => {
    try {
      const res = await Taro.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera']
      })
      const tempFilePath = res.tempFilePaths[0]
      setContentImageFile(tempFilePath)
      setContentImageUrl(tempFilePath)
    } catch (error) {
      console.error('选择梗名称图片失败:', error)
    }
  }

  const handleChooseExplanationImage = async () => {
    try {
      const res = await Taro.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera']
      })
      const tempFilePath = res.tempFilePaths[0]
      setExplanationImageFile(tempFilePath)
      setExplanationImageUrl(tempFilePath)
    } catch (error) {
      console.error('选择梗解释图片失败:', error)
    }
  }

  const handleRemoveContentImage = () => {
    setContentImageUrl('')
    setContentImageFile('')
  }

  const handleRemoveExplanationImage = () => {
    setExplanationImageUrl('')
    setExplanationImageFile('')
  }

  const handleGenerateImages = async () => {
    if (!content) {
      Taro.showToast({ title: '请先输入梗内容', icon: 'none' })
      return
    }

    try {
      setIsGenerating(true)
      const res = await Network.request({
        url: '/api/memes/generate-images',
        method: 'POST',
        data: {
          content,
          explanation: explanation || undefined
        }
      })
      console.log('AI生成图片响应:', res.data)
      if (res.data && res.data.data) {
        const data = res.data.data
        if (data.content_image_url) {
          setContentImageUrl(data.content_image_url)
          setContentImageFile('')
        }
        if (data.explanation_image_url) {
          setExplanationImageUrl(data.explanation_image_url)
          setExplanationImageFile('')
        }
        Taro.showToast({ title: '生成成功', icon: 'success' })
      } else {
        Taro.showToast({ title: '生成失败', icon: 'none' })
      }
    } catch (error) {
      console.error('AI生成图片失败:', error)
      Taro.showToast({ title: '生成失败，请重试', icon: 'none' })
    } finally {
      setIsGenerating(false)
    }
  }

  const handlePublish = async () => {
    if (!content) {
      Taro.showToast({ title: '请输入梗内容', icon: 'none' })
      return
    }

    if (!contentImageUrl) {
      Taro.showToast({ title: '请上传梗名称图片或AI生成', icon: 'none' })
      return
    }

    // 获取用户信息
    const userInfo = Taro.getStorageSync('userInfo')
    if (!userInfo || !userInfo.id) {
      Taro.showToast({ title: '请先设置昵称', icon: 'none' })
      return
    }

    try {
      setIsUploading(true)

      // 上传梗名称图片（如果是本地图片）
      let finalContentImageUrl = contentImageUrl
      let finalContentImageKey = ''
      if (contentImageFile) {
        const uploadRes = await Network.uploadFile({
          url: '/api/memes/upload',
          filePath: contentImageFile,
          name: 'file'
        })
        console.log('梗名称图片上传响应:', uploadRes)
        const uploadData = JSON.parse(uploadRes.data)
        if (uploadData.data) {
          finalContentImageUrl = uploadData.data.image_url
          finalContentImageKey = uploadData.data.image_key
        }
      }

      // 上传梗解释图片（如果是本地图片）
      let finalExplanationImageUrl = explanationImageUrl || null
      let finalExplanationImageKey = explanationImageFile ? '' : null
      if (explanationImageFile) {
        const uploadRes = await Network.uploadFile({
          url: '/api/memes/upload',
          filePath: explanationImageFile,
          name: 'file'
        })
        console.log('梗解释图片上传响应:', uploadRes)
        const uploadData = JSON.parse(uploadRes.data)
        if (uploadData.data) {
          finalExplanationImageUrl = uploadData.data.image_url
          finalExplanationImageKey = uploadData.data.image_key
        }
      }

      // 发布梗
      const res = await Network.request({
        url: '/api/memes',
        method: 'POST',
        data: {
          content,
          content_image_url: finalContentImageUrl,
          content_image_key: finalContentImageKey,
          explanation: explanation || undefined,
          explanation_image_url: finalExplanationImageUrl,
          explanation_image_key: finalExplanationImageKey,
          is_ai_generated: !contentImageFile && !explanationImageFile, // 没有上传本地图片说明是AI生成的
          user_id: userInfo.id,
          user_nickname: userInfo.nickname
        }
      })
      console.log('发布梗响应:', res.data)

      if (res.data && res.data.code === 200) {
        Taro.showToast({ title: '发布成功', icon: 'success' })
        // 清空表单
        setContent('')
        setExplanation('')
        setContentImageUrl('')
        setContentImageFile('')
        setExplanationImageUrl('')
        setExplanationImageFile('')
        // 跳转到首页
        setTimeout(() => {
          Taro.switchTab({ url: '/pages/index/index' })
        }, 1500)
      } else {
        Taro.showToast({ title: '发布失败', icon: 'none' })
      }
    } catch (error) {
      console.error('发布失败:', error)
      Taro.showToast({ title: '发布失败，请重试', icon: 'none' })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <View className="min-h-screen bg-gray-50 p-4">
      <View className="max-w-lg mx-auto">
        <Text className="block text-2xl font-bold text-gray-900 mb-6">发布梗</Text>

        {/* 梗内容输入 */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <Text className="block text-sm font-semibold text-gray-700 mb-3">
              梗内容（必填）
            </Text>
            <View className="bg-gray-50 rounded-xl px-4 py-3">
              <Textarea
                style={{ width: '100%', minHeight: '80px', backgroundColor: 'transparent' }}
                placeholder="输入好笑的梗..."
                value={content}
                onInput={(e) => setContent(e.detail.value)}
                maxlength={200}
              />
            </View>
          </CardContent>
        </Card>

        {/* 解释输入 */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <Text className="block text-sm font-semibold text-gray-700 mb-3">
              解释（可选）
            </Text>
            <View className="bg-gray-50 rounded-xl px-4 py-3">
              <Textarea
                style={{ width: '100%', minHeight: '60px', backgroundColor: 'transparent' }}
                placeholder="解释这个梗的含义..."
                value={explanation}
                onInput={(e) => setExplanation(e.detail.value)}
                maxlength={300}
              />
            </View>
          </CardContent>
        </Card>

        {/* 梗名称图片上传区域 */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <Text className="block text-sm font-semibold text-gray-700 mb-3">
              梗名称图片（必填，用于展示）
            </Text>

            {contentImageUrl ? (
              <View className="relative">
                <Image
                  src={contentImageUrl}
                  mode="widthFix"
                  className="w-full rounded-lg"
                />
                <View
                  className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1"
                  onClick={handleRemoveContentImage}
                >
                  <X size={16} color="white" />
                </View>
              </View>
            ) : (
              <View className="flex flex-col gap-3">
                <Button
                  className="flex items-center justify-center gap-2 bg-orange-500 text-white"
                  onClick={handleChooseContentImage}
                >
                  <Upload size={18} color="white" />
                  <Text className="block">上传梗名称图片</Text>
                </Button>
              </View>
            )}
          </CardContent>
        </Card>

        {/* 梗解释图片上传区域 */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <Text className="block text-sm font-semibold text-gray-700 mb-3">
              梗解释图片（可选，用于详情页）
            </Text>

            {explanationImageUrl ? (
              <View className="relative">
                <Image
                  src={explanationImageUrl}
                  mode="widthFix"
                  className="w-full rounded-lg"
                />
                <View
                  className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1"
                  onClick={handleRemoveExplanationImage}
                >
                  <X size={16} color="white" />
                </View>
              </View>
            ) : (
              <View className="flex flex-col gap-3">
                <Button
                  className="flex items-center justify-center gap-2 bg-orange-500 text-white"
                  onClick={handleChooseExplanationImage}
                >
                  <Upload size={18} color="white" />
                  <Text className="block">上传梗解释图片</Text>
                </Button>
                <View className="flex items-center">
                  <View className="flex-1 h-px bg-gray-300"></View>
                  <Text className="block px-2 text-sm text-gray-500">或</Text>
                  <View className="flex-1 h-px bg-gray-300"></View>
                </View>
                <Button
                  className="flex items-center justify-center gap-2 bg-blue-500 text-white"
                  onClick={handleGenerateImages}
                  disabled={isGenerating}
                >
                  <Sparkles size={18} color="white" />
                  <Text className="block">{isGenerating ? 'AI生成中...' : 'AI生成两张图片'}</Text>
                </Button>
              </View>
            )}
          </CardContent>
        </Card>

        {/* 发布按钮 */}
        <Button
          className="w-full bg-orange-500 text-white py-3"
          onClick={handlePublish}
          disabled={isUploading}
        >
          <Text className="block">{isUploading ? '发布中...' : '发布'}</Text>
        </Button>
      </View>
    </View>
  )
}
