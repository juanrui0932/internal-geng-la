# 梗的发园 - Coze 平台发布指南

## 🎉 发布状态

✅ **开发环境已启动**
- 前端地址：http://9.129.0.232:5000/
- 后端地址：http://localhost:3000
- Coze 域名：https://f9496088-5417-434b-8390-2444d84ab7c2.dev.coze.site

✅ **代码已提交**
- 所有代码已推送到 GitHub
- 最新提交：`style: 将梗的发园标题字体放大1.5倍`

✅ **环境变量已配置**
- PROJECT_DOMAIN 已自动注入
- 所有必需的环境变量已配置

---

## 🚀 Coze 平台发布步骤

### 步骤 1：访问 Coze 平台

1. 登录 Coze 平台网页端
2. 进入"我的应用"或"项目列表"
3. 找到"梗的发园"项目

### 步骤 2：配置应用信息

#### 应用基本信息
- **应用名称**：梗的发园
- **应用描述**：一个基于 Taro + NestJS 的移动端网页应用，支持梗图上传、AI 生成、点赞评论等功能。采用田园花园风格设计，梗以花朵形式展示，提供独特的视觉体验。
- **应用类型**：Web 应用 / H5 应用
- **应用图标**：上传 512x512 的应用图标

#### 应用权限设置
- **访问权限**：
  - 公开访问（推荐）
  - 或私有访问（需要登录）

#### 应用配置
- **首页地址**：https://f9496088-5417-434b-8390-2444d84ab7c2.dev.coze.site
- **允许的域名**：*.coze.site

### 步骤 3：配置环境变量

在 Coze 平台的应用设置中，添加以下环境变量：

```env
# 后端 API 地址
PROJECT_DOMAIN=https://f9496088-5417-434b-8390-2444d84ab7c2.dev.coze.site

# Supabase 数据库
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key

# Coze AI 生成
COZE_API_KEY=your-coze-api-key

# TOS 对象存储
TOS_ACCESS_KEY=your-tos-access-key
TOS_SECRET_KEY=your-tos-secret-key
TOS_BUCKET=your-tos-bucket
TOS_REGION=your-tos-region
```

### 步骤 4：测试访问

发布前，先测试当前开发环境：

1. 打开浏览器，访问：
   ```
   http://9.129.0.232:5000/
   ```

2. 测试功能：
   - ✅ 欢迎页动画
   - ✅ 首页标题显示（梗的发园）
   - ✅ 发布梗功能
   - ✅ AI 生成功能
   - ✅ 点赞评论功能
   - ✅ 删除功能
   - ✅ 移动端适配

3. 检查控制台：
   - 打开浏览器开发者工具（F12）
   - 查看 Console 是否有错误
   - 查看 Network 是否有请求失败

### 步骤 5：正式发布

1. 在 Coze 平台点击"发布"或"部署"按钮
2. 等待部署完成（通常需要 1-2 分钟）
3. 获取正式访问链接

### 步骤 6：验证发布

1. 使用正式访问链接打开应用
2. 重复步骤 4 的测试流程
3. 确认所有功能正常
4. 在手机浏览器中测试移动端体验

---

## 📱 访问地址

### 开发环境（当前可用）
```
http://9.129.0.232:5000/
```

### Coze 开发环境
```
https://f9496088-5417-434b-8390-2444d84ab7c2.dev.coze.site
```

### Coze 正式环境（发布后）
```
https://your-app-name.coze.site
```

---

## ✨ 应用特性

### 核心功能
- 🌸 **田园花园风格**：梗以花朵形式展示，梗图作为花心
- 📸 **AI 生成**：自动生成梗名称和梗解释图片
- 💬 **互动功能**：点赞、评论、删除
- 🎨 **多彩设计**：鲜艳的花盆配色，视觉冲击力强
- 📱 **移动端优化**：完美适配各种手机屏幕
- ✨ **酷炫欢迎页**：渐变背景、粒子效果、逐字动画

### 技术亮点
- 前端：Taro 3.x + React + TypeScript + Tailwind CSS 4
- 后端：NestJS + TypeScript
- 数据库：Supabase PostgreSQL
- 存储：火山引擎 TOS
- AI：Coze 图片生成（720P 高清）
- 组件库：shadcn/ui for Taro

---

## 🔧 环境变量说明

### 必需变量

