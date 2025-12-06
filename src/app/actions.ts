 "use server";

import { prisma } from "@/lib/prisma";

export async function markAppInstalled(appId: string) {
  if (!appId) return;

  try {
    await prisma.app.update({
      where: { id: appId },
      data: { isInstalled: true },
    });
  } catch (error) {
    console.error("Failed to mark app installed", error);
  }
}
