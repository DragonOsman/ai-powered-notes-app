import { connectToDatabase } from "@/lib/db";
import { Note } from "@/models/Note";
import type { INote } from "@/types/note";

export async function getNoteService(
  userId: string,
  id: string
): Promise<INote | null> {
  await connectToDatabase();

  const note = await Note.findOne({
    _id: id,
    userId
  }).lean();

  if (!note) {
    return null;
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