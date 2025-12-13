# OPPO Play

一个全栈移动应用商店项目，包含 Android 客户端和 Web 管理后台。

## 项目简介

OPPO Play 是一个基于 Google Play Store 设计风格的应用商店解决方案，采用现代化技术栈构建，支持应用浏览、搜索、详情查看、远程安装等完整功能。项目分为两个主要部分：

- **Android 客户端**：原生 Kotlin + Jetpack Compose 开发的移动端应用
- **Web 服务端**：Next.js 全栈应用，包含应用商店前台和管理后台

## 技术栈

### Android 客户端 (`android/`)
- **语言**: Kotlin
- **UI 框架**: Jetpack Compose
- **架构模式**: MVVM + ViewModels
- **网络请求**: Retrofit + Moshi
- **图片加载**: Coil

### Web 服务端 (`server/`)
- **框架**: Next.js 16 (App Router) + React 19
- **数据库**: SQLite + Prisma ORM
- **样式**: Tailwind CSS v4
- **动画**: Framer Motion
- **API**: RESTful 接口

## 项目结构

```
oppo-play/
├── android/              # Android 客户端
│   ├── app/              # 主应用模块
│   │   ├── src/main/
│   │   │   ├── java/     # Kotlin 源码
│   │   │   └── res/      # 资源文件
│   │   └── build.gradle
│   └── gradle/           # Gradle 配置
│
├── server/               # Web 服务端 & 管理后台
│   ├── src/app/          # Next.js 页面和 API 路由
│   │   ├── (routes)/     # 前台页面（首页、游戏、儿童）
│   │   ├── admin/        # 管理后台
│   │   └── api/          # RESTful API
│   ├── prisma/           # 数据库模型和迁移
│   ├── public/           # 静态资源
│   └── docs/             # 详细文档
│
└── README.md             # 本文件
```

## 功能特性

### 应用商店前台
- 应用分类浏览（Apps、Games、Kids）
- 实时搜索应用和开发者
- 应用详情页（截图轮播、评论、数据安全）
- 明暗主题切换
- 响应式设计，支持移动端访问

### 管理后台
- Dashboard 数据概览
- 应用管理（增删改查）
- 设备管理（查看在线设备）
- 安装任务管理（远程下发）
- 用户管理

### 远程安装
- 设备注册与心跳保活
- Web 端向设备推送安装任务
- 实时进度追踪
- 状态同步

## 快速开始

### 环境要求
- Node.js 18+
- npm 9+
- Android Studio（Android 开发）

### 服务端启动

```bash
cd server
npm install
npx prisma generate
npx prisma db push
npx prisma db seed
npm run dev
```

服务启动后访问 `http://localhost:3000`

### Android 客户端

1. 使用 Android Studio 打开 `android/` 目录
2. 修改 `ApiService.kt` 中的 `BASE_URL` 为服务端地址
3. 运行到设备或模拟器

## 详细文档

> **Web 端详细配置和使用说明请参考以下文档：**

| 文档 | 说明 |
|------|------|
| [环境搭建与运行指南](server/docs/SETUP.md) | 详细的安装、配置、运行教程，包含手机端访问和常见问题解答 |
| [项目架构文档](server/docs/ARCHITECTURE.md) | 技术栈详解、项目结构、数据库模型、核心功能模块说明 |
| [远程安装协议](server/docs/REMOTE_INSTALL.md) | 设备注册、任务下发、状态同步的接口协议 |
| [客户端 API 对接文档](server/docs/client-api.md) | 完整的 API 接口文档，包含请求示例和 Kotlin 实现代码 |

## API 接口概览

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/apps` | GET | 获取应用列表（支持分页、搜索、分类筛选） |
| `/api/apps/:id` | GET | 获取应用详情 |
| `/api/devices` | POST | 设备注册/心跳 |
| `/api/install-requests` | GET | 获取安装任务列表 |
| `/api/install-requests` | POST | 创建安装任务 |
| `/api/install-requests/:id` | PATCH | 更新任务状态 |
| `/api/user` | POST | 用户认证（登录/注册） |
| `/api/reviews` | GET | 获取应用评论 |

完整 API 文档请参考 [客户端 API 对接文档](server/docs/client-api.md)

## 主要页面

### 前台页面
- **首页** `/` - Apps 分类
- **游戏** `/games` - 游戏分类
- **儿童** `/kids` - 儿童应用
- **应用详情** `/app/[id]` - 详情页

### 管理后台
- **Dashboard** `/admin` - 数据概览
- **应用管理** `/admin/apps` - 应用 CRUD
- **设备管理** `/admin/devices` - 设备列表
- **任务管理** `/admin/tasks` - 安装任务
- **用户管理** `/admin/users` - 用户列表

## 开发脚本

```bash
# 服务端
cd server
npm run dev          # 开发模式
npm run build        # 生产构建
npm run start        # 生产服务器
npx prisma studio    # 数据库可视化管理

# Android
# 使用 Android Studio 运行
```

## 数据库管理

```bash
cd server

# 查看数据库（可视化界面）
npx prisma studio

# 重置数据库
rm prisma/dev.db
npx prisma db push
npx prisma db seed
```

## 许可证

MIT
