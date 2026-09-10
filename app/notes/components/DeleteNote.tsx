"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteNote } from "@/server/actions/notes/deleteNote";

interface DeleteNoteProps {
  noteId: string;
}

export default function DeleteNote({ noteId }: DeleteNoteProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this note?");

    if (!confirmed) {
      return;
    }

    try {
      setIsDeleting(true);

      await deleteNote(noteId);

      toast.success("Note deleted successfully!");
      router.refresh();
    } catch (error) {
      console.error(`Failed to delete note: ${error}`);

      toast.error(
        error instanceof Error
          ? error.message
          : error as string
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      type="button"
      className="btn btn-danger hover:btn-danger-hover disabled:cursor-not-allowed cursor-pointer disabled:opacity-50"
      onClick={handleDelete}
      disabled={isDeleting}
    >
      {isDeleting ? "Deleting..." : "Delete Note"}
    </button>
  );
}