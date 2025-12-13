import type { InstallStatus } from "@/types/remote";

type SimulationResult = {
  status: InstallStatus;
  progress: number;
  downloadSpeed: string;
  message: string;
};

/**
 * 根据经过的时间计算模拟的下载进度
 * @param elapsedMs 任务创建后经过的毫秒数
 * @param totalDurationMs 模拟的总下载时长
 * @param fileSize 文件大小字符串
 */
export function calculateSimulatedProgress(
  elapsedMs: number,
  totalDurationMs: number,
  fileSize: string
): SimulationResult {
  // 阶段划分
  const queuedDuration = 800;           // QUEUED 阶段
  const deliveredDuration = 1200;       // DELIVERED 阶段
  const installingDuration = 2000;      // INSTALLING 阶段

  const downloadStart = queuedDuration + deliveredDuration;
  const downloadEnd = totalDurationMs - installingDuration;
  const downloadDuration = downloadEnd - downloadStart;

  // 解析文件大小（MB）
  const fileSizeMB = parseFloat(fileSize) || 45;

  // QUEUED 阶段
  if (elapsedMs < queuedDuration) {
    return {
      status: "QUEUED",
      progress: 0,
      downloadSpeed: "",
      message: "等待下载...",
    };
  }

  // DELIVERED 阶段
  if (elapsedMs < downloadStart) {
    return {
      status: "DELIVERED",
      progress: 0,
      downloadSpeed: "",
      message: "已下发到设备",
    };
  }

  // DOWNLOADING 阶段
  if (elapsedMs < downloadEnd) {
    const downloadElapsed = elapsedMs - downloadStart;
    const linearProgress = downloadElapsed / downloadDuration;

    // 使用缓动函数让进度更真实
    // 开始快(0-30%), 中间稳定(30-85%), 最后慢(85-100%)
    let progress: number;
    if (linearProgress < 0.3) {
      // 前30%时间完成0-40%进度（快速启动）
      progress = (linearProgress / 0.3) * 0.4;
    } else if (linearProgress < 0.85) {
      // 中间55%时间完成40-90%进度（稳定下载）
      progress = 0.4 + ((linearProgress - 0.3) / 0.55) * 0.5;
    } else {
      // 最后15%时间完成90-100%进度（收尾减速）
      progress = 0.9 + ((linearProgress - 0.85) / 0.15) * 0.1;
    }

    const progressPercent = Math.min(Math.round(progress * 100), 99);

    // 计算模拟下载速度（添加随机波动）
    const baseSpeed = fileSizeMB / (downloadDuration / 1000);
    const fluctuation = 0.8 + Math.random() * 0.4; // 80%-120%波动
    const speed = baseSpeed * fluctuation;
    const speedStr = speed >= 1
      ? `${speed.toFixed(1)} MB/s`
      : `${(speed * 1024).toFixed(0)} KB/s`;

    // 计算已下载大小
    const downloadedMB = (progress * fileSizeMB).toFixed(1);

    return {
      status: "DOWNLOADING",
      progress: progressPercent,
      downloadSpeed: speedStr,
      message: `${downloadedMB} MB / ${fileSize}`,
    };
  }

  // INSTALLING 阶段
  if (elapsedMs < totalDurationMs) {
    const installElapsed = elapsedMs - downloadEnd;
    const installProgress = installElapsed / installingDuration;

    let message = "正在安装...";
    if (installProgress < 0.3) {
      message = "正在验证安装包...";
    } else if (installProgress < 0.6) {
      message = "正在安装应用...";
    } else {
      message = "正在配置应用...";
    }

    return {
      status: "INSTALLING",
      progress: 100,
      downloadSpeed: "",
      message,
    };
  }

  // SUCCESS 阶段
  return {
    status: "SUCCESS",
    progress: 100,
    downloadSpeed: "",
    message: "安装完成",
  };
}

/**
 * 生成随机的模拟下载时长（毫秒）
 * 范围：8-15秒
 */
export function generateSimulateDuration(): number {
  return 8000 + Math.floor(Math.random() * 7000);
}

/**
 * 生成随机的文件大小
 */
export function generateFileSize(): string {
  const sizes = [
    "12.4 MB", "23.8 MB", "35.2 MB", "45.6 MB", "56.3 MB",
    "67.1 MB", "78.9 MB", "89.4 MB", "102.3 MB", "128.7 MB",
  ];
  return sizes[Math.floor(Math.random() * sizes.length)];
}
