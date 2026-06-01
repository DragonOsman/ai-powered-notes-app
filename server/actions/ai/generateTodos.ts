"use server";

import { getNotes } from "@/server/actions/notes/getNotes";
import { Note, INote } from "@/models/Note";
import { connectToDatabase } from "@/lib/db";
import { safeCompletion } from "@/app/api/ai/safeCompletion";
import { TODO_PROMPT } from "@/app/api/ai/prompts";
import { todosResponseSchema } from "@/lib/validators";

export async function generateTodos(noteId: string) {
  const notes: INote[] = await getNotes();
  const note: INote | undefined = notes.find((n: INote) => n.id === noteId);

  let todos = "";
  if (note) {
    todos = await safeCompletion({
      system: TODO_PROMPT,
      user: note.content
    });
  }
  await connectToDatabase();

  const validated = todosResponseSchema.parse(JSON.parse(todos));
  await Note.findByIdAndUpdate(noteId, {
    todos: validated.todos
  });

  return validated.todos;
}