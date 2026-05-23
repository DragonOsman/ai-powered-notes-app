import { groq } from "@/lib/groq";

export async function safeCompletion({system, user}: {
  system: string;
  user: string;
}) {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0.2,
    messages: [{
      role: "system",
      content: system
    }, {
      role: "user",
      content: user
    }]
  });

  return completion.choices[0]?.message?.content || "";
}