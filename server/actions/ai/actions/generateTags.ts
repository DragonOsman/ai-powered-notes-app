"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

import { generateTagsService } from "@/server/services/ai/generateTags";
import { tagsResponseSchema } from "@/lib/validators";

export async function generateTags(noteId: string): Promise<string[]> {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  return generateTagsService({
    userId: session.user.id,
    noteId
  });
}