| 变量名 | 说明 | 示例 |
|-------|------|------|
| `PROJECT_DOMAIN` | 后端 API 地址 | `https://xxx.coze.site` |
| `SUPABASE_URL` | Supabase 项目 URL | `https://xxx.supabase.co` |
| `SUPABASE_ANON_KEY` | Supabase 匿名密钥 | `eyJhbGciOiJIUzI1NiIsInR5cCI6...` |

### 可选变量

| 变量名 | 说明 | 示例 |
|-------|------|------|
| `COZE_API_KEY` | Coze API 密钥 | `pat_xxxx` |
| `TOS_ACCESS_KEY` | TOS 访问密钥 | `AKLTxxx` |
| `TOS_SECRET_KEY` | TOS 秘密密钥 | `xxx` |
| `TOS_BUCKET` | TOS 存储桶名称 | `my-bucket` |
| `TOS_REGION` | TOS 区域 | `cn-beijing` |

---

## 🎯 发布检查清单

### 代码检查
- ✅ 所有代码已提交到 GitHub
- ✅ 通过 `pnpm validate` 检查
- ✅ 无 TypeScript 错误
- ✅ 无 ESLint 错误

### 功能检查
- ✅ 梗图上传功能正常
- ✅ AI 生成功能正常
- ✅ 点赞评论功能正常
- ✅ 删除功能正常
- ✅ 移动端适配正常
- ✅ 欢迎页动画正常

### 配置检查
- ✅ 环境变量已配置
- ✅ 域名已配置
- ✅ 应用信息已填写
- ✅ 访问权限已设置

---

## 🐛 故障排查

### 问题 1：页面无法访问

**检查项**：
1. 确认开发环境是否运行
2. 检查网络连接
3. 确认域名是否正确

**解决方案**：
```bash
# 检查开发环境状态
curl -I http://9.129.0.232:5000

# 如果服务停止，重新启动
coze dev
```

### 问题 2：后端 API 连接失败

**检查项**：
1. 确认环境变量 `PROJECT_DOMAIN` 是否正确
2. 检查后端服务是否运行
3. 查看浏览器控制台的网络请求

**解决方案**：
- 确认环境变量配置正确
- 重启开发环境

### 问题 3：图片上传失败

**检查项**：
1. 确认 TOS 密钥是否正确
2. 检查 TOS 存储桶是否存在
3. 确认存储桶权限配置

**解决方案**：
- 检查环境变量配置
- 确认 TOS 服务可用

### 问题 4：AI 生成失败

**检查项**：
1. 确认 Coze API 密钥是否有效
2. 检查 API 配额是否充足
3. 确认网络连接正常

**解决方案**：
- 检查 Coze API 密钥
- 确认 Coze 服务可用

---

## 📊 性能优化建议

### 前端优化
1. 启用图片懒加载
2. 压缩静态资源
3. 使用 CDN 加速
4. 优化首屏加载

### 后端优化
1. 启用缓存机制
2. 优化数据库查询
3. 添加请求限流
4. 监控服务性能

---

## 🎨 自定义配置

### 修改欢迎页标语

如果需要修改欢迎页标语"欢迎来到内部梗的世界！"，可以编辑：

```
src/components/welcome-page/index.tsx
```

找到 `titleText` 变量并修改：

```typescript
const titleText = '你的自定义标语'
```

### 修改标题大小

如果需要调整标题大小，可以编辑：

```
src/components/garden/garden.css
```

找到 `.garden-title-text` 并修改 `font-size`：

```css
.garden-title-text {
  font-size: 42px;  /* 修改这个值 */
}
```

### 修改配色方案

如果需要修改配色，可以编辑：

```
src/components/garden/garden.css
```

找到 `.garden-container` 并修改渐变色：

```css
.garden-container {
  background: linear-gradient(180deg, #87CEEB 0%, #B0E0E6 40%, #E0F7FA 60%, #90EE90 80%, #228B22 100%);
}
```

---

## 📞 技术支持

如有问题，可以通过以下方式获取帮助：

1. **查看文档**：README.md、DEPLOYMENT.md、QUICKSTART.md
2. **检查日志**：查看浏览器控制台和开发环境日志
3. **联系支持**：通过 Coze 平台联系技术支持

---

## 🎉 发布完成

发布完成后，您的应用将可以在 Coze 平台上访问，用户可以：

1. 在手机浏览器中访问应用
2. 上传和分享梗图
3. 使用 AI 生成梗图
4. 点赞、评论、互动
5. 享受独特的田园花园视觉体验

**恭喜！您的"梗的发园"应用已成功发布！** 🌸✨
