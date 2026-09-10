import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getNote } from "@/server/actions/notes/getNote";
import { ITodo } from "@/context/NotesContext";

interface ReadNotePageProps {
  params: Promise<{
    id: string
  }>;
}

export async function generateMetadata({ params }: ReadNotePageProps): Promise<Metadata> {
  const { id } = await params;
  const note = await getNote(id);

  if (!note) {
    return {
      title: "Note Not Found",
      description: "The requested note could not be found."
    };
  }

  return {
    title: note.title
  };
}

export default async function ReadNotePage({ params }: ReadNotePageProps) {
  const { id } = await params;
  const note = await getNote(id);

  if (!note) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-4xl p-6">
      <article className="card p-6">
        <h1 className="mb-4 text-3xl font-bold">
          {note.title}
        </h1>

        <div className="mt-6 whitespace-pre-wrap">
          {note.content}
        </div>

        {note.summary && (
          <section className="mt-8 border-t pt-6">
            <h2 className="text-xl font-semibold">
              AI Summary
            </h2>

            <p className="mt-2 text-app-muted">
              {note.summary}
            </p>
          </section>
        )}

        {note.tags.length > 0 && (
          <section className="mt-8 border-t pt-6">
            <h2 className="text-xl font-semibold">
              AI Tags
            </h2>

            <div className="mt-3 flex flex-wrap gap-2">
              {note.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="rounded-full border px-3 py-1 text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </section>
        )}

        {note.todos.length > 0 && (
          <section className="mt-8 border-t pt-6">
            <h2 className="text-xl font-semibold">
              AI Extracted Todos
            </h2>

            <ul className="mt-3 space-y-2">
              {note.todos.map((todo: ITodo, index: number) => (
                <li
                  key={`${todo.task}-${index}`}
                  className="flex gap-2"
                >
                  <span className="mr-2">•</span>
                  <span>{todo.task}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>
    </main>
  );
}