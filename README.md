# Play Store Lite / 谷歌应用商店风格示例

Next.js 16 (App Router) + Tailwind v4 的 Google Play 风格示例，内置 Prisma + SQLite、本地图标数据，支持分类列表、详情页、模拟安装按钮、后台新增页面，并附带“远程安装”下发 API。  
Google Play–style sample built with Next.js 16 (App Router) + Tailwind v4. Uses Prisma + SQLite with local seeded icons, includes category grids, detail pages, mock install button, admin add page, and a remote-install API.

## 技术栈 / Tech Stack
- Next.js 16 (App Router, TypeScript, Webpack)
- Tailwind CSS v4（自定义 M3 调色板、圆角、阴影）
- Prisma ORM + SQLite（`prisma/seed.ts` 本地种子数据）
- lucide-react、clsx、tailwind-merge

## 开发 & 脚本 / Development Scripts
```bash
npm install
npx prisma db seed          # 生成本地数据 / seed local data
npm run dev -- --hostname 127.0.0.1 --port 3000
npm run build
```

## 功能概览 / Features
- 首页 `/`、`/games`、`/kids`：服务端获取 Prisma 数据，Play Store 风格卡片网格、导航、搜索框与筛选 Chips。  
  Category grids with server-fetched data and Play-style UI.
- 详情页 `/app/[id]`：大图标、评分/下载/年龄、Data Safety 卡片；模拟安装按钮（客户端状态 + Server Action 更新 `isInstalled`）；新增“发送到你的设备”卡片，可向已注册设备下发远程安装指令。  
  Detail page with large icon, rating/downloads, data safety card, mock install button, and a “Send to device” panel that creates remote install tasks.
- 后台 `/admin/add`：表单创建新 App，写入数据库并跳转详情页。  
  Admin add page to create apps and redirect to their detail view.
- 本地图标与截图占位 `/public/icons/*`、`/public/placeholders/*`，避免外链失效。  
  Local icons and placeholder screenshots to avoid broken external images.

## 目录结构 / Structure
- `src/app/page.tsx`、`/games/page.tsx`、`/kids/page.tsx`：分类列表 / category pages
- `src/app/app/[id]/page.tsx`：详情页 / detail page
- `src/components/AppCard.tsx`、`Sidebar.tsx`、`InstallButton.tsx`
- `src/app/actions.ts`：Server Action（安装状态更新 / install state update）
- `src/lib/prisma.ts`：Prisma 单例 / singleton
- `prisma/schema.prisma`、`prisma/seed.ts`：模型与种子（本地图标与远程安装示例设备/任务）
- `src/app/api/devices`、`src/app/api/install-requests`：设备注册与远程安装任务接口
- `docs/REMOTE_INSTALL.md`：远程安装协议与对接说明

## 远程安装对接
- 详情页“发送到你的设备”会调用 `/api/install-requests` 创建任务，并展示最近状态。
- 手机端对接、接口协议与时序详见 `docs/REMOTE_INSTALL.md`。

## 部署提示 / Deploy Notes
- `.env`：`DATABASE_URL="file:./dev.db"`
- 生产：`npx prisma migrate deploy && npx prisma db seed`（按需）后再 `npm run build`。  
  Run migrations/seeds as needed before building for production.
