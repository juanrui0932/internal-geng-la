# 梗的发园

一个基于 [Taro 4](https://docs.taro.zone/docs/) + [Nest.js](https://nestjs.com/) 的移动端网页应用，支持梗图上传、AI 生成、点赞评论等功能。

## ✨ 功能特性

- 🌸 **田园花园风格**：梗以花朵形式展示，梗图作为花心
- 📸 **AI 生成**：自动生成梗名称和梗解释图片
- 💬 **互动功能**：点赞、评论、删除
- 📱 **移动端优化**：完美适配各种手机屏幕
- 🎨 **多彩设计**：鲜艳的花盆配色，视觉冲击力强

## 🚀 快速部署

### 一键部署（推荐 Vercel）

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/juanrui0932/internal-geng-la)

### 其他部署方案

- 📘 [GitHub Pages](./DEPLOYMENT.md#方案二github-pages--rendercom)
- 📦 [Render.com](./DEPLOYMENT.md#方案二github-pages--rendercom)
- 🖥️ [自有服务器](./DEPLOYMENT.md#方案三自有服务器nginx)

详细部署指南请查看：[DEPLOYMENT.md](./DEPLOYMENT.md) | [QUICKSTART.md](./QUICKSTART.md)

## 🌐 在线体验

- **开发环境**：http://9.129.0.232:5000
- **Vercel**：https://internal-geng-la.vercel.app
- **GitHub Pages**：https://juanrui0932.github.io/internal-geng-la/

## 📋 技术栈

### 整体框架
- **前端框架**: Taro 4.1.9
- **语言**: TypeScript 5.4.5
- **渲染**: React 18.0.0
- **样式**: TailwindCSS 4.1.18
- **Tailwind 适配层**: weapp-tailwindcss 4.9.2
- **状态管理**: Zustand 5.0.9
- **图标库**: lucide-react-taro latest
- **工程化**: Vite 4.2.0
- **包管理**: pnpm
- **运行时**: Node.js >= 18
- **服务端**: NestJS 10.4.15
- **数据库 ORM**: Drizzle ORM 0.45.1
- **类型校验**: Zod 4.3.5

### 第三方服务
- **数据库**: Supabase PostgreSQL
- **对象存储**: 火山引擎 TOS
- **AI 生成**: Coze 图片生成
- **组件库**: shadcn/ui (Taro 版本)

## 💻 本地开发

### 环境要求

- Node.js >= 18
- pnpm >= 9
- Git

### 安装步骤

```bash
# 1. 克隆项目
git clone https://github.com/juanrui0932/internal-geng-la.git
cd internal-geng-la

# 2. 安装依赖
pnpm install

# 3. 配置环境变量
# 在项目根目录创建 .env.local 文件
cat > .env.local << EOF
PROJECT_DOMAIN=https://your-domain.com
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-key
COZE_API_KEY=your-coze-key
TOS_ACCESS_KEY=your-tos-access-key
TOS_SECRET_KEY=your-tos-secret-key
TOS_BUCKET=your-tos-bucket
TOS_REGION=your-tos-region
EOF

# 4. 启动开发服务器
pnpm dev
```

### 访问地址

- 前端：http://localhost:5000
- 后端：http://localhost:3000

## 📖 开发文档

### 快速开始

详细开发指南请查看：
- [QUICKSTART.md](./QUICKSTART.md) - 快速开始指南
- [DEPLOYMENT.md](./DEPLOYMENT.md) - 完整部署指南

### 前端开发

- **新建页面**：在 `src/pages/` 下创建页面目录
- **组件库**：UI 组件位于 `@/components/ui`
- **网络请求**：使用 `Network.request` 封装
- **状态管理**：使用 Zustand
- **样式开发**：优先使用 Tailwind CSS

### 后端开发

- **新建模块**：使用 `npx nest g resource` 生成
- **环境变量**：在 `.env` 文件中配置
- **数据库操作**：使用 Drizzle ORM
- **类型校验**：使用 Zod

## 📂 项目结构

```
├── .cozeproj/                # Coze 平台配置
│   └── scripts/              # 构建和运行脚本
├── .github/                  # GitHub Actions 配置
│   └── workflows/            # 工作流文件
│       └── deploy-gh-pages.yml  # GitHub Pages 部署
├── config/                   # Taro 构建配置
│   ├── index.ts              # 主配置文件
│   ├── dev.ts                # 开发环境配置
│   └── prod.ts               # 生产环境配置
├── server/                   # NestJS 后端服务
│   └── src/
│       ├── main.ts           # 服务入口
│       ├── app.module.ts     # 根模块
│       ├── app.controller.ts # 应用控制器
│       └── app.service.ts    # 应用服务
├── src/                      # 前端源码
│   ├── pages/                # 页面组件
│   ├── components/           # 业务组件
│   │   ├── ui/              # UI 组件库
│   │   ├── flower-meme/     # 花朵梗组件
│   │   └── empty-pot/       # 空花盆组件
│   ├── presets/              # 框架预置逻辑
│   ├── utils/                # 工具函数
│   ├── network.ts            # 封装好的网络请求工具
│   ├── app.ts                # 应用入口
│   ├── app.config.ts         # 应用配置
│   └── app.css               # 全局样式
├── types/                    # TypeScript 类型定义
├── key/                      # 小程序密钥（CI 上传用）
├── DEPLOYMENT.md             # 部署指南
├── QUICKSTART.md             # 快速开始
├── vercel.json               # Vercel 配置
├── render.yaml               # Render 配置
└── netlify.toml              # Netlify 配置
```

## 🛠️ 常用命令

### 开发

```bash
pnpm dev          # 同时启动 H5 前端和 NestJS 后端
pnpm dev:web      # 仅 H5 前端
pnpm dev:weapp    # 仅微信小程序
pnpm dev:server   # 仅后端服务
```

### 构建

```bash
pnpm build        # 构建所有（H5 + 小程序 + 后端）
pnpm build:web    # 仅构建 H5，输出到 dist-web
pnpm build:weapp  # 仅构建微信小程序，输出到 dist
pnpm build:server # 仅构建后端
```

### 验证

```bash
pnpm validate     # 执行 TypeScript + ESLint 校验
```

## 🔧 配置说明

### 环境变量

| 变量名 | 说明 | 必填 |
|-------|------|------|
| `PROJECT_DOMAIN` | 后端 API 地址 | ✅ |
| `SUPABASE_URL` | Supabase 项目 URL | ✅ |
| `SUPABASE_ANON_KEY` | Supabase 匿名密钥 | ✅ |
| `COZE_API_KEY` | Coze API 密钥 | ✅ |
| `TOS_ACCESS_KEY` | TOS 访问密钥 | ✅ |
| `TOS_SECRET_KEY` | TOS 秘密密钥 | ✅ |
| `TOS_BUCKET` | TOS 存储桶名称 | ✅ |
| `TOS_REGION` | TOS 区域 | ✅ |

### H5 配置

- **publicPath**: `./` - 相对路径，适配静态托管
- **router mode**: `hash` - Hash 路由，兼容性更好
- **viewport**: 禁止缩放，支持安全区域

## 📱 页面结构

- **首页** (`/pages/index/index`) - 梗花盆展示
- **发布页** (`/pages/publish/index`) - 上传和 AI 生成
- **详情页** (`/pages/detail/index`) - 梗详情、点赞、评论
- **我的** (`/pages/profile/index`) - 个人信息

## 🎨 设计风格

- **主题色**: 蓝色系（#1890ff）
- **配色方案**: 鲜艳的花盆配色
- **组件库**: shadcn/ui for Taro
- **图标**: lucide-react-taro
- **样式**: Tailwind CSS 4

## 🐛 故障排查

### 前端无法访问后端

1. 检查环境变量 `PROJECT_DOMAIN` 是否正确
2. 检查后端服务是否正常运行
3. 检查防火墙是否开放对应端口

### 图片上传失败

1. 检查 TOS 密钥是否正确
2. 检查 TOS 存储桶是否存在
3. 检查存储桶权限配置

### AI 生成失败

1. 检查 Coze API 密钥是否有效
2. 检查 Coze API 配额是否充足
3. 检查网络连接是否正常

更多问题请查看：[DEPLOYMENT.md](./DEPLOYMENT.md#故障排查)

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 📄 许可证

MIT License

## 📞 联系方式

- **GitHub**: https://github.com/juanrui0932/internal-geng-la
- **Issues**: https://github.com/juanrui0932/internal-geng-la/issues

---

**Made with ❤️ by 梗的发园 Team**
