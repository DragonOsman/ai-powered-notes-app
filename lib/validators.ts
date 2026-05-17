import { z } from "zod";

/* ------------------ */
/* Base primitives    */
/* ------------------ */

export const requiredString = (field: string) => z
  .string()
  .min(2, `${field} must be at least 2 characters`)
  .max(100, `${field} must be at most 100 characters`)
;

export const trimmedString = z.string().trim();

/* ------------------ */
/* Auth fields        */
/* ------------------ */

export const nameSchema = trimmedString
  .min(2, "Name must be at least 2 characters")
  .max(100, "Name must be at most 100 characters")
;

export const emailSchema = z.email("Invalid email address").trim();

export const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters")
;

/* ------------------ */
/* Note fields        */
/* ------------------ */

export const titleSchema = trimmedString
  .min(1, "Title is too short")
  .max(200, "Title too long")
;

export const contentSchema = trimmedString.min(2, "Content must be at least 2 characters");

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