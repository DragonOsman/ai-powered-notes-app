import Groq from "groq-sdk";

import { getNoteService } from "@/server/services/notes/getNote";
import { todosResponseSchema } from "@/lib/validators";
import { notEqual } from "node:assert";
import { todo } from "node:test";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const MODEL = "llama-3.3-70b-versatile";

interface GenerateTodosInput {
  userId: string;
  noteId: string;
}

export async function generateTodosService({
  userId,
  noteId
}: GenerateTodosInput): Promise<{ task: string }[]> {
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
          Extract actionable tasks from the note.

          Return JSON only in this format:
            {
              "todos": [
                {
                  "task": "..."
                }
              ]
            }

          Only include genuine actionable tasks.
        `.trim()
      },
      {
        role: "user",
        content: note.content
      }
    ],
    temperature: 0.2,
    max_completion_tokens: 512,
    response_format: {
      type: "json_object"
    }
  });

  const content = completion.choices[0]?.message.content?.trim();

  if (!content) {
    throw new Error("The AI returned empty todos.");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error("The AI returned invalid JSON.");
  }

  const validated = todosResponseSchema.safeParse(parsed);

  if (!validated.success) {
    throw new Error("The AI returned invalid todos.");
  }

  return validated.data.todos;
}