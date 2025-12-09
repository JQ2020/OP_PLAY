import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const devices = await prisma.device.findMany({
      orderBy: { lastSeen: "desc" },
      include: {
        installTasks: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    return NextResponse.json({ devices });
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
