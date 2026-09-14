"use server";

import { updateNote } from "@/server/actions/notes/updateNote";
import { string } from "zod";

export const updateNoteTool = {
  definition: {
    type: "function" as const,
    function: {
      name: "update_note",
      description: "Update an existing note belonging to the authenticated user. Use this when the user explicitly asks you to edit or change a note.",
      parameters: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "The ID of the note to update."
          },
          title: {
            type: "string",
            description: "The new title of the note."
          },
          content: {
            type: "string",
            description: "The new content of the note."
          }
        },
        required: ["id", "title", "content"],
        additionalProperties: false
      }
    }
  },

  execute: async (argumentJson: string) => {
    const args = JSON.parse(argumentJson) as {
      id: string;
      title: string;
      content: string;
    };

    const note = await updateNote(
      args.id,
      args.title,
      args.content
    );

    return {
      success: true,
      note: {
        id: note.id,
        title: note.title
      }
    };
  }
};