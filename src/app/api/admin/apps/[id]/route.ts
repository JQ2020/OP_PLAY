import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const app = await prisma.app.findUnique({
      where: { id },
    });

    if (!app) {
      return NextResponse.json({ error: "App not found" }, { status: 404 });
    }

    return NextResponse.json(app);
  } catch (error) {
    console.error("Error fetching app:", error);
    return NextResponse.json(
      { error: "Failed to fetch app" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();

    const { title, developer, category, rating, downloads, size, version, description } = data;

    const app = await prisma.app.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(developer && { developer }),
        ...(category && { category }),
        ...(rating !== undefined && { rating }),
        ...(downloads && { downloads }),
        ...(size && { size }),
        ...(version && { version }),
        ...(description && { description }),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(app);
  } catch (error) {
    console.error("Error updating app:", error);
    return NextResponse.json(
      { error: "Failed to update app" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.app.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting app:", error);
    return NextResponse.json(
      { error: "Failed to delete app" },
      { status: 500 }
    );
  }
}
