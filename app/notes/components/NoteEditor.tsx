"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import AIToolbar from "@/app/notes/components/AIToolbar";
import { updateNote } from "@/server/actions/notes/updateNote";
import { noteSchema } from "@/lib/schemas/note";
import { INote } from "@/types/note";
import { ValidationError } from "better-auth";

interface INoteEditorProps {
  note: INote;
}

export default function NoteEditor({ note }: INoteEditorProps) {
  const router = useRouter();

  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    const validation = noteSchema.safeParse({
      title: title.trim(),
      content
    });

    if (!validation.success) {
      toast.error(
        validation.error.issues[0]?.message ??
        "Please enter a valid note."
      );
      return;
    }

    try {
      setIsSaving(true);

      await updateNote(
        note.id,
        validation.data.title,
        validation.data.content
      );

      toast.success("Note saved successfully.");
      router.refresh();
    } catch (error) {
      console.error(`Failed to save note: ${error}`);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save note."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          Edit Note
        </h1>
        <button
          className="rounded-lg bg-primary px-4 py-2 text-white"
          type="button"
          disabled={isSaving}
          onClick={handleSave}
          title="Save Note"
        >
          {isSaving
            ? "Saving..."
            : "Save"}
        </button>
      </div>

      <AIToolbar
        noteId={note.id}
        onRefresh={() => {
          router.refresh();
        }}
      />

      <div className="mt-6">
        <label
          htmlFor="title"
          className="mb-2 block font-medium"
        >
          Title
        </label>
        <input
          type="text"
          name="title"
          id="title"
          className="w-full rounded-lg border p-3"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </div>

      <div className="mt-6">
        <label
          htmlFor="content"
          className="mb-2 block font-medium"
        >
          Content
        </label>
        <textarea
          name="content"
          id="content"
          className="w-full rounded-lg border p-3"
          rows={16}
          value={content}
          onChange={(event) => setContent(event.target.value)}
        />
      </div>

      {note.summary && (
        <section className="mt-8 rounded-xl border p-5">
          <h2 className="mb-3 text-xl font-semibold">
            AI Summary
          </h2>
          <p>
            {note.summary}
          </p>
        </section>
      )}

      {note.tags && note.tags.length > 0 && (
        <section className="mt-8 rounded-xl border p-5">
          <h2 className="mb-3 text-xl font-semibold">
            AI Tags
          </h2>

          <div className="flex flex-wrap gap-2">
            {note.tags.map((tag: string) => (
              <span
                key={tag}
                className="rounded-full border px-3 py-1"
              >
                #{tag}
              </span>
            ))}
          </div>
        </section>
      )}

      {note.todos && note.todos.length > 0 && (
        <section className="mt-8 rounded-xl border p-5">
          <h2 className="mb-3 text-xl font-semibold">
            Extracted Todos
          </h2>

          <ul className="space-y-2">
            {note.todos.map((todo, index: number) => (
              <li
                key={`${todo.task}-${index}`}
                className="flex gap-2"
              >
                <span>☐</span>
                <span>{todo.task}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}