import type { Metadata } from "next";
import { getNotes } from "@/server/actions/notes/getNotes";
import NotesList from "@/app/notes/components/NotesList";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Notes",
  description: "Organize your AI-powered notes."
};

export default async function NotesPage() {
  const notes = await getNotes();

  return (
    <section className="p-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold">
            Notes
          </h1>

          <p className="mt-2 text-app-muted">
            Organize your AI-powered notes.
          </p>
        </div>

        <Link
          href="/notes/add-note"
          className="rounded-lg bg-primary px-4 py-2 text-white transition hover:bg-primary-hover inline-block"
        >
          Add a new note
        </Link>
      </div>

      <NotesList notes={notes} />
    </section>
  );
}