# O Play - 环境搭建与运行指南

本文档详细介绍如何从零开始搭建开发环境并运行 O Play 项目。

## 目录
- [环境要求](#环境要求)
- [快速开始](#快速开始)
- [详细步骤](#详细步骤)
- [访问应用](#访问应用)
- [数据管理](#数据管理)
- [手机端访问](#手机端访问)
- [常见问题](#常见问题)

---

## 环境要求

在开始之前，请确保你的系统已安装以下软件：

### 必需软件
- **Node.js**：版本 ≥ 18.17.0（推荐 20.x LTS）
  - 下载地址：https://nodejs.org/
  - 验证安装：`node -v`

- **npm**：版本 ≥ 9.0.0（随 Node.js 自动安装）
  - 验证安装：`npm -v`

- **Git**：用于克隆项目
  - 下载地址：https://git-scm.com/
  - 验证安装：`git --version`

### 推荐软件
- **VS Code**：推荐的代码编辑器
  - 下载地址：https://code.visualstudio.com/
  - 推荐插件：
    - ESLint
    - Prettier
    - Tailwind CSS IntelliSense
    - Prisma

---

## 快速开始

如果你熟悉开发流程，可以直接执行以下命令：

```bash
# 1. 克隆项目
git clone https://github.com/JQ2020/O_PLAY.git o-play
cd o-play/server

# 2. 安装依赖
npm install

# 3. 初始化数据库
npx prisma generate
npx prisma db push
npx prisma db seed

# 4. 启动开发服务器
npm run dev

# 5. 浏览器访问 http://localhost:3000
```

---

## 详细步骤

### 第一步：克隆项目

打开终端（Terminal），执行以下命令：

```bash
# 克隆项目到本地
git clone https://github.com/JQ2020/O_PLAY.git o-play

# 进入项目目录
cd o-play/server
```

如果你没有 Git，也可以直接从 GitHub 下载 ZIP 文件并解压。

---

### 第二步：安装依赖

在项目根目录下执行：

```bash
npm install
```

这个命令会安装 `package.json` 中列出的所有依赖包，包括：
- Next.js 16
- React 19
- Tailwind CSS v4
- Prisma ORM
- Framer Motion
- 其他辅助库

**预计安装时间**：2-5 分钟（取决于网络速度）

**如果遇到网络问题**，可以使用国内镜像源：
```bash
npm config set registry https://registry.npmmirror.com
npm install
```

---

### 第三步：配置环境变量

项目根目录下应该已经有 `.env` 文件，内容如下：

```env
DATABASE_URL="file:./dev.db"
```

如果没有，请手动创建 `.env` 文件并添加上述内容。

**说明**：
- `DATABASE_URL`：数据库连接字符串
- `file:./dev.db`：使用 SQLite 本地数据库，文件名为 `dev.db`

---

### 第四步：初始化数据库

#### 4.1 生成 Prisma 客户端
```bash
npx prisma generate
```
这会根据 `prisma/schema.prisma` 生成 TypeScript 类型定义和客户端代码。

#### 4.2 创建数据库表结构
```bash
npx prisma db push
```
这会在本地创建 `dev.db` 文件，并根据 schema 创建所有数据表。

#### 4.3 填充种子数据
```bash
npx prisma db seed
```

**种子数据包含**：
- 150 个应用（50 个 Apps、50 个 Games、50 个 Kids）
- 5 个模拟设备
- 6 个远程安装任务示例
- 每个应用包含 3 条评论和 3 张截图

**输出示例**：
```
Running seed command `tsx prisma/seed.ts` ...
Cleaning database...
Seeding 150 apps...
  Created 25/150 apps...
  Created 50/150 apps...
  Created 75/150 apps...
  Created 100/150 apps...
  Created 125/150 apps...
  Created 150/150 apps...
Creating devices...
Creating install tasks...

✅ Seed completed successfully!
   - Apps: 150
   - Devices: 5
   - Install tasks: 6
```

---

### 第五步：启动开发服务器

```bash
npm run dev
```

**成功启动后会看到**：
```
▲ Next.js 16.0.7
- Local:        http://localhost:3000
- Network:      http://192.168.x.x:3000

✓ Ready in 2.5s
```

---

## 访问应用

### 1. 浏览器访问（电脑端）

开发服务器启动后，在浏览器中打开：
- **本地访问**：http://localhost:3000
- **局域网访问**：http://192.168.x.x:3000（替换为你的实际 IP）

### 2. 主要页面导航

#### 前台页面
- **首页（Apps 分类）**：http://localhost:3000/
- **游戏分类**：http://localhost:3000/games
- **儿童分类**：http://localhost:3000/kids
- **应用详情**：http://localhost:3000/app/[应用ID]
  - 示例：http://localhost:3000/app/clxxx123456

#### 管理后台
- **Dashboard**：http://localhost:3000/admin
- **应用管理**：http://localhost:3000/admin/apps
- **设备管理**：http://localhost:3000/admin/devices
- **安装任务**：http://localhost:3000/admin/tasks
- **系统设置**：http://localhost:3000/admin/settings

### 3. 功能操作

#### 搜索应用
1. 在页面顶部搜索框输入关键词
2. 按回车键搜索
3. 支持搜索应用名称和开发者

#### 查看应用详情
1. 点击任意应用卡片
2. 进入详情页查看完整信息
3. 可以查看截图、评论、数据安全等信息

#### 安装/卸载应用
1. 在详情页点击"安装"按钮
2. 按钮会显示进度动画
3. 安装完成后变为"卸载"状态

#### 远程安装到设备
1. 在详情页找到"发送到你的设备"卡片
2. 选择目标设备
3. 点击"发送"按钮
4. 查看安装任务状态

---

## 数据管理

### 查看数据库

#### 方法一：使用 Prisma Studio（推荐）
```bash
npx prisma studio
```

- 会自动打开浏览器：http://localhost:5555
- 可视化界面，方便查看和编辑数据
- 支持所有数据表的 CRUD 操作

#### 方法二：使用 SQLite 客户端
推荐工具：
- **DB Browser for SQLite**：https://sqlitebrowser.org/
- **TablePlus**：https://tableplus.com/

打开文件：`prisma/dev.db`

---

### 重置数据库

如果需要重置数据库到初始状态：

```bash
# 删除数据库文件
rm prisma/dev.db

# 重新创建并填充数据
npx prisma db push
npx prisma db seed
```

---

### 添加新数据

#### 方法一：通过管理后台（推荐）

1. 访问：http://localhost:3000/admin/apps
2. 点击"添加应用"按钮
3. 填写表单：
   - 应用名称
   - 开发者
   - 分类（Apps/Games/Kids）
   - 图标 URL
   - 描述
   - 评分、下载量、版本等信息
4. 点击"创建应用"保存

#### 方法二：通过 API

使用 Postman 或 curl 发送请求：

```bash
curl -X POST http://localhost:3000/api/admin/apps \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My App",
    "developer": "My Company",
    "iconUrl": "/icons/apps/01_spotify.svg",
    "description": "App description",
    "rating": 4.5,
    "downloads": "1M+",
    "category": "Entertainment",
    "size": "50 MB",
    "version": "1.0.0"
  }'
```

#### 方法三：修改种子数据

编辑 `prisma/seed.ts` 文件，添加新的应用数据，然后：

```bash
npx prisma db seed
```

---

### 生成应用图标

项目使用 DiceBear API 生成独特的 SVG 图标。如果需要生成新图标：

```bash
node scripts/generate-realistic-icons.js
```

这会在 `public/icons/` 目录下生成 150 个 SVG 图标文件。

---

## 手机端访问

要在手机上浏览本地部署的网站，需要确保手机和电脑在同一个 WiFi 网络下。

### 第一步：获取电脑 IP 地址

#### macOS / Linux
```bash
ifconfig getifaddr en0
```
或
```bash
ipconfig getifaddr en0
```

#### Windows
```bash
ipconfig
```
查找 "IPv4 地址"，通常格式为 `192.168.x.x` 或 `10.0.x.x`

**示例输出**：
```
192.168.1.100
```

---

### 第二步：确保开发服务器支持网络访问

项目已经配置好支持局域网访问（`package.json` 中使用 `-H 0.0.0.0`）。

如果服务器正在运行，直接继续下一步。如果没有运行，启动服务器：

```bash
npm run dev
```

你会看到类似输出：
```
- Local:        http://localhost:3000
- Network:      http://192.168.1.100:3000
```

---

### 第三步：手机连接同一 WiFi

确保你的手机连接到与电脑相同的 WiFi 网络。

---

### 第四步：手机浏览器访问

在手机的浏览器（Safari、Chrome 等）中输入：

```
http://192.168.1.100:3000
```

**注意**：
- 将 `192.168.1.100` 替换为你的实际 IP 地址
- 端口号为 `3000`（如果修改过端口，使用实际端口）

---

### 可能遇到的问题

#### 问题1：无法访问

**原因**：防火墙阻止了连接

**解决方案（macOS）**：
1. 打开"系统偏好设置" → "安全性与隐私" → "防火墙"
2. 如果防火墙已开启，点击"防火墙选项"
3. 添加 Node.js 到允许列表，或临时关闭防火墙测试

**解决方案（Windows）**：
1. 打开"控制面板" → "Windows Defender 防火墙"
2. 点击"允许应用或功能通过 Windows Defender 防火墙"
3. 找到 Node.js，勾选"专用"和"公用"
4. 如果找不到，点击"允许其他应用"添加

#### 问题2：显示 ERR_CONNECTION_REFUSED

**检查项**：
1. 确认开发服务器正在运行
2. 确认 IP 地址正确
3. 确认端口号正确（默认 3000）
4. 尝试在电脑浏览器访问局域网地址测试

#### 问题3：页面加载很慢

**原因**：局域网信号弱或干扰

**解决方案**：
1. 靠近路由器
2. 切换到 5GHz WiFi（如果支持）
3. 检查网络连接质量

---

## 常见问题

### Q1：如何切换主题（明暗模式）？

在页面右上角点击主题切换按钮（太阳/月亮图标）。

---

### Q2：如何修改端口号？

编辑 `package.json`：
```json
"scripts": {
  "dev": "next dev --webpack -H 0.0.0.0 -p 3001"
}
```
将 `3001` 改为你想要的端口。

---

### Q3：启动时提示端口被占用？

**错误信息**：
```
Error: listen EADDRINUSE: address already in use :::3000
```

**解决方案**：

#### macOS / Linux
```bash
# 查找占用端口的进程
lsof -i :3000

# 杀死进程（替换 PID）
kill -9 [PID]
```

#### Windows
```bash
# 查找占用端口的进程
netstat -ano | findstr :3000

# 杀死进程（替换 PID）
taskkill /PID [PID] /F
```

或者修改端口号（参考 Q2）。

---

### Q4：数据库文件在哪里？

SQLite 数据库文件位于：
```
prisma/dev.db
```

相关文件：
- `prisma/dev.db`：数据库文件
- `prisma/dev.db-journal`：SQLite 日志文件（运行时临时文件）

---

### Q5：如何更新依赖？

```bash
# 检查可更新的包
npm outdated

# 更新所有依赖到最新版本
npm update

# 更新特定包
npm install [package-name]@latest
```

---

### Q6：如何停止开发服务器？

在运行 `npm run dev` 的终端窗口按 `Ctrl + C`。

---

### Q7：修改代码后需要重启吗？

**不需要！** Next.js 支持热更新（Hot Module Replacement）：
- 修改组件代码会自动刷新
- 修改样式会立即生效
- 修改配置文件（如 `tailwind.config.ts`）需要手动刷新浏览器

**例外情况**（需要重启）：
- 修改 `.env` 环境变量
- 修改 `next.config.ts`
- 安装新的 npm 包

---

### Q8：如何清除缓存？

```bash
# 删除 Next.js 缓存和构建文件
rm -rf .next

# 删除 node_modules 重新安装
rm -rf node_modules
npm install

# 重新生成 Prisma 客户端
npx prisma generate
```

---

### Q9：生产环境如何部署？

```bash
# 1. 构建生产版本
npm run build

# 2. 启动生产服务器
npm run start
```

**注意**：生产环境建议使用 PostgreSQL 或 MySQL 替代 SQLite。

---

### Q10：如何查看 API 接口文档？

项目 API 接口：

#### 设备管理
- `POST /api/devices`：注册新设备
- `GET /api/devices`：获取设备列表
- `PATCH /api/devices/[id]`：更新设备状态

#### 远程安装
- `POST /api/install-requests`：创建安装任务
- `GET /api/install-requests?deviceId=[id]`：查询设备任务
- `PATCH /api/install-requests/[taskId]`：更新任务状态

#### 应用管理
- `GET /api/admin/apps`：获取应用列表
- `POST /api/admin/apps`：创建新应用
- `GET /api/admin/apps/[id]`：获取应用详情
- `PUT /api/admin/apps/[id]`：更新应用
- `DELETE /api/admin/apps/[id]`：删除应用

详细 API 文档请参考：`docs/REMOTE_INSTALL.md`

---

## 开发工作流

### 日常开发

1. **启动开发服务器**
   ```bash
   npm run dev
   ```

2. **编辑代码**
   - 使用 VS Code 打开项目
   - 修改 `src/` 目录下的文件
   - 保存后自动刷新浏览器

3. **查看效果**
   - 浏览器访问 http://localhost:3000
   - 打开开发者工具调试

4. **提交代码**
   ```bash
   git add .
   git commit -m "描述你的修改"
   git push
   ```

---

### 代码规范

项目使用 ESLint 检查代码质量：
```bash
npm run lint
```

**推荐**：在 VS Code 中安装 ESLint 插件，实时提示代码问题。

---

### 数据库迁移

如果修改了 `prisma/schema.prisma`：

```bash
# 生成新的客户端代码
npx prisma generate

# 将修改同步到数据库
npx prisma db push

# 如果是生产环境，使用迁移
npx prisma migrate dev --name [迁移名称]
```

---

## 获取帮助

### 项目文档
- **架构文档**：`docs/ARCHITECTURE.md`
- **远程安装协议**：`docs/REMOTE_INSTALL.md`

### 相关技术文档
- **Next.js**：https://nextjs.org/docs
- **Prisma**：https://www.prisma.io/docs
- **Tailwind CSS**：https://tailwindcss.com/docs
- **React**：https://react.dev/

### 问题反馈
如果遇到问题，请在 GitHub Issues 提交：
https://github.com/JQ2020/O_PLAY/issues

---

## 总结

通过本文档，你应该能够：
- ✅ 成功搭建开发环境
- ✅ 启动项目并在浏览器访问
- ✅ 理解项目的基本结构和功能
- ✅ 管理数据库和添加数据
- ✅ 在手机上访问本地网站
- ✅ 解决常见问题

祝开发愉快！🎉
