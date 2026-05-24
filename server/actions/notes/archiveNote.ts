"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { connectToDatabase } from "@/lib/db";
import { Note } from "@/models/Note";

export async function archiveNote(id: string) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  await connectToDatabase();

  return await Note.findOneAndUpdate(
      {
        _id: id,
        userId: session.user.id
      },
      {
        archived: true
      },
      {
        new: true
      }
    )
  ;
}