import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const app = await prisma.app.findUnique({
      where: { id },
      include: {
        screenshots: {
          select: { id: true, url: true },
        },
        reviews: {
          take: 5,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            userName: true,
            userImage: true,
            rating: true,
            content: true,
            createdAt: true,
          },
        },
        _count: {
          select: { reviews: true },
        },
      },
    });

    if (!app) {
      return NextResponse.json({ error: "App not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        app: {
          ...app,
          reviewCount: app._count.reviews,
        },
      },
      {
        headers: {
          "Cache-Control": "public, max-age=60, stale-while-revalidate=120",
        },
      }
    );
  } catch (error) {
    console.error("Failed to fetch app", error);
    return NextResponse.json({ error: "Failed to fetch app" }, { status: 500 });
  }
}
