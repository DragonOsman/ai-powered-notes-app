import Groq from "groq-sdk";

import { getNoteService } from "@/server/services/notes/getNote";
import { tagsResponseSchema } from "@/lib/validators";
import { Note } from "@/models/Note";
import { connectToDatabase } from "@/lib/db";
import { connect } from "node:http2";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const MODEL = "llama-3.3-70b-versatile";

interface GenerateTagsInput {
  userId: string;
  noteId: string;
}

export async function generateTagsService({
  userId,
  noteId
}: GenerateTagsInput): Promise<string[]> {
  const note = await getNoteService(userId, noteId);

  if (!note) {
    throw new Error("Note not found.");
  }

  const completion = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: "system",
        content: `
          Generate up to 5 relevant tags for the note.

          Return JSON only in this format:
          {
            "tags": ["tag-one", "tag-two"]
          }

          Tags must:
            - be lowercase
            - contain only letters, numbers, and hyphens
            - be unique
            - be no longer than 30 characters
        `.trim()
      },
      {
        role: "user",
        content: note.content
      }
    ],
    temperature: 0.2,
    max_completion_tokens: 256,
    response_format: {
      type: "json_object"
    }
  });

  const content = completion.choices[0]?.message.content?.trim();

  if (!content) {
    throw new Error("The AI returned empty tags.");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error("The AI returned invalid JSON.");
  }

  const validated = tagsResponseSchema.safeParse(parsed);
  if (!validated.success) {
    throw new Error("The AI returned invalid tags.");
  }

  await connectToDatabase();

  await Note.updateOne(
    {
      _id: noteId,
      userId
    },
    {
      $set: {
        tags: validated.data.tags
      }
    }
  )

  return validated.data.tags;
}