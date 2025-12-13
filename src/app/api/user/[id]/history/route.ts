import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id: userId } = await params;
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get("type");

  try {
    if (type === "reviews") {
      const reviews = await prisma.review.findMany({
        where: { userId },
        include: {
          app: {
            select: { id: true, title: true, iconUrl: true, developer: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(reviews);
    }

    if (type === "downloads") {
      const downloads = await prisma.downloadHistory.findMany({
        where: { userId },
        include: {
          app: {
            select: { id: true, title: true, iconUrl: true, developer: true, rating: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(downloads);
    }

    return NextResponse.json({ error: "Invalid type parameter" }, { status: 400 });
  } catch (error) {
    console.error("User history API error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
