import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const revalidate = 60; // ISR: revalidate every 60 seconds

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get("cursor");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);
    const category = searchParams.get("category");
    const search = searchParams.get("search") || searchParams.get("q");
    const sort = searchParams.get("sort"); // rating, downloads, title

    // 构建查询条件
    const whereClause: Record<string, unknown> = {};

    if (category) {
      whereClause.category = category;
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search } },
        { developer: { contains: search } },
        { description: { contains: search } },
      ];
    }

    // 构建排序
    let orderBy: Record<string, string> = { title: "asc" };
    if (sort === "rating") {
      orderBy = { rating: "desc" };
    } else if (sort === "downloads") {
      orderBy = { downloads: "desc" };
    }

    const apps = await prisma.app.findMany({
      where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
      take: limit + 1,
      ...(cursor && { skip: 1, cursor: { id: cursor } }),
      select: {
        id: true,
        title: true,
        developer: true,
        iconUrl: true,
        rating: true,
        downloads: true,
        category: true,
        size: true,
        version: true,
        updatedAt: true,
      },
      orderBy,
    });

    const hasMore = apps.length > limit;
    const items = hasMore ? apps.slice(0, -1) : apps;

    return NextResponse.json(
      {
        items,
        nextCursor: hasMore ? items[items.length - 1].id : null,
        hasMore,
      },
      {
        headers: {
          "Cache-Control": "public, max-age=60, stale-while-revalidate=120",
        },
      }
    );
  } catch (error) {
    console.error("Failed to fetch apps", error);
    return NextResponse.json(
      { error: "Failed to fetch apps" },
      { status: 500 }
    );
  }
}
