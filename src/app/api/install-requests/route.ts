import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
    include: {
      device: true,
      app: {
        select: { title: true, iconUrl: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take,
  });

  return NextResponse.json({ tasks });
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

    const normalizedStatus =
      typeof status === "string" &&
      validStatuses.has(status.toUpperCase() as Status)
        ? (status.toUpperCase() as Status)
        : "QUEUED";
    const initialProgress =
      normalizedStatus === "SUCCESS" ? 100 : 0;

    const task = await prisma.remoteInstallTask.create({
      data: {
        appId,
        deviceId,
        status: normalizedStatus,
        progress: initialProgress,
        downloadUrl:
          typeof downloadUrl === "string" && downloadUrl.length > 0
            ? downloadUrl
            : `https://example.com/artifacts/${toSlug(app.title)}.apk`,
        hash: typeof hash === "string" ? hash : null,
      },
      include: {
        device: true,
        app: {
          select: { title: true, iconUrl: true },
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
