"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { authClient } from "@/lib/auth-client";
import UserButton from "./UserButton";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { data } = authClient.useSession();

  const isAuthenticated = !!(data?.session && data?.user);

  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-bg border-b border-border z-50">
      <div className="max-w-7xl mx-auto h-full px-4 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Logo"
            width={40}
            height={40}
            priority
          />
          <span className="font-semibold">AI Notes</span>
        </Link>

        {/* Mobile toggle */}
        <button
          type="button"
          className="md:hidden text-text text-xl"
          onClick={() => setIsOpen((s) => !s)}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Nav */}
        <nav
          className={`${
            isOpen ? "absolute top-full left-0 w-full bg-bg border-b border-border" : "hidden"
          } md:static md:block`}
        >
          <ul className="flex flex-col md:flex-row md:items-center gap-4 p-4 md:p-0">

            {isAuthenticated ? (
              <>
                <li>
                  <Link className="text-text-muted hover:text-text" href="/">
                    Home
                  </Link>
                </li>
                <li>
                  <Link className="text-text-muted hover:text-text" href="/notes">
                    Notes
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    className="
                      btn-primary
                      hover:btn-primary-hover
                      px-3
                      py-2.5
                      rounded
                      transition
                    "
                  >
                    New Note
                  </button>
                </li>
                <li>
                  <UserButton />
                </li>
                <li>
                  <ThemeToggle />
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link className="text-text-muted hover:text-text" href="/auth/signin">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link
                    className="
                      btn-primary
                      hover:btn-primary-hover
                      px-3
                      py-2.5
                      rounded
                      transition
                    "
                    href="/auth/signup"
                  >
                    Sign Up
                  </Link>
                </li>
                <li>
                  <ThemeToggle />
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}