"use client";

import Link from "next/link";
import { INote } from "@/models/Note";

export default function NotesList({
  notes
}: {
  notes: INote[]
}) {
  if (notes.length === 0) {
    return (
      <div className="card p-6">
        No notes yet.
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {notes.map(note => (
        <Link
          key={note.userId}
          href={`/notes/${note.id}`}
          className="card p-4 hover:shadow transition"
        >
          <h2 className="font-semibold">
            {note.title}
          </h2>
          <p className="m-2 text-app-muted">
            {note.content.slice(0, 150)}
          </p>
        </Link>
      ))}
    </div>
  );
}