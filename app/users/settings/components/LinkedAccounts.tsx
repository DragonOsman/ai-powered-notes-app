"use client";

import { authClient } from "@/lib/auth-client";

export default function LinkedAccounts() {
  return (
    <section className="rounded-xl border p-6">
      <h2 className="mb-4 text-lg font-semibold">
        Linked Accounts
      </h2>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() =>
            authClient.signIn.social({
              provider: "google",
            })
          }
          type="button"
        >
          Link Google
        </button>

        <button
          onClick={() =>
            authClient.signIn.social({
              provider: "github",
            })
          }
          type="button"
        >
          Link GitHub
        </button>

        <button
          onClick={() =>
            authClient.signIn.social({
              provider: "discord",
            })
          }
          type="button"
        >
          Link Discord
        </button>
      </div>
    </section>
  );
}