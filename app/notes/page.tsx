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
      <div className="mb-8 flex justify-between">
        <h1 className="text-4xl font-bold">
          Notes
        </h1>

        <p className="mt-2 text-app-muted">
          Organize your AI-powered notes.
        </p>

        <Link
          href="/notes/add-note"
          className="rounded-lg bg-primary px-4 py-2 text-white transition hover:bg-primary-hover inline-block"
        >
          Add a new note
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <NotesList notes={notes} />
      </div>
    </section>
  );
}