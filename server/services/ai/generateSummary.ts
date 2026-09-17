import Groq from "groq-sdk";

import { getNoteService } from "@/server/services/notes/getNote";
import { Note } from "@/models/Note";
import { connectToDatabase } from "@/lib/db";

const grok = new Groq({
  apiKey: process.env.GROK_API_KEY
});

const MODEL = "llama-3.3-70b-versatile";

interface GenerateSummaryInput {
  userId: string;
  noteId: string;
}

export async function generateSummaryService({
  userId,
  noteId
}: GenerateSummaryInput): Promise<string> {
  const note = await getNoteService(userId, noteId);

  if (!note) {
    throw new Error("Note not found");
  }

  const completion = await grok.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: "system",
        content: "Summarize the user's note concisely. Return only the summary."
      },
      {
        role: "user",
        content: note.content
      }
    ],
    temperature: 0.2,
    max_completion_tokens: 512
  });

  const summary = completion.choices[0]?.message.content?.trim();

  if (!summary) {
    throw new Error("The AI returned an empty summary.");
  }

  await connectToDatabase();

  await Note.updateOne(
    {
      _id: noteId,
      userId
    },
    {
      $set: {
        summary
      }
    }
  );

  return summary;
}