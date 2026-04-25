# 内部梗啦！ - 设计指南

## 品牌定位

**应用定位**：搞笑社区类小程序，让用户分享和发现有趣梗图、梗内容，营造轻松愉快的社交氛围。

**设计风格**：轻松活泼、幽默有趣、年轻化。

**目标用户**：18-35岁年轻人，喜欢分享和发现网络热梗的社交用户。

---

## 配色方案

### 主色板

**主色调 - 活力橙**
- `bg-orange-500` - 主要按钮、强调元素
- `text-orange-600` - 链接、重要文本
- `border-orange-500` - 边框强调

**辅助色 - 清新绿**
- `bg-green-500` - 成功状态、点赞交互
- `text-green-600` - 正面反馈

**中性色**
- `bg-gray-50` / `bg-gray-100` - 页面背景
- `bg-white` - 卡片背景
- `text-gray-900` - 主要文本
- `text-gray-500` - 次要文本
- `text-gray-400` - 辅助文本

### 语义色

- `bg-red-500` - 危险操作（删除、取消）
- `bg-yellow-400` - 警告提示

---

## 字体规范

### H1 - 页面大标题
- `text-2xl font-bold text-gray-900`

### H2 - 卡片标题
- `text-lg font-semibold text-gray-900`

### H3 - 区块标题
- `text-base font-semibold text-gray-900`

### Body - 正文
- `text-sm text-gray-700`

### Caption - 辅助文本
- `text-xs text-gray-500`

---

## 间距系统

### 页面边距
- `px-4` - 标准页面内边距（16px）
- `py-4` - 页面垂直间距

### 卡片内边距
- `p-4` - 标准卡片内边距

### 组件间距
- `gap-3` - 组件之间间距（12px）
- `gap-4` - 大间距（16px）
- `mb-4` - 底部间距（16px）

---

## 组件使用原则

### 通用 UI 组件（优先使用 @/components/ui/*）

- **Button** - 所有按钮（发布、点赞、评论等）
- **Card** - 梗内容卡片容器
- **Input** - 梗文本输入
- **Textarea** - 解释、评论输入
- **Badge** - 标签（如"热门"、"新梗"）
- **Tabs** - 首页分类切换
- **Avatar** - 用户头像
- **Toast** - 操作反馈提示
- **Skeleton** - 加载状态占位
- **Dialog** - 发布确认弹窗

### 页面结构

**首页（梗列表）**：
- Tab 切换（全部/热门/最新）
- 瀑布流卡片列表
- 每张卡片：配图 + 梗文本 + 解释（可选）+ 点赞/评论按钮

**发布页面**：
- 配图上传区域（可选）
- AI 生成按钮（无配图时）
- 梗文本输入（必填）
- 解释输入（可选）
- 发布按钮

---

## 导航结构

### TabBar 配置

**底部导航**：
- 首页 - 浏览梗列表
- 发布 - 上传/生成梗
- 我的 - 个人中心

**图标**：使用 lucide-react-taro 生成 PNG 图标

```typescript
// TabBar 配置（app.config.ts）
tabBar: {
  color: '#999999',
  selectedColor: '#f97316',  // 橙色
  backgroundColor: '#ffffff',
  borderStyle: 'black',
  list: [
    {
      pagePath: 'pages/index/index',
      text: '首页',
      iconPath: './assets/tabbar/home.png',
      selectedIconPath: './assets/tabbar/home-active.png',
    },
    {
      pagePath: 'pages/publish/index',
      text: '发布',
      iconPath: './assets/tabbar/plus.png',
      selectedIconPath: './assets/tabbar/plus-active.png',
    },
    {
      pagePath: 'pages/profile/index',
      text: '我的',
      iconPath: './assets/tabbar/user.png',
      selectedIconPath: './assets/tabbar/user-active.png',
    },
  ],
}
```

---

## 容器样式

### 卡片样式
- `bg-white rounded-xl shadow-sm p-4 mb-4`

### 按钮样式
- 主要按钮：`bg-orange-500 text-white rounded-lg py-3 w-full`
- 次要按钮：`bg-gray-100 text-gray-700 rounded-lg py-3 w-full`

### 输入框样式
- 外层容器：`bg-gray-50 rounded-xl px-4 py-3`
- 内层 Input：`w-full bg-transparent`

---

## 空状态与加载态

### 空状态
- 居中显示提示图标 + 文本
- 使用 `text-gray-500` 文本色
- 提供"发布梗"引导按钮

### 加载态
- 使用 Skeleton 组件占位
- 卡片骨架：`h-48 rounded-xl mb-4`

---

## 小程序约束

### 包体积限制
- 图片资源必须上传到 TOS 对象存储
- 禁止将大图片直接打包到项目中

### 图片策略
- 梗图：用户上传 / AI 生成 → TOS 对象存储
- TabBar 图标：本地 PNG（81x81px）

### 性能优化
- 列表使用虚拟滚动
- 图片懒加载：`lazyLoad`
- 分页加载：每页 10-20 条

---

## 特殊交互

### 点赞动画
- 点击点赞后按钮变绿 + 数字 +1
- 使用 Toast 提示

### AI 生成提示
- 无配图时显示"AI 生成梗图"按钮
- 生成中显示加载状态
- 生成失败显示错误提示

### 发布确认
- 梀文本为空时显示错误提示
- 无配图且未点击 AI 生成时提示确认
- 发布成功后跳转到首页
