"use client";

import { toast } from "sonner";
import { revokeAllSessions } from "@/server/actions/sessions";

export default function LogoutOnAllDevicesBtn() {
  return (
    <button
      type="button"
      className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
      onClick={async () => {
        try {
          await revokeAllSessions();

          toast.success(
            "All other sessions revoked."
          );
        } catch {
          toast.error(
            "Failed to revoke sessions."
          );
        }
      }}
    >
      Logout Other Devices
    </button>
  );
}