"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getNoteService } from "@/server/services/notes/getNote";
import { INote } from "@/types/note";

export async function getNote(noteId: string): Promise<INote | null> {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  return getNoteService(
    session.user.id,
    noteId
  );
}