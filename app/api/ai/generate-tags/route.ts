import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { generateTagsService } from "@/server/services/ai/generateTags";

const NOT_FOUND_ERROR = 404;
const UNAUTHORIZED_ERROR = 401;
const INTERNAL_SERVER_ERROR = 500;
const BAD_REQUEST_ERROR = 400;

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: UNAUTHORIZED_ERROR });
  }

  try {
    const body: unknown = await request.json();

    if (
      typeof body !== "object" ||
      body === null ||
      !("noteId" in body) ||
      typeof body.noteId !== "string"
    ) {
      return NextResponse.json({ error: "noteId is required." }, { status: BAD_REQUEST_ERROR });
    }

    const tags = await generateTagsService({
      userId: session.user.id,
      noteId: body.noteId
    });

    return NextResponse.json({ tags });
  } catch (error) {
    console.error(`Failed to generate tags: ${error}`);

    const message = error instanceof Error
      ? error.message
      : "Failed to generate tags"
    ;

    const status = message === "Note not found."
      ? NOT_FOUND_ERROR
      : INTERNAL_SERVER_ERROR
    ;
    return NextResponse.json({ error: message }, { status });
  }
}