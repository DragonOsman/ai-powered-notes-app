import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { getNotesService } from "@/server/services/notes/getNotes";
import { createNoteService } from "@/server/services/notes/createNote";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const notes = await getNotesService(session.user.id);

    return NextResponse.json(notes);
  } catch (error) {
    console.error(`Failed to retrieve notes: ${error}`);

    return NextResponse.json({ error: "Failed to retrieve notes." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body: unknown = await request.json();

    if (
      typeof body !== "object" ||
      body === null ||
      !("title" in body) ||
      !("content" in body) ||
      typeof body.title !== "string" ||
      typeof body.content !== "string"
    ) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const note = await createNoteService({
      userId: session.user.id,
      title: body.title,
      content: body.content
    });

    return NextResponse.json({ note }, { status: 201 });
  } catch (error) {
    console.error(`Failed to create note: ${error}`);

    return NextResponse.json(
      { error: error instanceof Error
            ? error.message
            : "Failed to create note."
      },
      {
        status: 400
      }
    );
  }
}