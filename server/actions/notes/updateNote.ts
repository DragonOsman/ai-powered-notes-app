"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { INote } from "@/types/note";
import { updateNoteService } from "@/server/services/notes/updateNote";

export async function updateNote(
  id: string,
  title: string,
  content: string
): Promise<INote> {
  const session =
    await auth.api.getSession({
      headers: await headers()
    });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  return updateNoteService({
    userId: session.user.id,
    id,
    title,
    content
  });
}