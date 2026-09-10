import type { Metadata } from "next";
import { getNote } from "@/server/actions/notes/getNote";
import { notFound } from "next/navigation";
import NoteEditor from "@/app/notes/components/NoteEditor";

interface EditNotePageProps {
  params: Promise<{
    id: string
  }>;
}

export async function generateMetadata({ params }: EditNotePageProps): Promise<Metadata> {
  const { id } = await params;
  const note = await getNote(id);

  if (!note) {
    return {
      title: "Note Not Found",
      description: "The requested note could not be found."
    };
  }

  return {
    title: `Edit Note - ${note.title}`,
    description: `Edit the note titled "${note.title}".`
  };
}

export default async function EditNotePage({ params }: EditNotePageProps) {
  const { id } = await params;
  const note = await getNote(id);

  if (!note) {
    notFound();
  }

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <NoteEditor note={note} />
    </main>
  );
}