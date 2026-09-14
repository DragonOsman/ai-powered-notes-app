import { connectToDatabase } from "@/lib/db";
import { Note } from "@/models/Note";

export async function deleteNoteService(userId: string, id: string): Promise<void> {
  await connectToDatabase();

  const note = await Note.findOneAndDelete({
    _id: id,
    userId
  }).lean();

  if (!note) {
    throw new Error("Note not found");
  }
}