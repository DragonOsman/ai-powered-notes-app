import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { archiveNoteService } from "@/server/services/notes/archiveNote";

const NOT_FOUND_ERROR = 404;
const UNAUTHORIZED_ERROR = 401;
const INTERNAL_SERVER_ERROR = 500;

interface ArchiveRouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function POST(
  _request: Request,
  context: ArchiveRouteContext
) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: UNAUTHORIZED_ERROR });
  }

  const { id } = await context.params;

  try {
    const note = await archiveNoteService({
      userId: session.user.id,
      id
    });

    return NextResponse.json({ note });
  } catch (error) {
    console.error(`Failed to archive note: ${error}`);

    const message = error instanceof Error
      ? error.message
      : "Failed to archive note"
    ;

    const status = message === "Note not found"
      ? NOT_FOUND_ERROR
      : INTERNAL_SERVER_ERROR
    ;

    return NextResponse.json({ error: message }, { status });
  }
}