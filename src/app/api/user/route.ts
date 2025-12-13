import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, email, password, name } = body;

    if (action === "register") {
      if (!email || !password || !name) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
      }

      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        return NextResponse.json({ error: "Email already registered" }, { status: 409 });
      }

      const user = await prisma.user.create({
        data: { email, password, name },
        select: { id: true, name: true, email: true, avatar: true, createdAt: true },
      });

      return NextResponse.json(user, { status: 201 });
    }

    if (action === "login") {
      if (!email || !password) {
        return NextResponse.json({ error: "Email and password required" }, { status: 400 });
      }

      const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true, name: true, email: true, avatar: true, password: true, createdAt: true },
      });

      if (!user || user.password !== password) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }

      const { password: _, ...userWithoutPassword } = user;
      return NextResponse.json(userWithoutPassword);
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("User API error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
