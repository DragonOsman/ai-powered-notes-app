"use client";

import { useEffect, useState } from "react";
import { getSessions } from "@/server/actions/sessions";
import type { Session } from "better-auth";

export default async function ActiveSessions() {
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    getSessions().then((result) => {
      setSessions(result ?? []);
    });
  }, []);

  return (
    <section className="rounded-xl border p-6">
      <h2 className="mb-4 text-lg font-semibold">
        Active Sessions
      </h2>

      <div className="space-y-3">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="rounded border p-3"
            >
              <p>{session.ipAddress}</p>

              <p className="text-sm opacity-70">
                {session.userAgent}
              </p>
            </div>
          ))}
      </div>
    </section>
  );
}