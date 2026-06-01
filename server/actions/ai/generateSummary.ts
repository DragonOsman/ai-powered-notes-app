"use server";

import { getNotes } from "@/server/actions/notes/getNotes";
import { Note, INote } from "@/models/Note";
import { connectToDatabase } from "@/lib/db";
import { safeCompletion } from "@/app/api/ai/safeCompletion";
import { SUMMARY_PROMPT } from "@/app/api/ai/prompts";

export async function generateSummary(noteId: string) {
  const notes: INote[] = await getNotes();
  const note: INote | undefined = notes.find((n: INote) => n.id === noteId);

  let summary = "";

  if (note) {
    summary = await safeCompletion({
      system: SUMMARY_PROMPT,
      user: note.content
    });
  }
  await connectToDatabase();

  await Note.findOneAndUpdate({
    id: noteId,
    summary
  });

  return summary;
}
