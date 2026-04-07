import { z } from "zod";
import {
  nameSchema,
  emailSchema,
  passwordSchema,
  withConfirmPassword,
} from "@/lib/validators";

export const signUpSchema = withConfirmPassword(
  z.object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
  })
);

export const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});