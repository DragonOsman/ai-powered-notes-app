import type { Metadata } from "next";
import Image from "next/image";
import "./globals.css";

export const metadata: Metadata = {
  title: "Home"
};

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center px-6 py-24 text-center">
      <Image
        src="/logo.png"
        alt="Dragon logo"
        width={40}
        height={40}
        priority
      />

      <h1 className="mt-8 text-5xl font-bold">
        DragonOsman AI Notes App
      </h1>

      <p className="mt-4 max-w-xl text-lg text-app-muted">
        Intelligent note-taking powered by AI,
        Groq, Next.js, MongoDB, and Better
        Auth.
      </p>

      <div className="mt-8 flex gap-4">
        <a
          href="/auth/signup"
          className="rounded-lg bg-primary px-5 py-3 text-white transition hover:bg-primary-hover"
        >
          Get Started
        </a>

        <a
          href="/notes"
          className="rounded-lg border border-app bg-app-secondary px-5 py-3 transition hover:bg-gray-100"
        >
          View Notes
        </a>
      </div>
    </section>
  );
}
