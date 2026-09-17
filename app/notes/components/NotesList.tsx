"use client";

import Link from "next/link";
import { INote } from "@/types/note";
import DeleteNote from "./DeleteNote";

interface NotesListProps {
  notes: INote[];
}

export default function NotesList({
  notes
}: NotesListProps) {
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
        <article
          className="card flex flex-col p-4 transition hover:shadow"
          key={note.id}
        >
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
        </article>
      ))}
    </div>
  );
}