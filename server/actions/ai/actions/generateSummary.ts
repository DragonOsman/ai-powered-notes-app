"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

import { generateSummaryService } from "@/server/services/ai/generateSummary";

export async function generateSummary(noteId: string): Promise<string> {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  return generateSummaryService({
    userId: session.user.id,
    noteId
  });
}
