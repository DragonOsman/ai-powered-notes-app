import { connectToDatabase } from "@/lib/db";
import { Note } from "@/models/Note";
import { noteSchema } from "@/lib/schemas/note";
import type { INote } from "@/types/note";

interface UpdateNoteInput {
  userId: string;
  id: string;
  title: string;
  content: string;
}

export async function updateNoteService(input: UpdateNoteInput): Promise<INote> {
  const validated = noteSchema.parse({
    title: input.title,
    content: input.content
  });

  await connectToDatabase();

  const note = await Note.findOneAndUpdate(
    {
      _id: input.id,
      userId: input.userId
    },
    {
      title: validated.title,
      content: validated.content
    },
    {
      new: true
    }
  ).lean();

  if (!note) {
    throw new Error("Note not found");
  }

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