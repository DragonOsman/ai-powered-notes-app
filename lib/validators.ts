import { z } from "zod";

/* ------------------ */
/* Base primitives    */
/* ------------------ */

export const requiredString = (field: string) => z.string().min(1, `${field} is required`);

export const trimmedString = z.string().trim();

/* ------------------ */
/* Auth fields        */
/* ------------------ */

export const nameSchema = trimmedString
  .min(1, "Name is required")
  .max(100, "Name too long");

export const emailSchema = trimmedString
  .toLowerCase()
  .email("Invalid email");

export const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters");

/* ------------------ */
/* Note fields        */
/* ------------------ */

export const titleSchema = trimmedString
  .min(1, "Title is required")
  .max(200, "Title too long");

export const contentSchema = trimmedString.min(1, "Content is required");

/* ------------------ */
/* Helpers            */
/* ------------------ */

export const withConfirmPassword = <
  T extends z.ZodObject<{ password: z.ZodTypeAny }>
>(
  schema: T
) => {
  return schema
    .extend({
      confirmPassword: z.string(),
    })
    .superRefine((data, ctx) => {
      if (data.password !== data.confirmPassword) {
        ctx.addIssue({
          message: "Passwords must match",
          path: ["confirmPassword"],
          code: "custom"
        });
      }
    });
};