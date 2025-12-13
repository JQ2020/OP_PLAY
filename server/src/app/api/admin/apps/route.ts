import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const ICON_POOL = [
  "/icons/app1.jpg",
  "/icons/app2.jpg",
  "/icons/app3.jpg",
  "/icons/app4.jpg",
  "/icons/app5.jpg",
  "/icons/app6.jpg",
  "/icons/app7.jpg",
  "/icons/app8.jpg",
  "/icons/app9.jpg",
  "/icons/app10.jpg",
  "/icons/app11.jpg",
  "/icons/app12.jpg",
];

export async function GET() {
  try {
    const apps = await prisma.app.findMany({
      orderBy: { updatedAt: "desc" },
    });
    return NextResponse.json(apps);
  } catch (error) {
    console.error("Error fetching apps:", error);
    return NextResponse.json(
      { error: "Failed to fetch apps" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const { title, developer, category, rating, downloads, size, version, description } = data;

    if (!title || !developer) {
      return NextResponse.json(
        { error: "Title and Developer are required" },
        { status: 400 }
      );
    }

    const iconIndex = (title.length + developer.length) % ICON_POOL.length;
    const iconUrl = ICON_POOL[iconIndex];

    const app = await prisma.app.create({
      data: {
        title,
        developer,
        category: category || "Apps",
        rating: rating || 4.5,
        downloads: downloads || "1M+",
        size: size || "50 MB",
        version: version || "1.0.0",
        description: description || `${title} by ${developer}. Added via admin console.`,
        iconUrl,
        isInstalled: false,
      },
    });

    return NextResponse.json(app, { status: 201 });
  } catch (error) {
    console.error("Error creating app:", error);
    return NextResponse.json(
      { error: "Failed to create app" },
      { status: 500 }
    );
  }
}
