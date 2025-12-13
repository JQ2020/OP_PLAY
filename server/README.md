# OPPO Play - 应用商店 Web 应用

一个基于 Google Play Store 设计风格的现代化应用商店 Web 应用。采用 Next.js 16 (App Router) + Tailwind CSS v4 构建，支持应用浏览、搜索、详情查看、远程安装等完整功能。

![OPPO Play](public/oppo_market_icon.png)

## ✨ 功能特性

- 🎨 **Google Play 设计风格**：完美还原 Material Design 3 设计规范
- 📱 **响应式布局**：完美适配桌面端、平板和移动设备
- 🌓 **暗色模式**：支持明暗主题切换，自动保存用户偏好
- 🔍 **智能搜索**：实时搜索应用和开发者
- 📊 **分类浏览**：Apps、Games、Kids 三大分类
- 🚀 **远程安装**：支持向设备推送应用安装任务
- 💼 **管理后台**：完整的应用、设备、任务管理系统
- 🎭 **精美动画**：使用 Framer Motion 实现流畅的交互动画
- 📦 **150+ 应用**：内置 150 个应用数据，图标采用 DiceBear API 生成

## 📚 文档导航

- **📖 [项目架构文档](docs/ARCHITECTURE.md)** - 了解技术栈、项目结构和设计理念
- **🚀 [环境搭建与运行指南](docs/SETUP.md)** - 详细的安装、配置和使用教程
- **🔌 [远程安装协议](docs/REMOTE_INSTALL.md)** - 设备对接和 API 接口文档

## ⚡ 快速开始

### 环境要求
- Node.js ≥ 18.17.0
- npm ≥ 9.0.0

### 安装与运行

```bash
# 1. 克隆项目
git clone https://github.com/JQ2020/OP_PLAY.git
cd play-store-lite

# 2. 安装依赖
npm install

# 3. 初始化数据库
npx prisma generate
npx prisma db push
npx prisma db seed

# 4. 启动开发服务器
npm run dev

# 5. 浏览器访问
# 本地: http://localhost:3000
# 局域网: http://你的IP:3000
```

详细步骤请参考 **[环境搭建文档](docs/SETUP.md)**

## 🛠️ 技术栈

- **Next.js 16** + **React 19** + **TypeScript 5**
- **Tailwind CSS v4** + **Framer Motion**
- **Prisma ORM** + **SQLite**
- **lucide-react** + **next-themes**

完整技术栈说明请参考 **[架构文档](docs/ARCHITECTURE.md)**

## 📱 主要页面

- **首页** `/` - Apps 分类
- **游戏** `/games` - 游戏分类
- **儿童** `/kids` - 儿童应用
- **应用详情** `/app/[id]` - 详情页
- **管理后台** `/admin` - Dashboard、应用管理、设备管理、任务管理

## 📱 手机端访问

```bash
# 1. 获取电脑 IP
ifconfig getifaddr en0  # macOS/Linux
ipconfig               # Windows

# 2. 手机浏览器访问
http://你的IP地址:3000
```

详细说明：**[环境搭建文档 - 手机端访问](docs/SETUP.md#手机端访问)**

## 🔧 开发脚本

```bash
npm run dev          # 开发模式
npm run build        # 生产构建
npm run start        # 生产服务器
npx prisma studio    # 查看数据库
```

---

**Built with ❤️ using Next.js, React, and Tailwind CSS**

如有问题，请查看 [环境搭建文档](docs/SETUP.md) 或提交 [Issue](https://github.com/JQ2020/OP_PLAY/issues)
