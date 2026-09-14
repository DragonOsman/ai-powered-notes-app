"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getNotesService } from "@/server/services/notes/getNotes";
import { INote } from "@/types/note";

export async function getNotes(): Promise<INote[]> {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  return getNotesService(session.user.id);
}