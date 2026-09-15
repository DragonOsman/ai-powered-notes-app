import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { getNoteService } from "@/server/services/notes/getNote";
import { updateNoteService } from "@/server/services/notes/updateNote";
import { deleteNoteService } from "@/server/services/notes/deleteNote";

interface NoteRouteContext {
  params: Promise<{
    id: string;
  }>;
}

const NOT_FOUND_ERROR = 404;
const UNAUTHORIZED_ERROR = 401;
const INTERNAL_SERVER_ERROR = 500;
const BAD_REQUEST_ERROR = 400;

async function getAuthenticatedUser() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  return session?.user ?? null;
}

export async function GET(
  _request: Request,
  context: NoteRouteContext
) {
  const user = await getAuthenticatedUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: UNAUTHORIZED_ERROR });
  }

  const { id } = await context.params;

  try {
    const note = await getNoteService(user.id, id);

    if (!note) {
      return NextResponse.json({ error: "Note not found." }, { status: NOT_FOUND_ERROR });
    }

    return NextResponse.json({ note });
  } catch (error) {
    console.error(`Failed to retrieve note: ${error}`);

    return NextResponse.json({ error: "Failed to retrieve note." }, { status: INTERNAL_SERVER_ERROR });
  }
}

export async function PATCH(
  request: Request,
  context: NoteRouteContext
) {
  const user = await getAuthenticatedUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: UNAUTHORIZED_ERROR });
  }

  const { id } = await context.params;

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
      return NextResponse.json({ error: "Invalid request body." }, { status: BAD_REQUEST_ERROR });
    }

    const note = await updateNoteService({
      userId: user.id,
      id,
      title: body.title,
      content: body.content
    });

    return NextResponse.json({ note });
  } catch (error) {
    console.error(`Failed to update note: ${error}`);

    const message = error instanceof Error
      ? error.message
      : "Failed to update note"
    ;
    const status = message === "Note not found"
      ? NOT_FOUND_ERROR
      : BAD_REQUEST_ERROR
    ;

    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(
  _request: Request,
  context: NoteRouteContext
) {
  const user = await getAuthenticatedUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: NOT_FOUND_ERROR });
  }

  const { id } = await context.params;

  try {
    await deleteNoteService(user.id, id);

    return new NextResponse(null, {
      status: 204
    })
  } catch (error) {
    console.error(`Failed to delete note: ${error}`);

    const message = error instanceof Error
      ? error.message
      : "Failed to delete note"
    ;

    const status = message === "Note not found"
      ? NOT_FOUND_ERROR
      : INTERNAL_SERVER_ERROR
    ;

    return NextResponse.json({ error: message }, { status });
  }
}