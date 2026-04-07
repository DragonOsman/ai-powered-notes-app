export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-bg">
      <main className="w-full max-w-3xl flex flex-col gap-4 py-24 px-10 bg-bg-secondary border border-border rounded-lg">

        <h1>AI Notes</h1>

        <p className="text-muted">
          Start writing your notes with AI assistance.
        </p>

        <button
          type="button"
          className="mt-4 self-start bg-secondary-500 text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary-700 transition"
        >
          Create Note
        </button>

      </main>
    </div>
  );
}