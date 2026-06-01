"use server";

import { getNotes } from "@/server/actions/notes/getNotes";
import { Note, INote } from "@/models/Note";
import { connectToDatabase } from "@/lib/db";
import { safeCompletion } from "@/app/api/ai/safeCompletion";
import { TAGS_PROMPT } from "@/app/api/ai/prompts";
import { tagsResponseSchema } from "@/lib/validators";

export async function generateTags(noteId: string) {
  const notes: INote[] = await getNotes();
  const note: INote | undefined = notes.find((n: INote) => n.id === noteId);

  let tags = "";
  if (note) {
    tags = await safeCompletion({
      system: TAGS_PROMPT,
      user: note.content
    });
  }
  await connectToDatabase();

  const validated = tagsResponseSchema.parse(JSON.parse(tags));
  await Note.findOneAndUpdate({
    id: noteId,
    tags: validated.tags
  });

  return validated.tags;
}