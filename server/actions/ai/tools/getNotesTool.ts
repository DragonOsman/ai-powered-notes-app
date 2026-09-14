"use server";

import { getNotes } from "@/server/actions/notes/getNotes";

export const getNotesTool = {
  definition: {
    type: "function" as const,
    function: {
      name: "get_notes",
      description: "Retrieve the authenticated user's notes. Use this when the user asks to see, find, or inspect their notes.",
      parameters: {
        type: "object",
        properties: {},
        additionalProperties: false
      }
    }
  },

  execute: async () => {
    const notes = await getNotes();

    return {
      success: true,
      notes: notes.map(note => ({
        id: note.id,
        title: note.title
      }))
    };
  }
};