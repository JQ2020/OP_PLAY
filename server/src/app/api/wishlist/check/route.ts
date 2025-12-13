import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");
  const appId = request.nextUrl.searchParams.get("appId");

  if (!userId || !appId) {
    return NextResponse.json({ error: "userId and appId are required" }, { status: 400 });
  }

  try {
    const item = await prisma.wishlist.findUnique({
      where: {
        userId_appId: { userId, appId },
      },
    });
    return NextResponse.json({ inWishlist: !!item });
  } catch (error) {
    console.error("Wishlist check error:", error);
    return NextResponse.json({ error: "Failed to check wishlist" }, { status: 500 });
  }
}
