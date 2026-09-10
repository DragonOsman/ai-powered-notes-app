import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
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