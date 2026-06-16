"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function changePassword(values: {
  currentPassword: string;
  newPassword: string;
}) {
  return auth.api.changePassword({
    headers: await headers(),
    body: values
  });
}

export async function changeEmail(values: { email: string }) {
  return auth.api.changeEmail({
    headers: await headers(),
    body: {
      newEmail: values.email
    },
  });
}

export async function deleteAccount() {
  return auth.api.deleteUser({
    headers: await headers(),
    body: {
      callbackURL: `${process.env.BASE_URL}/goodbye`
    }
  });
}