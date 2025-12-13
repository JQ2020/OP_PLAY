import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  calculateSimulatedProgress,
  generateSimulateDuration,
  generateFileSize,
} from "@/lib/simulate-progress";

// Keep as force-dynamic for real-time updates, but add cache headers
export const dynamic = "force-dynamic";

const statusValues = [
  "QUEUED",
  "DELIVERED",
  "DOWNLOADING",
  "INSTALLING",
  "SUCCESS",
  "FAILED",
  "CANCELED",
] as const;
type Status = (typeof statusValues)[number];
const validStatuses = new Set<Status>(statusValues);

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const deviceId = searchParams.get("deviceId") ?? undefined;
  const appId = searchParams.get("appId") ?? undefined;
  const status = searchParams.get("status") ?? undefined;
  const limitParam = Number(searchParams.get("limit") ?? 20);
  const take = Number.isFinite(limitParam)
    ? Math.min(Math.max(limitParam, 1), 50)
    : 20;

  const where: Record<string, unknown> = {};
  if (deviceId) where.deviceId = deviceId;
  if (appId) where.appId = appId;
  const normalizedStatus =
    typeof status === "string" ? status.toUpperCase() : undefined;

  if (normalizedStatus && validStatuses.has(normalizedStatus as Status)) {
    where.status = normalizedStatus;
  }

  const tasks = await prisma.remoteInstallTask.findMany({
    where,
    select: {
      id: true,
      status: true,
      progress: true,
      message: true,
      downloadUrl: true,
      simulateDuration: true,
      fileSize: true,
      downloadSpeed: true,
      createdAt: true,
      updatedAt: true,
      device: {
        select: {
          id: true,
          name: true,
          platform: true,
          isOnline: true,
        },
      },
      app: {
        select: {
          id: true,
          title: true,
          iconUrl: true,
          category: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take,
  });

  // 计算模拟进度并更新未完成的任务
  const now = Date.now();
  const processedTasks = await Promise.all(
    tasks.map(async (task) => {
      // 跳过已完成/失败/取消的任务
      if (["SUCCESS", "FAILED", "CANCELED"].includes(task.status)) {
        return task;
      }

      const elapsedMs = now - new Date(task.createdAt).getTime();
      const simulation = calculateSimulatedProgress(
        elapsedMs,
        task.simulateDuration,
        task.fileSize
      );

      // 如果状态或进度有变化，更新数据库
      if (task.status !== simulation.status || task.progress !== simulation.progress) {
        await prisma.remoteInstallTask.update({
          where: { id: task.id },
          data: {
            status: simulation.status,
            progress: simulation.progress,
            message: simulation.message,
            downloadSpeed: simulation.downloadSpeed || null,
          },
        });
      }

      return {
        ...task,
        status: simulation.status,
        progress: simulation.progress,
        message: simulation.message,
        downloadSpeed: simulation.downloadSpeed,
      };
    })
  );

  return NextResponse.json(
    { tasks: processedTasks },
    {
      headers: {
        "Cache-Control": "private, max-age=1, stale-while-revalidate=2",
      },
    }
  );
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const { appId, deviceId, downloadUrl, hash, status } = payload ?? {};

    if (!appId || !deviceId) {
      return NextResponse.json(
        { error: "appId and deviceId are required" },
        { status: 400 },
      );
    }

    const [app, device] = await Promise.all([
      prisma.app.findUnique({ where: { id: appId } }),
      prisma.device.findUnique({ where: { id: deviceId } }),
    ]);

    if (!app) {
      return NextResponse.json({ error: "App not found" }, { status: 404 });
    }

    if (!device) {
      return NextResponse.json({ error: "Device not found" }, { status: 404 });
    }

    // Delete existing tasks for the same app on the same device (simulate reinstall/update)
    await prisma.remoteInstallTask.deleteMany({
      where: {
        appId,
        deviceId,
      },
    });

    const normalizedStatus =
      typeof status === "string" &&
      validStatuses.has(status.toUpperCase() as Status)
        ? (status.toUpperCase() as Status)
        : "QUEUED";
    const initialProgress =
      normalizedStatus === "SUCCESS" ? 100 : 0;

    // 生成模拟参数
    const simulateDuration = generateSimulateDuration();
    const fileSize = app.size || generateFileSize();

    const task = await prisma.remoteInstallTask.create({
      data: {
        appId,
        deviceId,
        status: normalizedStatus,
        progress: initialProgress,
        simulateDuration,
        fileSize,
        downloadUrl:
          typeof downloadUrl === "string" && downloadUrl.length > 0
            ? downloadUrl
            : `https://example.com/artifacts/${toSlug(app.title)}.apk`,
        hash: typeof hash === "string" ? hash : null,
      },
      include: {
        device: true,
        app: {
          select: { id: true, title: true, iconUrl: true },
        },
      },
    });

    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    console.error("Failed to create install request", error);
    return NextResponse.json(
      { error: "Failed to create install request" },
      { status: 500 },
    );
  }
}
