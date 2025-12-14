import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const apk = await prisma.apkVersion.findFirst({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });

  if (!apk) {
    return NextResponse.json(
      {
        version: "1.0.0",
        versionCode: 1,
        fileSize: "25 MB",
        releaseNote: "Initial release",
        downloadUrl: "/apk/op-play.apk",
        isActive: true,
      },
      { status: 200 }
    );
  }

  return NextResponse.json(apk);
}
