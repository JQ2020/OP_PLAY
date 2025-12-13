import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  try {
    const wishlist = await prisma.wishlist.findMany({
      where: { userId },
      include: {
        app: {
          select: { id: true, title: true, iconUrl: true, developer: true, rating: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(wishlist);
  } catch (error) {
    console.error("Wishlist GET error:", error);
    return NextResponse.json({ error: "Failed to fetch wishlist" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, appId } = body;

    if (!userId || !appId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const wishlistItem = await prisma.wishlist.create({
      data: { userId, appId },
      include: {
        app: {
          select: { id: true, title: true, iconUrl: true, developer: true, rating: true },
        },
      },
    });

    return NextResponse.json(wishlistItem, { status: 201 });
  } catch (error) {
    console.error("Wishlist POST error:", error);
    return NextResponse.json({ error: "Failed to add to wishlist" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, appId } = body;

    if (!userId || !appId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await prisma.wishlist.delete({
      where: {
        userId_appId: { userId, appId },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Wishlist DELETE error:", error);
    return NextResponse.json({ error: "Failed to remove from wishlist" }, { status: 500 });
  }
}
