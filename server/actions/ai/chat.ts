"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

import {
  chatWithAIService,
  type AIChatMessage,
  type AIChatResponse
} from "@/server/services/ai/chat";

export async function chatWithAI(
  messages: AIChatMessage[]
): Promise<AIChatResponse> {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  return chatWithAIService({
    userId: session.user.id,
    messages
  });
}