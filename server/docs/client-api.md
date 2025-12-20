# O Play - 客户端 API 对接文档

## 概述

本文档描述了 O Play 客户端 App 的完整 API 对接方案，包括：
1. **应用浏览** - 获取应用列表、详情、搜索
2. **设备管理** - 设备注册、心跳保活
3. **下载安装** - 客户端发起下载、Web 端远程下发、进度同步

### 两种下载场景

| 场景 | 发起方 | 流程 |
|------|--------|------|
| **客户端直接下载** | 客户端 App | 用户在 App 内点击下载 → 创建任务 → 模拟下载 → 完成 |
| **Web 远程下发** | Web 端 | 用户在 Web 选择设备 → 创建任务 → 客户端轮询获取 → 执行下载 |

---

## API 基础信息

- **Base URL**: `http://your-server.com`（替换为实际服务器地址）
- **Content-Type**: `application/json`
- **字符编码**: `UTF-8`

---

# 一、应用相关 API

## 1.1 获取应用列表

获取应用商店的应用列表，支持分页、分类筛选、搜索和排序。

### 请求

```
GET /api/apps
```

### 查询参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| limit | number | ❌ | 每页数量，默认 20，最大 50 |
| cursor | string | ❌ | 分页游标（上一页返回的 nextCursor） |
| category | string | ❌ | 分类筛选（如 "社交"、"游戏"） |
| search | string | ❌ | 搜索关键词（搜索标题、开发者、描述） |
| q | string | ❌ | 同 search，搜索关键词 |
| sort | string | ❌ | 排序方式：`rating`（评分）、`downloads`（下载量）、默认按标题 |

### 请求示例

```
GET /api/apps?limit=20&category=社交&sort=rating
GET /api/apps?search=微信&limit=10
GET /api/apps?cursor=xxx&limit=20
```

### 响应示例

```json
{
  "items": [
    {
      "id": "app-uuid-001",
      "title": "微信",
      "developer": "Tencent",
      "iconUrl": "https://example.com/icons/wechat.png",
      "rating": 4.5,
      "downloads": "10亿+",
      "category": "社交",
      "size": "256.8 MB",
      "version": "8.0.43",
      "updatedAt": "2024-01-15T10:00:00.000Z"
    },
    {
      "id": "app-uuid-002",
      "title": "QQ",
      "developer": "Tencent",
      "iconUrl": "https://example.com/icons/qq.png",
      "rating": 4.3,
      "downloads": "5亿+",
      "category": "社交",
      "size": "189.2 MB",
      "version": "9.0.15",
      "updatedAt": "2024-01-14T08:00:00.000Z"
    }
  ],
  "nextCursor": "app-uuid-002",
  "hasMore": true
}
```

### 分页使用

```kotlin
// 首次请求
GET /api/apps?limit=20

// 加载更多（使用上次返回的 nextCursor）
GET /api/apps?limit=20&cursor=app-uuid-020
```

---

## 1.2 获取应用详情

获取单个应用的详细信息，包括截图、评论等。

### 请求

```
GET /api/apps/{appId}
```

### 响应示例

```json
{
  "app": {
    "id": "app-uuid-001",
    "title": "微信",
    "developer": "Tencent",
    "iconUrl": "https://example.com/icons/wechat.png",
    "description": "微信是一款跨平台的通讯工具...",
    "rating": 4.5,
    "downloads": "10亿+",
    "category": "社交",
    "size": "256.8 MB",
    "version": "8.0.43",
    "isInstalled": false,
    "updatedAt": "2024-01-15T10:00:00.000Z",
    "releaseDate": "2011-01-21T00:00:00.000Z",
    "screenshots": [
      { "id": "ss-001", "url": "https://example.com/screenshots/wechat-1.png" },
      { "id": "ss-002", "url": "https://example.com/screenshots/wechat-2.png" }
    ],
    "reviews": [
      {
        "id": "review-001",
        "userName": "用户A",
        "userImage": "https://example.com/avatars/user-a.png",
        "rating": 5,
        "content": "非常好用的应用",
        "createdAt": "2024-01-10T12:00:00.000Z"
      }
    ],
    "reviewCount": 12580
  }
}
```

