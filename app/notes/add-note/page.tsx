import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add New Note",
  description: "Create a new note in your notes app."
};

import AddNewNote from "@/app/notes/components/AddNewNote";

export default async function NewNotePage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <AddNewNote />
    </main>
  );
}