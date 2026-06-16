import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import ProfileClient from "./components/ProfileClient";

export const metadata: Metadata = {
  title: "User Profile",
  description: "View your profile information and account details."
};

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return <div className="text-red-500">Not authenticated</div>;
  }

  return <ProfileClient user={session.user} />;
}