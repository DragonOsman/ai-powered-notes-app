import { NextResponse } from "next/server";

import { groq } from "@/lib/groq";

export async function POST(request: Request) {
  try {
    const { content } = await request.json();

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that summarizes notes. Summarize this note clearly."
        },
        {
          role: "user",
          content: content
        }
      ]
    });

    return NextResponse.json({
      summary: completion.choices[0]?.message?.content
    });
  } catch (error) {
    console.error(`Error summarizing content: ${error}`);
    return NextResponse.json({ error: "Failed to summarize content" }, { status: 500 });
  }
}