"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { connectToDatabase } from "@/lib/db";
import { Note } from "@/models/Note";

export async function deleteNote(id: string) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  await connectToDatabase();

  const deleted = await Note.findOneAndDelete({
    _id: id,
    userId: session.user.id
  });

  if (!deleted) {
    throw new Error("Note not found");
  }

  return {
    success: true
  };
}