"use client";

import { authClient } from "@/lib/auth-client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import SignOut from "./Signout";

export default function UserButton() {
  const { data, isPending } = authClient.useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (isPending || !data?.session) return null;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        title="User Menu"
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-2 px-2 py-1.5 bg-primary-500 text-primary-foreground rounded hover:bg-primary-700 transition"
      >
        <Image
          src={
            data.user.image ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(data.user.name)}&rounded=true`
          }
          alt="User"
          width={32}
          height={32}
          className="rounded-full"
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-bg-secondary border border-border rounded shadow-lg">
          <Link href="/users/profile" className="block px-4 py-2 hover:bg-primary-500">
            Profile
          </Link>
          <Link href="/users/settings" className="block px-4 py-2 hover:bg-primary-500">
            Settings
          </Link>
          <SignOut />
        </div>
      )}
    </div>
  );
}