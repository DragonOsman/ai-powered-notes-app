import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import type { Metadata } from "next";
import ProfileSettingsClient from "./components/ProfileSettingsClient";

export const metadata: Metadata = {
  title: "User Settings",
  description: "Manage account settings",
};

export default async function SettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  const user = session?.user;

  if (!user) {
    return <div className="text-red-500">Not authenticated</div>;
  }

  return (
    <ProfileSettingsClient user={user} />
  );
}