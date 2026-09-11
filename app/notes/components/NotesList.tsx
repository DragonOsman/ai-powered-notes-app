"use client";

import Link from "next/link";
import { INote } from "@/context/NotesContext";
import DeleteNote from "./DeleteNote";

export default function NotesList({
  notes
}: {
  notes: INote[]
}) {
  if (notes.length === 0) {
    return (
      <div className="card p-6">
        <p>No notes yet.</p>
        <Link
          href="/notes/add-note"
          className="btn btn-primary mt-4 inline-block"
        >
          Create your first note
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {notes.map(note => (
        <div className="card p-4 hover:shadow transition" key={note.id}>
          <div className="mb-4 flex flex-wrap gap-2">
            <Link
              href={`/notes/edit-note/${note.id}`}
              className="btn btn-secondary btn-secondary-hover"
            >
              Edit Note
            </Link>
            <Link
              href={`/notes/read-note/${note.id}`}
              className="block"
            >
              <h2 className="font-semibold">
                {note.title}
              </h2>
              <p className="m-2 text-app-muted">
                {note.content.slice(0, 150)}
              </p>
            </Link>
            <DeleteNote noteId={note.id} />
          </div>
        </div>
      ))}
    </div>
  );
}