---

# 二、设备管理 API

## 2.1 设备注册 / 心跳

客户端启动时注册设备，之后定期发送心跳保持在线状态。

### 请求

```
POST /api/devices
```

### 请求参数

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | ✅ | 设备唯一标识（推荐使用 Android ID 或自定义 UUID） |
| name | string | ✅ | 设备名称（如 "OP Find X6 Pro"） |
| platform | string | ✅ | 平台标识（如 "Android"） |
| osVersion | string | ❌ | 系统版本（如 "Android 14"） |
| appVersion | string | ❌ | 客户端 App 版本（如 "1.0.0"） |
| pushToken | string | ❌ | 推送 Token（FCM/华为推送等） |
| isOnline | boolean | ❌ | 是否在线，默认 true |

### 请求示例

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "name": "OP Find X6 Pro",
  "platform": "Android",
  "osVersion": "Android 14",
  "appVersion": "1.2.0",
  "pushToken": "fcm_token_xxx",
  "isOnline": true
}
```

### 响应示例

```json
{
  "device": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "name": "OP Find X6 Pro",
    "platform": "Android",
    "osVersion": "Android 14",
    "appVersion": "1.2.0",
    "pushToken": "fcm_token_xxx",
    "isOnline": true,
    "lastSeen": "2024-01-15T10:30:00.000Z",
    "createdAt": "2024-01-10T08:00:00.000Z"
  }
}
```

### 使用建议

```
1. App 启动时：调用注册接口
2. 每 5 分钟：发送心跳（相同接口，会更新 lastSeen）
3. App 进入后台：可选发送 isOnline: false
4. App 回到前台：发送 isOnline: true
```

---

# 三、下载安装 API

## 3.1 创建下载任务

**客户端直接下载** 或 **Web 远程下发** 都使用此接口创建任务。

### 请求

```
POST /api/install-requests
```

### 请求参数

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| appId | string | ✅ | 应用 ID |
| deviceId | string | ✅ | 设备 ID |
| downloadUrl | string | ❌ | 自定义下载地址（默认自动生成） |
| status | string | ❌ | 初始状态，默认 "QUEUED" |

### 请求示例

```json
{
  "appId": "app-uuid-001",
  "deviceId": "device-uuid-001"
}
```

### 响应示例

```json
{
  "task": {
    "id": "task-uuid-001",
    "appId": "app-uuid-001",
    "deviceId": "device-uuid-001",
    "status": "QUEUED",
    "progress": 0,
    "message": null,
    "downloadUrl": "https://example.com/artifacts/wechat.apk",
    "hash": null,
    "simulateDuration": 12000,
    "fileSize": "256.8 MB",
    "downloadSpeed": null,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "device": {
      "id": "device-uuid-001",
      "name": "OP Find X6 Pro",
      "platform": "Android",
      "osVersion": "Android 14",
      "isOnline": true
    },
    "app": {
      "id": "app-uuid-001",
      "title": "微信",
      "iconUrl": "https://example.com/icons/wechat.png"
    }
  }
}
```

### 关键字段说明

| 字段 | 说明 |
|------|------|
| `simulateDuration` | 模拟下载时长（毫秒），客户端据此模拟进度动画 |
| `fileSize` | 文件大小，用于 UI 展示 |
| `downloadUrl` | 下载地址（模拟场景下可忽略） |

---

## 3.2 获取任务列表

获取指定设备的下载任务列表。

### 请求

```
GET /api/install-requests?deviceId={deviceId}
```

### 查询参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| deviceId | string | ✅ | 设备 ID |
| appId | string | ❌ | 筛选指定应用的任务 |
| status | string | ❌ | 筛选指定状态的任务 |
| limit | number | ❌ | 返回数量，默认 20，最大 50 |

### 任务状态说明

| 状态 | 说明 | 客户端行为 |
|------|------|-----------|
| `QUEUED` | 任务已创建，等待处理 | 开始下载流程 |
| `DELIVERED` | 已下发到设备 | 开始下载 |
| `DOWNLOADING` | 下载中 | 显示进度，继续下载 |
| `INSTALLING` | 安装中 | 显示安装动画 |
| `SUCCESS` | 安装成功 | 显示完成状态 |
| `FAILED` | 安装失败 | 显示失败原因，允许重试 |
| `CANCELED` | 已取消 | 无需处理 |

### 响应示例

```json
{
  "tasks": [
    {
      "id": "task-uuid-001",
      "status": "DOWNLOADING",
      "progress": 45,
      "message": "115.6 MB / 256.8 MB",
      "downloadUrl": "https://example.com/artifacts/wechat.apk",
      "simulateDuration": 12000,
      "fileSize": "256.8 MB",
      "downloadSpeed": "8.5 MB/s",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:45.000Z",
      "device": { ... },
      "app": {
        "id": "app-uuid-001",
        "title": "微信",
        "iconUrl": "https://example.com/icons/wechat.png"
      }
    }
  ]
}
```

---

## 3.3 获取单个任务详情

### 请求

```
GET /api/install-requests/{taskId}
```

### 响应示例

```json
{
  "task": {
    "id": "task-uuid-001",
    "status": "DOWNLOADING",
    "progress": 65,
    "message": "167.0 MB / 256.8 MB",
    "downloadUrl": "https://example.com/artifacts/wechat.apk",
    "hash": "sha256:abc123...",
    "simulateDuration": 12000,
    "fileSize": "256.8 MB",
    "downloadSpeed": "8.5 MB/s",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:31:05.000Z",
    "device": { ... },
    "app": { ... }
  }
}
```

---

## 3.4 更新任务状态

客户端更新下载/安装进度。

### 请求

```
PATCH /api/install-requests/{taskId}
```

### 请求参数

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| status | string | ❌ | 任务状态 |
| progress | number | ❌ | 进度百分比（0-100） |
| message | string | ❌ | 状态描述信息 |

### 请求示例

**开始下载：**
```json
{
  "status": "DOWNLOADING",
  "progress": 0,
  "message": "开始下载..."
}
```

**更新下载进度：**
```json
{
  "status": "DOWNLOADING",
  "progress": 65,
  "message": "167.0 MB / 256.8 MB"
}
```

**开始安装：**
```json
{
  "status": "INSTALLING",
  "progress": 100,
  "message": "正在安装..."
}
```

**安装成功：**
```json
{
  "status": "SUCCESS",
  "progress": 100,
  "message": "安装完成"
}
```

**安装失败：**
```json
{
  "status": "FAILED",
  "progress": 0,
  "message": "安装失败：存储空间不足"
}
```

---

# 四、客户端实现指南

## 4.1 客户端直接下载流程

用户在 App 内点击下载按钮时：

```
┌─────────────────────────────────────────────────────────────┐
│  用户点击下载                                                │
│       ↓                                                     │
│  POST /api/install-requests 创建任务                        │
│       ↓                                                     │
│  获取 simulateDuration 和 fileSize                          │
│       ↓                                                     │
│  客户端模拟下载进度动画（根据 simulateDuration）              │
│       ↓                                                     │
│  定期 PATCH 更新进度到服务端（可选，用于 Web 端同步显示）     │
│       ↓                                                     │
│  模拟完成后更新状态为 SUCCESS                                │
└─────────────────────────────────────────────────────────────┘
```

### Kotlin 实现示例

```kotlin
class DownloadManager(private val api: ApiService) {

