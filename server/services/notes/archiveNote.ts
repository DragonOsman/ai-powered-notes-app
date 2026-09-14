import { connectToDatabase } from "@/lib/db";
import { Note } from "@/models/Note";
import type { INote } from "@/types/note";

interface ArchiveNoteInput {
  userId: string;
  id: string;
}

export async function archiveNoteService(input: ArchiveNoteInput) {
  await connectToDatabase();

  const archivedNote = await Note.findOneAndUpdate(
    {
      _id: input.id,
      userId: input.userId
    },
    {
      archived: true
    },
    {
      new: true
    }
  ).lean();

  if (!archivedNote) {
    throw new Error("Note not found");
  }

  return {
    id: archivedNote._id.toString(),
    userId: archivedNote.userId,
    title: archivedNote.title,
    content: archivedNote.content,
    summary: archivedNote.summary,
    archived: archivedNote.archived,
    tags: archivedNote.tags,
    todos: archivedNote.todos,
    createdAt: archivedNote.createdAt,
    updatedAt: archivedNote.updatedAt
  };
}