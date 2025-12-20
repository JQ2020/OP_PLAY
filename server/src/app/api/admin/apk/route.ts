import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const versions = await prisma.apkVersion.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(versions);
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  const { version, versionCode, fileSize, releaseNote, downloadUrl } = data;

  if (!version) {
    return NextResponse.json(
      { error: "Version is required" },
      { status: 400 }
    );
  }

  // Deactivate all existing versions
  await prisma.apkVersion.updateMany({
    where: { isActive: true },
    data: { isActive: false },
  });

  // Create new active version
  const apkVersion = await prisma.apkVersion.create({
    data: {
      version,
      versionCode: versionCode || 1,
      fileSize: fileSize || "25 MB",
      releaseNote: releaseNote || "",
      downloadUrl: downloadUrl || "/apk/o-play.apk",
      isActive: true,
    },
  });

  return NextResponse.json(apkVersion, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const data = await request.json();
  const { id, version, versionCode, fileSize, releaseNote, downloadUrl, isActive } = data;

  if (!id) {
    return NextResponse.json(
      { error: "ID is required" },
      { status: 400 }
    );
  }

  // If setting this version as active, deactivate others first
  if (isActive) {
    await prisma.apkVersion.updateMany({
      where: { isActive: true, id: { not: id } },
      data: { isActive: false },
    });
  }

  const apkVersion = await prisma.apkVersion.update({
    where: { id },
    data: {
      ...(version && { version }),
      ...(versionCode !== undefined && { versionCode }),
      ...(fileSize && { fileSize }),
      ...(releaseNote !== undefined && { releaseNote }),
      ...(downloadUrl && { downloadUrl }),
      ...(isActive !== undefined && { isActive }),
    },
  });

  return NextResponse.json(apkVersion);
}
