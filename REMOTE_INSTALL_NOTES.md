# 远程安装功能记录（当前仅网页与接口，移动端待接入）

## 已完成内容
- **接口**：`/api/devices`（注册/更新设备、列表）；`/api/install-requests`（创建/查询任务）；`/api/install-requests/:id`（获取/更新任务状态）。
- **数据模型**：新增 `Device`、`RemoteInstallTask`（状态字段字符串，支持 QUEUED/DELIVERED/DOWNLOADING/INSTALLING/SUCCESS/FAILED/CANCELED）。
- **前端**：应用详情页增加“发送到你的设备”卡片，列出已注册设备，一键下发安装任务，并轮询最近安装状态。
- **种子数据**：预置 3 台示例设备与安装任务，便于演示（执行 `npx prisma db seed` 可刷新）。
- **文档**：完整对接说明见 `docs/REMOTE_INSTALL.md`（接口字段、状态流转、本地联调建议）。

## 快速验证（无移动端）
1. `npx prisma db seed`（确保数据库包含示例设备/任务）。
2. 打开任一应用详情页，找到“发送到你的设备”卡片：
   - 列表应显示示例设备。
   - 点击“下发下载”会创建一条新任务并出现在“最近的远程安装”列表。
3. 调用接口模拟设备回调：
   ```bash
   curl -X PATCH http://localhost:3000/api/install-requests/<taskId> \
     -H "Content-Type: application/json" \
     -d '{"status":"SUCCESS","progress":100,"message":"模拟完成"}'
   ```
   刷新页面可看到状态更新。

## 移动端对接待办
- App 登录后调用 `POST /api/devices` 注册设备（带 push token/长连标识），并周期刷新 `isOnline/lastSeen`。
- 推送/长连收到指令 `{taskId, appId, downloadUrl, hash}` 后下载并安装（建议前台服务 + WorkManager，校验哈希）。
- 关键节点回调 `PATCH /api/install-requests/:id` 更新状态与进度。
- 若推送不可用，可定期 `GET /api/install-requests?deviceId=xxx&status=QUEUED` 拉取任务。

## 注意事项
- 当前接口未接入鉴权，后续需绑定登录态/JWT 并校验“用户-设备”关系。
- 下载链接应改为真实短效 URL，并校验哈希以防篡改。
- 目前状态刷新为前端轮询（8 秒），未来可切 WebSocket/SSE。
