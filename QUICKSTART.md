# 梗的发园 - 快速开始

## 🌟 项目简介

"梗的发园"是一个基于 Taro + NestJS 开发的移动端网页应用，支持：
- 🌸 田园花园风格的梗展示
- 📸 AI 生成梗图
- 💬 点赞、评论、删除功能
- 📱 移动端完美适配

---

## 🚀 快速部署（推荐：Vercel）

### 方式一：一键部署（最简单）

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/juanrui0932/internal-geng-la)

点击上方按钮，按照提示完成部署。

### 方式二：手动部署

#### 1. 导入项目到 Vercel

```bash
# 访问 Vercel
https://vercel.com/new

# 导入 GitHub 仓库
选择：juanrui0932/internal-geng-la
```

#### 2. 配置环境变量

在 Vercel 项目设置中添加以下环境变量：

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

#### 3. 点击 Deploy

等待部署完成（约 1-2 分钟），即可访问：
```
https://internal-geng-la.vercel.app
```

---

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

访问地址：
- 前端：http://localhost:5000
- 后端：http://localhost:3000

---

## 🌐 其他部署方案

### GitHub Pages（仅前端）

适用于只需要前端静态托管的情况。

详细步骤请查看：[DEPLOYMENT.md](./DEPLOYMENT.md#方案二github-pages--rendercom)

### Render.com（前后端分离）

适用于需要后端独立扩展的场景。

详细步骤请查看：[DEPLOYMENT.md](./DEPLOYMENT.md#方案二github-pages--rendercom)

### 自有服务器

适用于需要完全控制的情况。

详细步骤请查看：[DEPLOYMENT.md](./DEPLOYMENT.md#方案三自有服务器nginx)

---

## 📱 访问应用

### 开发环境

```
http://localhost:5000
```

### 生产环境（Vercel）

```
https://internal-geng-la.vercel.app
```

### GitHub Pages

```
https://juanrui0932.github.io/internal-geng-la/
```

---

## 🛠️ 常见问题

### Q: 如何获取 Supabase 密钥？

```bash
# 1. 访问 Supabase
https://supabase.com/dashboard

# 2. 创建项目后，进入 Settings → API

# 3. 复制以下信息：
# - Project URL
# - anon public key
```

### Q: 如何获取 Coze API 密钥？

```bash
# 1. 访问 Coze 平台
https://www.coze.cn/

# 2. 创建个人访问令牌
# - 进入：个人设置 → API 密钥
# - 创建新的访问令牌
```

### Q: 如何配置 TOS 对象存储？

```bash
# 1. 访问火山引擎 TOS
https://www.volcengine.com/product/tos

# 2. 创建存储桶
# - 进入对象存储 → 创建存储桶

# 3. 获取密钥
# - 进入访问管理 → 访问密钥
# - 创建新的访问密钥
```

### Q: 前端无法访问后端？

检查项：
1. 环境变量 `PROJECT_DOMAIN` 是否正确
2. 后端服务是否正常运行
3. 防火墙是否开放对应端口

### Q: 图片上传失败？

检查项：
1. TOS 密钥是否正确
2. TOS 存储桶是否存在
3. 存储桶权限配置是否正确

### Q: AI 生成失败？

检查项：
1. Coze API 密钥是否有效
2. Coze API 配额是否充足
3. 网络连接是否正常

---

## 📚 详细文档

- [部署指南](./DEPLOYMENT.md)
- [GitHub 仓库](https://github.com/juanrui0932/internal-geng-la)

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📄 许可证

MIT License
