import { z } from "zod";
import { titleSchema, contentSchema } from "@/lib/validators";

export const noteSchema = z.object({
  title: titleSchema,
  content: contentSchema,
});