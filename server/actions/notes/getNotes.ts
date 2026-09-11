"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { connectToDatabase } from "@/lib/db";
import { Note } from "@/models/Note";

export async function getNotes() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  await connectToDatabase();

  const notes = await Note.find({
    userId: session.user.id
  }).sort({
    updatedAt: -1
  });

  return notes.map((note) => ({
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
  }));
}