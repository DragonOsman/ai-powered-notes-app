"use client";

import {
  FormEvent,
  useState,
  useTransition
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { chatWithAI } from "@/server/actions/ai/chat";
import { deleteNote } from "@/server/actions/notes/deleteNote";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface Confirmation {
  action: "delete_note";
  noteId: string;
}

const INITIAL_MESSAGE: ChatMessage = {
  role: "assistant",
  content:
    "Hi! I can help you create, find, update, and manage your notes."
};

export default function AIAssistant() {
  const router = useRouter();

  const [messages, setMessages] = useState<ChatMessage[]>([
    INITIAL_MESSAGE
  ]);

  const [input, setInput] = useState("");
  const [confirmation, setConfirmation] =
    useState<Confirmation | null>(null);

  const [isPending, startTransition] =
    useTransition();

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const content = input.trim();

    if (!content || isPending) {
      return;
    }

    const userMessage: ChatMessage = {
      role: "user",
      content
    };

    const nextMessages = [
      ...messages,
      userMessage
    ];

    setMessages(nextMessages);
    setInput("");

    startTransition(async () => {
      try {
        const response = await chatWithAI(
          nextMessages
        );

        setMessages((current) => [
          ...current,
          {
            role: "assistant",
            content: response.message
          }
        ]);

        setConfirmation(
          response.confirmation ?? null
        );
      } catch (error) {
        console.error(
          "[AI ASSISTANT ERROR]",
          error
        );

        toast.error(
          "The AI assistant could not process your request."
        );
      }
    });
  };

  const handleConfirmDelete = () => {
    if (
      !confirmation ||
      confirmation.action !== "delete_note" ||
      isPending
    ) {
      return;
    }

    const noteId = confirmation.noteId;

    startTransition(async () => {
      try {
        await deleteNote(noteId);

        setConfirmation(null);

        setMessages((current) => [
          ...current,
          {
            role: "assistant",
            content: "The note has been deleted."
          }
        ]);

        toast.success("Note deleted.");

        router.refresh();
      } catch (error) {
        console.error(
          "[AI DELETE ERROR]",
          error
        );

        toast.error(
          "The note could not be deleted."
        );
      }
    });
  };

  const handleCancelDelete = () => {
    if (isPending) {
      return;
    }

    setConfirmation(null);

    setMessages((current) => [
      ...current,
      {
        role: "assistant",
        content:
          "Okay. I won't delete the note."
      }
    ]);
  };

  return (
    <section className="flex w-full max-w-2xl flex-col rounded-xl border border-border bg-bg-secondary">
      <header className="border-b border-border px-4 py-3">
        <h2 className="text-lg font-semibold text-text">
          AI Assistant
        </h2>

        <p className="text-sm text-text-muted">
          Manage your notes using natural language.
        </p>
      </header>

      <div className="flex min-h-80 flex-col gap-3 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={
              message.role === "user"
                ? "ml-auto max-w-[80%] rounded-lg bg-primary px-3 py-2 text-sm text-white"
                : "mr-auto max-w-[80%] rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text"
            }
          >
            {message.content}
          </div>
        ))}

        {isPending && (
          <div className="mr-auto rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text-muted">
            Thinking...
          </div>
        )}
      </div>

      {confirmation?.action ===
        "delete_note" && (
        <div className="border-t border-border p-4">
          <p className="mb-3 text-sm text-text">
            Are you sure you want to delete this
            note? This action cannot be undone.
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleConfirmDelete}
              disabled={isPending}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Delete
            </button>

            <button
              type="button"
              onClick={handleCancelDelete}
              disabled={isPending}
              className="rounded-md border border-border px-4 py-2 text-sm font-medium text-text disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex gap-2 border-t border-border p-4"
      >
        <input
          type="text"
          value={input}
          onChange={(event) =>
            setInput(event.target.value)
          }
          disabled={isPending}
          placeholder="Ask the AI about your notes..."
          className="min-w-0 flex-1 rounded-md border border-border bg-bg px-3 py-2 text-sm text-text outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={
            isPending || input.trim().length === 0
          }
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </section>
  );
}