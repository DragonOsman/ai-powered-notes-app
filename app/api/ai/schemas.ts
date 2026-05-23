import { z } from "zod";

export const tagsResponseSchema = z.object({
  tags: z.array(
    z.string().min(1).max(30)
  )
});

export const todosResponseSchema = z.object({
  todos: z.array(
    z.object({
      task: z.string()
    })
  )
});