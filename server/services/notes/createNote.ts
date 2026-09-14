import { connectToDatabase } from "@/lib/db";
import { Note } from "@/models/Note";
import { noteSchema } from "@/lib/schemas/note";
import { INote } from "@/types/note";

interface CreateNoteInput {
  userId: string;
  title: string;
  content: string;
}

export async function createNoteService(input: CreateNoteInput): Promise<INote> {
  const validated = noteSchema.parse({
    title: input.title,
    content: input.content
  });

  await connectToDatabase();

  const note = await Note.create({
    userId: input.userId,
    title: validated.title,
    content: validated.content
  });

  return {
    id: note._id.toString(),
    userId: note.userId,
    title: note.title,
    content: note.content,
    archived: note.archived,
    summary: note.summary,
    todos: note.todos,
    tags: note.tags,
    createdAt: note.createdAt,
    updatedAt: note.updatedAt
  };
}