    /**
     * 用户点击下载按钮
     */
    suspend fun startDownload(appId: String, deviceId: String): DownloadTask {
        // 1. 创建下载任务
        val response = api.createInstallRequest(
            CreateTaskRequest(appId = appId, deviceId = deviceId)
        )
        val task = response.task

        // 2. 启动模拟下载
        simulateDownload(task)

        return task
    }

    /**
     * 模拟下载进度
     */
    private suspend fun simulateDownload(task: DownloadTask) {
        val duration = task.simulateDuration // 模拟时长（毫秒）
        val fileSize = parseFileSize(task.fileSize) // 解析文件大小

        val startTime = System.currentTimeMillis()

        // 更新状态为下载中
        api.updateTask(task.id, UpdateTaskRequest(
            status = "DOWNLOADING",
            progress = 0,
            message = "开始下载..."
        ))

        // 模拟进度更新
        while (true) {
            val elapsed = System.currentTimeMillis() - startTime
            val progress = calculateProgress(elapsed, duration)

            if (progress >= 100) break

            // 计算模拟的已下载大小和速度
            val downloaded = (fileSize * progress / 100).toLong()
            val speed = calculateSpeed(elapsed, downloaded)

            // 更新 UI
            onProgressUpdate(task.id, progress, downloaded, fileSize, speed)

            // 可选：同步到服务端（建议每 5% 或每秒更新一次）
            if (progress % 5 == 0) {
                api.updateTask(task.id, UpdateTaskRequest(
                    status = "DOWNLOADING",
                    progress = progress,
                    message = "${formatSize(downloaded)} / ${task.fileSize}"
                ))
            }

            delay(100) // 100ms 更新一次 UI
        }

        // 模拟安装阶段
        api.updateTask(task.id, UpdateTaskRequest(
            status = "INSTALLING",
            progress = 100,
            message = "正在安装..."
        ))

        delay(2000) // 模拟安装耗时 2 秒

        // 安装完成
        api.updateTask(task.id, UpdateTaskRequest(
            status = "SUCCESS",
            progress = 100,
            message = "安装完成"
        ))

        onDownloadComplete(task.id)
    }

