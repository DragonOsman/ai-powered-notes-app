"use client";

import ChangePasswordForm from "./ChangePasswordForm";
import ChangeEmailForm from "./ChangeEmailForm";
import type { User } from "better-auth";
import DangerZone from "./DangerZone";

interface ProfileSettingsClientProps {
  user: User;
}

export default function ProfileSettingsClient({ user }: ProfileSettingsClientProps) {
  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold">Settings</h1>

      {/* ACCOUNT INFO */}
      <section className="bg-surface border border-app rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-2">Account</h2>
        <p className="text-sm text-muted">{user.email}</p>
      </section>

      {/* CHANGE PASSWORD */}
      <section className="bg-surface border border-app rounded-xl p-6">
        <ChangePasswordForm />
      </section>

      {/* CHANGE EMAIL */}
      <section className="bg-surface border border-app rounded-xl p-6">
        <ChangeEmailForm />
      </section>

      {/* DANGER ZONE */}
      <section className="bg-surface border border-red-500 rounded-xl p-6">
        <DangerZone />
      </section>
    </div>
  );
}
