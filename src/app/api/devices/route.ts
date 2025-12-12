import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const revalidate = 30; // ISR: revalidate every 30 seconds

export async function GET() {
  try {
    const devices = await prisma.device.findMany({
      orderBy: { lastSeen: "desc" },
      select: {
        id: true,
        name: true,
        platform: true,
        osVersion: true,
        appVersion: true,
        isOnline: true,
        lastSeen: true,
        createdAt: true,
        installTasks: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: {
            id: true,
            status: true,
            progress: true,
            message: true,
            createdAt: true,
            app: {
              select: {
                id: true,
                title: true,
                iconUrl: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(
      { devices },
      {
        headers: {
          "Cache-Control": "public, max-age=30, stale-while-revalidate=60",
        },
      }
    );
  } catch (error) {
    console.error("Failed to fetch devices", error);
    return NextResponse.json(
      { error: "Failed to fetch devices" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const { id, name, platform, osVersion, appVersion, pushToken, isOnline } =
      payload ?? {};

    if (!id || !name || !platform) {
      return NextResponse.json(
        { error: "id, name, and platform are required" },
        { status: 400 },
      );
    }

    const device = await prisma.device.upsert({
      where: { id },
      update: {
        name,
        platform,
        osVersion,
        appVersion,
        pushToken,
        isOnline: isOnline ?? true,
        lastSeen: new Date(),
      },
      create: {
        id,
        name,
        platform,
        osVersion,
        appVersion,
        pushToken,
        isOnline: isOnline ?? true,
      },
    });

    return NextResponse.json({ device });
  } catch (error) {
    console.error("Failed to upsert device", error);
    return NextResponse.json(
      { error: "Failed to upsert device" },
      { status: 500 },
    );
  }
}