    /**
     * 计算进度（使用缓动函数让进度更真实）
     */
    private fun calculateProgress(elapsed: Long, duration: Int): Int {
        val linearProgress = (elapsed.toFloat() / duration).coerceIn(0f, 1f)

        // 缓动函数：开始快，中间稳，结尾慢
        val easedProgress = when {
            linearProgress < 0.3f -> (linearProgress / 0.3f) * 0.4f
            linearProgress < 0.85f -> 0.4f + ((linearProgress - 0.3f) / 0.55f) * 0.5f
            else -> 0.9f + ((linearProgress - 0.85f) / 0.15f) * 0.1f
        }

        return (easedProgress * 100).toInt().coerceIn(0, 100)
    }
}
```

---

## 4.2 Web 远程下发处理流程

Web 端下发任务后，客户端需要轮询获取并处理：

```
┌─────────────────────────────────────────────────────────────┐
│  客户端定期轮询 GET /api/install-requests?deviceId=xxx      │
│       ↓                                                     │
│  发现新任务（status = QUEUED）                              │
│       ↓                                                     │
│  开始处理任务（同上述模拟下载流程）                          │
│       ↓                                                     │
│  更新进度到服务端                                           │
│       ↓                                                     │
│  Web 端实时显示进度                                         │
└─────────────────────────────────────────────────────────────┘
```

### Kotlin 实现示例

```kotlin
class TaskPollingService(
    private val api: ApiService,
    private val downloadManager: DownloadManager
) {
    private var pollingJob: Job? = null
    private val processedTasks = mutableSetOf<String>()

    fun startPolling(deviceId: String) {
        pollingJob = CoroutineScope(Dispatchers.IO).launch {
            while (isActive) {
                try {
                    val response = api.getTasks(deviceId)
                    val newTasks = response.tasks.filter {
                        it.status == "QUEUED" && it.id !in processedTasks
                    }

                    // 处理新任务
                    newTasks.forEach { task ->
                        processedTasks.add(task.id)
                        launch {
                            downloadManager.processRemoteTask(task)
                        }
                    }

                    // 动态调整轮询间隔
                    val hasActiveTasks = response.tasks.any {
                        it.status in listOf("QUEUED", "DOWNLOADING", "INSTALLING")
                    }
                    delay(if (hasActiveTasks) 1000L else 5000L)

                } catch (e: Exception) {
                    delay(10000L) // 错误时延长间隔
                }
            }
        }
    }

    fun stopPolling() {
        pollingJob?.cancel()
    }
}
```

---

## 4.3 心跳保活

```kotlin
class HeartbeatService(private val api: ApiService) {

    private var heartbeatJob: Job? = null

