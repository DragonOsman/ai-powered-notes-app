"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { archiveNoteService } from "@/server/services/notes/archiveNote";
import type { INote } from "@/types/note";

export async function archiveNote(id: string): Promise<INote> {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  return archiveNoteService({
    id,
    userId: session.user.id
  });
}