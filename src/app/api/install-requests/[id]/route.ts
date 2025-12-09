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

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const task = await prisma.remoteInstallTask.findUnique({
    where: { id: params.id },
    include: {
      device: true,
      app: { select: { title: true, iconUrl: true } },
    },
  });

  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  return NextResponse.json({ task });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const payload = await req.json();
    const { status, progress, message, downloadUrl, hash } = payload ?? {};

    const updates: Record<string, unknown> = {};

    if (typeof status === "string") {
      const normalizedStatus = status.toUpperCase();
      if (!validStatuses.has(normalizedStatus as Status)) {
        return NextResponse.json(
          { error: "Invalid status value" },
          { status: 400 },
        );
      }
      updates.status = normalizedStatus;
    }

    if (typeof progress === "number" && !Number.isNaN(progress)) {
      const clamped = Math.max(0, Math.min(100, Math.round(progress)));
      updates.progress = clamped;
    }

    if (typeof message === "string") {
      updates.message = message;
    }

    if (typeof downloadUrl === "string") {
      updates.downloadUrl = downloadUrl;
    }

    if (typeof hash === "string") {
      updates.hash = hash;
    }

    const existing = await prisma.remoteInstallTask.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const task = await prisma.remoteInstallTask.update({
      where: { id: params.id },
      data: updates,
      include: {
        device: true,
        app: { select: { title: true, iconUrl: true } },
      },
    });

    return NextResponse.json({ task });
  } catch (error) {
    console.error("Failed to update install request", error);
    return NextResponse.json(
      { error: "Failed to update install request" },
      { status: 500 },
    );
  }
}
