import Groq from "groq-sdk";

import { getNoteService } from "@/server/services/notes/getNote";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const MODEL = "llama-3.3-70b-versatile";

interface generateTitleInput {
  userId: string;
  noteId: string;
}

export async function generateTitleService({
  userId,
  noteId
}: generateTitleInput): Promise<string> {
  const note = await getNoteService(userId, noteId);

  if (!note) {
    throw new Error("Note not found.");
  }

  const completion = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: "system",
        content: "Generate a concise, descriptive title for the user's note. Return only the title."
      },
      {
        role: "user",
        content: note.content
      }
    ],
    temperature: 0.2,
    max_completion_tokens: 100
  });

  const title = completion.choices[0]?.message.content?.trim();

  if (!title) {
    throw new Error("The AI returned an empty title.");
  }

  return title;
}