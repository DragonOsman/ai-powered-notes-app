"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

import { generateTitleService } from "@/server/services/ai/generateTitle";

export async function generateTitle(noteId: string): Promise<string> {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  return generateTitleService({
    userId: session.user.id,
    noteId
  });
}