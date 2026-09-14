import { createNoteTool } from "./createNoteTool";
import { deleteNoteTool } from "./deleteNoteTool";
import { getNoteTool } from "./getNoteTool";
import { getNotesTool } from "./getNotesTool";
import { updateNoteTool } from "./updateNoteTool";

export const aiTools = [
  createNoteTool,
  deleteNoteTool,
  getNoteTool,
  getNotesTool,
  updateNoteTool
];

export const aiToolDefinitions = aiTools.map(
  (tool) => tool.definition
);
