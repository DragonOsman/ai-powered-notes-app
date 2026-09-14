"use server";

import { getNote } from "@/server/actions/notes/getNote";

export const getNoteTool = {
  definition: {
    type: "function" as const,
    function: {
      name: "get_note",
      description: "Retrieve a specific note belonging to the authenticating user.",
      parameters: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "The ID of the note to retrieve."
          }
        },
        required: ["id"],
        additionalProperties: false
      }
    }
  },

  execute: async (argumentsJson: string) => {
    const args = JSON.parse(argumentsJson) as {
      id: string
    };

    const note = await getNote(args.id);
    if (!note) {
      return {
        success: false,
        error: "Note not found."
      };
    }

    return {
      success: true,
      note: {
        id: note.id,
        title: note.title
      }
    };
  }
};