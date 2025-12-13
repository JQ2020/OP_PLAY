import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  try {
    const body = await request.json();
    const { rating, content } = body;

    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
    }

    const existingReview = await prisma.review.findUnique({ where: { id } });
    if (!existingReview) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    const review = await prisma.review.update({
      where: { id },
      data: {
        ...(rating !== undefined && { rating }),
        ...(content !== undefined && { content }),
      },
    });

    if (rating !== undefined) {
      await updateAppRating(review.appId);
    }

    return NextResponse.json(review);
  } catch {
    return NextResponse.json({ error: "Failed to update review" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  try {
    const existingReview = await prisma.review.findUnique({ where: { id } });
    if (!existingReview) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    const appId = existingReview.appId;

    await prisma.review.delete({ where: { id } });

    await updateAppRating(appId);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
  }
}

async function updateAppRating(appId: string) {
  const reviews = await prisma.review.findMany({
    where: { appId },
    select: { rating: true },
  });

  if (reviews.length === 0) {
    await prisma.app.update({
      where: { id: appId },
      data: { rating: 0 },
    });
    return;
  }

  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  await prisma.app.update({
    where: { id: appId },
    data: { rating: Math.round(avgRating * 10) / 10 },
  });
}
