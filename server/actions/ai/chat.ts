"use server";

import Groq from "groq-sdk";

import {
  aiTools,
  aiToolDefinitions
} from "./tools";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const MAX_TOOL_ITERATIONS = 5;

const systemPrompt = `
You are the AI assistant for a personal notes application.

You help the authenticated user manage their notes.

You can:
- create notes
- retrieve notes
- retrieve a specific note
- update notes
- request deletion of notes

Rules:

1. Only operate on the authenticated user's notes.
2. Never invent a note ID.
3. If you need a note ID, retrieve the user's notes first.
4. Never claim that an operation succeeded unless the tool reports success.
5. Deleting a note is destructive and requires explicit user confirmation.
6. Be concise and helpful.
`;

export interface AIChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AIChatResponse {
  message: string;
  confirmation?: {
    action: "delete_note";
    noteId: string;
  };
}

export async function chatWithAI(
  messages: AIChatMessage[]
): Promise<AIChatResponse> {
  const conversation: Groq.Chat.ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: systemPrompt
    },
    ...messages
  ];

  for (
    let iteration = 0;
    iteration < MAX_TOOL_ITERATIONS;
    iteration++
  ) {
    const completion =
      await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: conversation,
        tools: aiToolDefinitions,
        tool_choice: "auto",
        temperature: 0.2,
        max_completion_tokens: 2048
      });

    const responseMessage =
      completion.choices[0]?.message;

    if (!responseMessage) {
      throw new Error(
        "The AI returned an empty response."
      );
    }

    if (
      !responseMessage.tool_calls ||
      responseMessage.tool_calls.length === 0
    ) {
      return {
        message:
          responseMessage.content ??
          "I couldn't generate a response."
      };
    }

    conversation.push(responseMessage);

    for (const toolCall of responseMessage.tool_calls) {
      if (toolCall.type !== "function") {
        continue;
      }

      const tool = aiTools.find(
        (candidate) =>
          candidate.definition.function.name ===
          toolCall.function.name
      );

      if (!tool) {
        conversation.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: JSON.stringify({
            success: false,
            error: "Unknown tool."
          })
        });

        continue;
      }

      const result = await tool.execute(
        toolCall.function.arguments
      );

      if (
        typeof result === "object" &&
        result !== null &&
        "requiresConfirmation" in result &&
        result.requiresConfirmation === true
      ) {
        return {
          message:
            "This action requires your confirmation before I can continue.",
          confirmation: {
            action: "delete_note",
            noteId: result.noteId
          }
        };
      }

      conversation.push({
        role: "tool",
        tool_call_id: toolCall.id,
        content: JSON.stringify(result)
      });
    }
  }

  throw new Error(
    "The AI assistant exceeded the maximum number of tool-call iterations."
  );
}