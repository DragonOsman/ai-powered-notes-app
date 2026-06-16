"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getSessions() {
  return auth.api.listSessions({
    headers: await headers(),
  });
}

export async function revokeAllSessions() {
  return auth.api.revokeOtherSessions({
    headers: await headers(),
  });
}