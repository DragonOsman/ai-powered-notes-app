"use server";

import { auth } from "@/lib/auth";
import { generateTodosService } from "@/server/services/ai/generateTodos";
import { headers } from "next/headers";

export async function generateTodos(noteId: string) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  return generateTodosService({
    userId: session.user.id,
    noteId
  });
}