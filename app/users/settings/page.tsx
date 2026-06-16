import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Settings",
  description: "Manage account settings",
};

export default async function SettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  if (!user) {
    return <div className="text-red-500">Not authenticated</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      <div className="bg-surface border border-app rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold">Account</h2>

        <p className="text-muted text-sm">
          More settings (change email, password, delete account) will be added here.
        </p>

        <div className="flex gap-3">
          <button className="btn-primary px-4 py-2 rounded">
            Change Password
          </button>

          <button className="bg-danger text-white px-4 py-2 rounded">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}