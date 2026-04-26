# 梗的发园 - 部署指南

本项目已从小程序转换为移动端优化的网页应用（H5），提供多种部署方案。

## 📋 部署方案总览

| 部署方案 | 前端 | 后端 | 成本 | 推荐度 |
|---------|------|------|------|--------|
| **Vercel** | ✅ 自动部署 | ✅ Serverless | 免费套餐 | ⭐⭐⭐⭐⭐ |
| **Render.com** | ✅ 静态托管 | ✅ 独立实例 | 免费套餐 | ⭐⭐⭐⭐ |
| **GitHub Pages + Railway** | ✅ 静态托管 | ✅ 独立实例 | 免费 | ⭐⭐⭐⭐ |
| **自有服务器 (Nginx)** | ✅ 静态托管 | ✅ PM2 管理 | 服务器成本 | ⭐⭐⭐ |

---

## 🚀 方案一：Vercel 部署（推荐）

### 优点
- ✅ 前后端一体化部署
- ✅ 自动 HTTPS
- ✅ 全球 CDN 加速
- ✅ 免费套餐足够使用
- ✅ 自动 CI/CD

### 前置要求
- Vercel 账号（推荐使用 GitHub 登录）
- 后端 API 环境变量配置

### 部署步骤

#### 1. 导入项目到 Vercel

```bash
# 1. 访问 Vercel
https://vercel.com/new

# 2. 导入 GitHub 仓库
选择：juanrui0932/internal-geng-la

# 3. 配置环境变量
在 Vercel 项目设置中添加：
- PROJECT_DOMAIN: 你的后端 API 地址
- SUPABASE_URL: Supabase 项目 URL
- SUPABASE_ANON_KEY: Supabase 匿名密钥
- COZE_API_KEY: Coze API 密钥
- TOS_ACCESS_KEY: TOS 访问密钥
- TOS_SECRET_KEY: TOS 秘密密钥
- TOS_BUCKET: TOS 存储桶名称
- TOS_REGION: TOS 区域
```

#### 2. 修改 vercel.json（如果需要）

项目已包含 `vercel.json` 配置文件，默认配置如下：
- 前端：静态部署 H5 构建
- 后端：Serverless Functions

#### 3. 自动部署

推送代码到 GitHub 后，Vercel 会自动部署。

```bash
git add .
git commit -m "feat: update deployment config"
git push origin main
```

#### 4. 访问地址

部署完成后，Vercel 会提供访问地址：
```
https://internal-geng-la.vercel.app
```

---

## 📦 方案二：GitHub Pages + Render.com

### 架构说明
- **前端**：GitHub Pages 静态托管
- **后端**：Render.com 独立实例

### 前端部署（GitHub Pages）

#### 1. 启用 GitHub Pages

```bash
# 1. 进入仓库设置
https://github.com/juanrui0932/internal-geng-la/settings/pages

# 2. 配置 Source
选择：GitHub Actions

# 3. 保存配置
```

#### 2. 配置环境变量

在 GitHub 仓库设置中添加 Secrets：
```
Settings → Secrets and variables → Actions → New repository secret

添加：
- PROJECT_DOMAIN: https://your-backend-url.onrender.com
- SUPABASE_URL: 你的 Supabase URL
- SUPABASE_ANON_KEY: 你的 Supabase 匿名密钥
```

#### 3. 触发部署

推送代码会自动触发 GitHub Actions 部署。

#### 4. 访问地址

```
https://juanrui0932.github.io/internal-geng-la/
```

### 后端部署（Render.com）

#### 1. 导入项目到 Render

```bash
# 1. 访问 Render
https://dashboard.render.com/

# 2. 创建 Web Service
选择：New → Web Service
仓库：juanrui0932/internal-geng-la

# 3. 配置
- Root Directory: server
- Build Command: npm install && npm run build
- Start Command: npm run start:prod
```

#### 2. 配置环境变量

在 Render 项目设置中添加：
```
Environment Variables:
- PORT: 10000
- PROJECT_DOMAIN: https://your-backend-url.onrender.com
- SUPABASE_URL: 你的 Supabase URL
- SUPABASE_ANON_KEY: 你的 Supabase 匿名密钥
- COZE_API_KEY: Coze API 密钥
- TOS_ACCESS_KEY: TOS 访问密钥
- TOS_SECRET_KEY: TOS 秘密密钥
- TOS_BUCKET: TOS 存储桶名称
- TOS_REGION: TOS 区域
```

