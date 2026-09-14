"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { createNoteService } from "@/server/services/notes/createNote";
import type { INote } from "@/types/note";

export async function createNote(formData: {
  title: string;
  content: string;
}): Promise<INote> {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  return createNoteService({
    userId: session.user.id,
    title: formData.title,
    content: formData.content
  });
}