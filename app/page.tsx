import type { Metadata } from "next";
import Image from "next/image";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    absolute: "DragonOsman's AI Notes"
  }
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

      <p className="mt-4 max-w-xl text-lg text-muted">
        Intelligent note-taking powered by AI,
        Groq, Next.js, MongoDB (for Notes), Neon Serverless PostgreSQL (for user authentication), and Better
        Auth.
      </p>

      <div className="mt-8 flex gap-4">
        <a
          href="/auth/signup"
          className="rounded-lg btn-primary hover:btn-primary-hover px-5 py-3 text-white transition"
        >
          Get Started
        </a>

        <a
          href="/notes"
          className="rounded-lg btn-secondary hover:btn-secondary-hover px-5 py-3 text-white transition"
        >
          View Notes
        </a>
      </div>
    </section>
  );
}
