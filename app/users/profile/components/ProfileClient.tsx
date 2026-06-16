"use client";

import type { User } from "better-auth";

interface ProfileClientProps {
  user: User;
}

export default function ProfileClient({ user }: ProfileClientProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Profile</h1>

      <div className="bg-surface border border-app rounded-xl p-6 space-y-3">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold">
            {user.name?.charAt(0).toUpperCase()}
          </div>

          <div>
            <p className="font-semibold">{user.name}</p>
            <p className="text-muted text-sm">{user.email}</p>
          </div>
        </div>

        <div className="text-sm space-y-2">
          <p>
            <span className="text-muted">User ID:</span> {user.id}
          </p>

          <p>
            <span className="text-muted">Email Verified:</span>{" "}
            {user.emailVerified ? "Yes" : "No"}
          </p>
        </div>
      </div>
    </div>
  );
}