    fun start(device: Device) {
        heartbeatJob = CoroutineScope(Dispatchers.IO).launch {
            while (isActive) {
                try {
                    api.registerDevice(device.copy(isOnline = true))
                    delay(5 * 60 * 1000L) // 5 分钟
                } catch (e: Exception) {
                    delay(60 * 1000L) // 失败后 1 分钟重试
                }
            }
        }
    }

    fun stop() {
        heartbeatJob?.cancel()
    }
}
```

---

# 五、数据结构定义

## App

```typescript
interface App {
  id: string;
  title: string;
  developer: string;
  iconUrl: string;
  description: string;
  rating: number;          // 评分 1-5
  downloads: string;       // 如 "10亿+"
  category: string;
  size: string;            // 如 "256.8 MB"
  version: string;
  isInstalled: boolean;
  updatedAt: string;       // ISO 8601
  releaseDate: string;
  screenshots?: Screenshot[];
  reviews?: Review[];
  reviewCount?: number;
}

interface Screenshot {
  id: string;
  url: string;
}

interface Review {
  id: string;
  userName: string;
  userImage?: string;
  rating: number;
  content: string;
  createdAt: string;
}
```

## Device

```typescript
interface Device {
  id: string;
  name: string;
  platform: string;
  osVersion?: string;
  appVersion?: string;
  pushToken?: string;
  isOnline: boolean;
  lastSeen: string;
  createdAt: string;
}
```

## InstallTask

```typescript
interface InstallTask {
  id: string;
  appId: string;
  deviceId: string;
  status: "QUEUED" | "DELIVERED" | "DOWNLOADING" | "INSTALLING" | "SUCCESS" | "FAILED" | "CANCELED";
  progress: number;           // 0-100
  message?: string;
  downloadUrl?: string;
  hash?: string;
  simulateDuration: number;   // 模拟下载时长（毫秒）
  fileSize: string;           // 如 "256.8 MB"
  downloadSpeed?: string;     // 如 "8.5 MB/s"
  createdAt: string;
  updatedAt: string;
  device?: Device;
  app?: {
    id: string;
    title: string;
    iconUrl: string;
  };
}
```

---

# 六、错误处理

## HTTP 状态码

| 状态码 | 说明 |
|--------|------|
| 200 | 成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

## 错误响应格式

```json
{
  "error": "错误描述信息"
}
```

## 常见错误处理

| 错误场景 | 建议处理方式 |
|----------|-------------|
| 网络超时 | 重试，使用指数退避 |
| 404 App 不存在 | 提示用户应用已下架 |
| 404 Task 不存在 | 从本地任务列表移除 |
| 500 服务器错误 | 提示稍后重试 |

---

# 七、API 接口汇总

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/apps` | GET | 获取应用列表（支持搜索、分类、排序） |
| `/api/apps/{id}` | GET | 获取应用详情 |
| `/api/devices` | POST | 设备注册/心跳 |
| `/api/install-requests` | GET | 获取任务列表 |
| `/api/install-requests` | POST | 创建下载任务 |
| `/api/install-requests/{id}` | GET | 获取任务详情 |
| `/api/install-requests/{id}` | PATCH | 更新任务状态 |

---

# 八、测试环境

- **测试服务器**: `http://localhost:3000`（本地开发）
- **Prisma Studio**: `http://localhost:5556`（数据库管理）

### 快速测试流程

```bash
# 1. 启动服务器
npm run dev

# 2. 注册设备
curl -X POST http://localhost:3000/api/devices \
  -H "Content-Type: application/json" \
  -d '{"id":"test-device-001","name":"Test Phone","platform":"Android"}'

# 3. 获取应用列表
curl http://localhost:3000/api/apps?limit=5

# 4. 创建下载任务
curl -X POST http://localhost:3000/api/install-requests \
  -H "Content-Type: application/json" \
  -d '{"appId":"<appId>","deviceId":"test-device-001"}'

# 5. 查看任务进度
curl http://localhost:3000/api/install-requests?deviceId=test-device-001
```

---

**文档版本**: v2.0
**更新日期**: 2024-01-15
