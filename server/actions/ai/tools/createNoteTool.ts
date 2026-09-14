"use server";

import { createNote } from "@/server/actions/notes/createNote";

export const createNoteTool = {
  definition: {
    type: "function" as const,
    function: {
      name: "create_note",
      description:
        "Create a new note for the authenticated user. Use this when the user explicitly asks you to create or save a note.",
      parameters: {
        type: "object",
        properties: {
          title: {
            type: "string",
            description: "The title of the note to create."
          },
          content: {
            type: "string",
            description: "The content of the note to create."
          }
        },
        required: ["title", "content"],
        additionalProperties: false
      }
    }
  },

  execute: async (argumentsJson: string) => {
    const args = JSON.parse(argumentsJson) as {
      title: string;
      content: string;
    };

    const note = await createNote({
      title: args.title,
      content: args.content
    });

    return {
      success: true,
      note: {
        id: note.id,
        title: note.title
      }
    };
  }
};