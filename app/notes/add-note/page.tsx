import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add New Note",
  description: "Create a new note in your notes app."
};

import AddNewNote from "../components/AddNewNote";

export default async function NewNotePage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/signin");
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <AddNewNote />
    </main>
  );
}