#### 3. 访问地址

Render 会提供后端 API 地址：
```
https://internal-geng-la-api.onrender.com
```

---

## 🔧 方案三：自有服务器（Nginx）

### 前置要求
- 一台安装了 Node.js 和 Nginx 的服务器
- 域名（可选）

### 前端部署（Nginx 静态托管）

#### 1. 构建项目

```bash
# 在服务器上拉取代码
git clone https://github.com/juanrui0932/internal-geng-la.git
cd internal-geng-la

# 安装依赖
pnpm install

# 构建 H5
pnpm build:web
```

#### 2. 配置 Nginx

```nginx
# /etc/nginx/sites-available/internal-geng-la

server {
    listen 80;
    server_name your-domain.com;

    root /var/www/internal-geng-la/dist-web;
    index index.html;

    # 前端静态文件
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 后端 API 反向代理
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### 3. 启用站点

```bash
sudo ln -s /etc/nginx/sites-available/internal-geng-la /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 后端部署（PM2）

#### 1. 配置环境变量

```bash
# 在 server 目录下创建 .env
cd server

cat > .env << EOF
PORT=3000
PROJECT_DOMAIN=https://your-domain.com
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-key
COZE_API_KEY=your-coze-key
TOS_ACCESS_KEY=your-tos-access-key
TOS_SECRET_KEY=your-tos-secret-key
TOS_BUCKET=your-tos-bucket
TOS_REGION=your-tos-region
EOF
```

#### 2. 构建

```bash
npm run build
```

#### 3. 使用 PM2 管理

```bash
# 安装 PM2
npm install -g pm2

# 启动服务
pm2 start dist/main.js --name internal-geng-la-api

# 设置开机自启
pm2 startup
pm2 save

# 查看日志
pm2 logs internal-geng-la-api

# 重启服务
pm2 restart internal-geng-la-api
```

#### 4. 配置防火墙

```bash
# 开放端口
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 3000  # 如果需要直接访问后端

# 启用防火墙
sudo ufw enable
```

---

## 📋 环境变量清单

### 必需变量

| 变量名 | 说明 | 示例 |
|-------|------|------|
| `PROJECT_DOMAIN` | 后端 API 地址 | `https://api.example.com` |
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

## 🎯 推荐部署方案

### 个人项目 / 小团队
**推荐：Vercel**
- ✅ 零配置，自动化部署
- ✅ 前后端一体化
- ✅ 免费、快速、稳定

### 需要 API 独立扩展
**推荐：Render.com**
- ✅ 前后端分离，灵活扩展
- ✅ 后端独立实例
- ✅ 免费套餐可用

### 完全控制 / 企业级
**推荐：自有服务器**
- ✅ 完全控制
- ✅ 数据隐私
- ✅ 可定制性强

---

## 🔍 故障排查

### 前端无法访问后端

**检查项：**
1. 环境变量 `PROJECT_DOMAIN` 是否正确配置
2. 后端服务是否正常运行
3. CORS 是否正确配置
4. 防火墙是否开放对应端口

### 图片上传失败

**检查项：**
1. TOS 密钥是否正确
2. TOS 存储桶是否存在
3. TOS 存储桶权限配置
4. 文件大小是否超出限制

### AI 生成失败

**检查项：**
1. Coze API 密钥是否有效
2. Coze API 配额是否充足
3. 提示词是否符合规范
4. 网络连接是否正常

---

## 📚 参考链接

- [Vercel 官方文档](https://vercel.com/docs)
- [Render.com 官方文档](https://render.com/docs)
- [GitHub Pages 文档](https://docs.github.com/pages)
- [Nginx 配置指南](https://nginx.org/en/docs/)
- [PM2 文档](https://pm2.keymetrics.io/docs/)

---

## 💡 最佳实践

1. **环境变量管理**
   - 不要将敏感信息提交到 Git
   - 使用各平台的 Secrets 功能
   - 不同环境使用不同变量

2. **监控和日志**
   - 配置日志收集
   - 设置错误告警
   - 定期检查服务状态

3. **安全加固**
   - 启用 HTTPS
   - 配置 CORS
   - 限制 API 访问频率
   - 定期更新依赖

4. **性能优化**
   - 启用 CDN
   - 配置缓存策略
   - 压缩静态资源
   - 优化图片加载

---

## 📞 支持

如有问题，请提交 Issue：
https://github.com/juanrui0932/internal-geng-la/issues
