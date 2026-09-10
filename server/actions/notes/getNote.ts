"user server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { connectToDatabase } from "@/lib/db";
import { Note } from "@/models/Note";

export async function getNote(noteId: string) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  await connectToDatabase();

  const note = await Note.findOne({
    id: noteId,
    userId: session.user.id
  });

  if (!note) {
    return null;
  }

  return JSON.parse(JSON.stringify(note));
}