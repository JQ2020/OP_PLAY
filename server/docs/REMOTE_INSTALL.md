# 远程安装（网页下发 → 手机 App）对接说明

本文描述网页点击“下载/安装”后，让手机端自动下载安装包的协议、接口与时序，适用于本地部署（同局域网或内网穿透）和后续上云版本。

## 核心思路
- 手机 App 登录后向服务端注册设备，保持在线（推送 token 或长连 WebSocket）。
- 网页点击“下发下载”时，后台创建一条 `RemoteInstallTask`，并通过推送/长连通知指定设备。
- 手机端收到指令后校验用户与签名，后台下载 APK/Bundle，使用系统安装器安装，并实时把状态回传接口。

## 数据模型（Prisma）
- `Device`：`id`(设备唯一标识)，`name`，`platform`(Android/iOS/Pad)，`osVersion`，`appVersion`，`pushToken`，`isOnline`，`lastSeen`，`createdAt`。
- `RemoteInstallTask`：`id`，`appId`，`deviceId`，`status`，`progress`(0-100)，`message`，`downloadUrl`，`hash`，`createdAt`，`updatedAt`。
- `InstallStatus` 取值：`QUEUED` | `DELIVERED` | `DOWNLOADING` | `INSTALLING` | `SUCCESS` | `FAILED` | `CANCELED`。

## REST 接口
所有接口走同域 `/api`，返回 JSON。

### 1) 注册 / 更新设备
`POST /api/devices`
```json
{
  "id": "op-find-x7",          // 设备唯一 ID（由 App 生成并持久化）
  "name": "OP Find X7",
  "platform": "Android",
  "osVersion": "14",
  "appVersion": "1.0.0",
  "pushToken": "fcm-or-self-token",
  "isOnline": true               // App 启动/前台时置 true，退后台可置 false
}
```
- 行为：存在则更新并刷新 `lastSeen`，不存在则创建。
- 响应：`{ device: Device }`

### 2) 获取设备列表
`GET /api/devices`
- 响应：`{ devices: Device[] }`（附带最近一条任务）

### 3) 创建远程安装任务
`POST /api/install-requests`
```json
{
  "appId": "<app uuid>",
  "deviceId": "op-find-x7",
  "downloadUrl": "https://example.com/artifacts/app.apk", // 可选，不传则服务端用占位地址
  "hash": "sha256-xxxxx",                                 // 可选
  "status": "QUEUED"                                      // 可选，默认 QUEUED
}
```
- 行为：写入一条任务，初始进度 0（SUCCESS 时为 100）。
- 响应：`{ task: RemoteInstallTask }`
- 推送：在真实环境请在此处触发 FCM/自研长连向设备推送指令。

### 4) 查询任务
`GET /api/install-requests?deviceId=...&appId=...&status=...&limit=20`
- 过滤条件均可选，默认返回最新 20 条。
- 响应：`{ tasks: RemoteInstallTask[] }`

### 5) 获取单条任务
`GET /api/install-requests/:id`
- 响应：`{ task: RemoteInstallTask }`

### 6) 更新任务状态（手机端调用）
`PATCH /api/install-requests/:id`
```json
{
  "status": "DOWNLOADING",   // 见 InstallStatus
  "progress": 65,            // 0-100，整数
  "message": "正在下载…",    // 可选
  "downloadUrl": "...",      // 可选，真实下载地址
  "hash": "sha256-..."       // 可选
}
```
- 行为：更新状态/进度/消息，`updatedAt` 自动刷新。
- 响应：`{ task: RemoteInstallTask }`

## 推荐终端时序（手机 App）
1. **登录后注册设备**：调用 `POST /api/devices`，附带 push token；保持长连或定期刷新 `isOnline + lastSeen`。
2. **接收指令**：推送或 WebSocket 收到 `{ taskId, appId, downloadUrl, hash }`。
3. **执行下载与安装**：
   - 前台服务 + WorkManager 下载；URL 建议短时有效并校验 `hash`。
   - 使用 `PackageInstaller` 触发安装（需用户授予未知来源安装权限）。
4. **状态回传**：关键节点调用 PATCH：
   - `DELIVERED`（收到指令）
   - `DOWNLOADING`（附进度）
   - `INSTALLING`
   - `SUCCESS` 或 `FAILED`（附 message）
5. **任务拉取兜底**：若推送失败，可定期 `GET /api/install-requests?deviceId=xxx&status=QUEUED` 拉取未处理任务。

## 本地部署建议
- 手机与网页服务器需可互通：同一 Wi‑Fi 局域网，或使用 ngrok / Cloudflare Tunnel 暴露本地端口。
- 真实推送不可用时，可用 WebSocket/长轮询模拟；网页端已提供任务列表刷新。

## 安全与鉴权（需按实际项目补齐）
- 所有请求应带用户登录态/JWT，校验 “用户-设备” 绑定关系。
- 任务指令可添加签名和过期时间，下载 URL 使用短效链接并校验 SHA256。
- 记录审计日志：谁在何时向哪台设备下发了哪个 App。

## 网页端实现说明
- 详情页新增“发送到你的设备”卡片：列表展示已注册设备，点击“下发下载”会调用 `POST /api/install-requests` 创建任务，并在下方“最近的远程安装”中实时显示状态。
- 数据轮询：页面每 8 秒刷新一次任务列表，可手动刷新设备/任务。
- 样例数据：种子里预置了 3 台设备和示例任务，便于联调。
