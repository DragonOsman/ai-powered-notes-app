import { connectToDatabase } from "@/lib/db";
import { Note } from "@/models/Note";
import type { INote } from "@/types/note";

export async function getNotesService(userId: string): Promise<INote[]> {
  await connectToDatabase();

  const notes = await Note.find({
    userId
  }).sort({
    updatedAt: -1
  }).lean();

  return notes.map(note => ({
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