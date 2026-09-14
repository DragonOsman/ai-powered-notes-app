"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { deleteNoteService } from "@/server/services/notes/deleteNote";

export async function deleteNote(id: string) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  await deleteNoteService(session.user.id, id);

  return {
    success: true
  };
}