"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { connectToDatabase } from "@/lib/db";
import { Note } from "@/models/Note";
import { noteSchema } from "@/lib/schemas/note";

export async function createNote(formData: {
  title: string;
  content: string;
}) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const validated = noteSchema.parse(formData);
  await connectToDatabase();

  const note = await Note.create({
    userId: session.user.id,
    title: validated.title,
    content: validated.content
  });

  return {
    id: note._id.toString(),
    userId: note.userId,
    title: note.title,
    content: note.content,
    summary: note.summary,
    archived: note.archived,
    tags: note.tags,
    todos: note.todos,
    createdAt: note.createdAt,
    updatedAt: note.updatedAt
  };
}