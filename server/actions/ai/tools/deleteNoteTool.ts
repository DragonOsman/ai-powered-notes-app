"use server";

import { deleteNote } from "@/server/actions/notes/deleteNote";

interface DeleteNoteConfirmation {
  success: false;
  requiresConfirmation: true;
  action: "delete_note";
  noteId: string;
  message: string;
}

export const deleteNoteTool = {
  definition: {
    type: "function" as const,
    function: {
      name: "delete_note",
      description: "Request deletion of a note belonging to the authenticated user. Deleting a note is destructive and requires explicit confirmation from the user.",
      parameters: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "The ID of the note to delete."
          }
        },
        required: ["id"],
        additionalProperties: false
      }
    }
  },

  execute: async (argumentJson: string) => {
    const args = JSON.parse(argumentJson) as {
      id: string;
    };

    return {
      success: false,
      requiresConfirmation: true,
      action: "delete_note" as const,
      noteId: args.id,
      message: "User confirmation is required before deleting this note."
    } as DeleteNoteConfirmation;
  },

  executeConfirmed: async (noteId: string) => {
    await deleteNote(noteId);

    return {
      success: true,
      noteId
    };
  }
};