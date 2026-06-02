"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { connectToDatabase } from "@/lib/db";
import { Note } from "@/models/Note";
import { noteSchema } from "@/lib/schemas/note";

export async function updateNote(
  id: string,
  title: string,
  content: string
) {
  const session =
    await auth.api.getSession({
      headers: await headers()
    });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const validated =
    noteSchema.parse({
      title,
      content
    });

  await connectToDatabase();

  const updated = await Note.findOneAndUpdate(
      {
        _id: id,
        userId: session.user.id
      },
      {
        title: validated.title,
        content: validated.content
      },
      {
        new: true
      }
    )
    .lean()
  ;

  if (!updated) {
    throw new Error("Note not found");
  }

  return JSON.parse(
    JSON.stringify(updated)
  );
}