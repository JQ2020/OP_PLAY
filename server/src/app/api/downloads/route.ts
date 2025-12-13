import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, appId } = body;

    if (!userId || !appId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const download = await prisma.downloadHistory.upsert({
      where: {
        userId_appId: { userId, appId },
      },
      update: {
        createdAt: new Date(),
      },
      create: {
        userId,
        appId,
      },
      include: {
        app: {
          select: { id: true, title: true, iconUrl: true },
        },
      },
    });

    return NextResponse.json(download, { status: 201 });
  } catch (error) {
    console.error("Download history API error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
