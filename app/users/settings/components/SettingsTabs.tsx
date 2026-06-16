"use client";

import { useState } from "react";

type Tab =
  | "profile"
  | "security"
  | "danger";

export default function SettingsTabs() {
  const [activeTab, setActiveTab] =
    useState<Tab>("profile");

  return (
    <div className="space-y-6">
      <div className="flex gap-2 border-b">
        <button
          onClick={() =>
            setActiveTab("profile")
          }
          type="button"
        >
          Profile
        </button>

        <button
          onClick={() =>
            setActiveTab("security")
          }
          type="button"
        >
          Security
        </button>

        <button
          onClick={() =>
            setActiveTab("danger")
          }
          type="button"
        >
          Danger Zone
        </button>
      </div>

      {activeTab === "profile" && (
        <div>
          Email, Name, Linked Accounts
        </div>
      )}

      {activeTab === "security" && (
        <div>
          Password, Sessions, 2FA
        </div>
      )}

      {activeTab === "danger" && (
        <div>
          Delete Account
        </div>
      )}
    </div>
  );
}