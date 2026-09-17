"use client";

import { useTransition } from "react";
import { generateSummary } from "@/server/actions/ai/actions/generateSummary";
import { generateTitle } from "@/server/actions/ai/actions/generateTitle";
import { generateTags } from "@/server/actions/ai/actions/generateTags";
import { generateTodos } from "@/server/actions/ai/actions/generateTodos";
import { toast } from "sonner";

interface IAIToolbarProps {
  noteId: string;
  onRefresh: () => void;
}

export default function AIToolbar({ noteId, onRefresh }: IAIToolbarProps) {
  const [isPending, startTransition] = useTransition();

  const runAction = (
    action: (id: string) => Promise<unknown>,
    successMessage: string
  ) => {
    startTransition(async () => {
      try {
        await action(noteId);

        toast(successMessage);
        onRefresh();
      } catch (error) {
        console.error(`AI action failed with error: ${error}`);

        toast.error(
          error instanceof Error
            ? error.message
            : "The AI operation failed."
        )
      }
    })
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        className="btn-primary"
        type="button"
        title="summarize note"
        disabled={isPending}
        onClick={() => runAction(
          generateSummary,
          "Summary generated successfully."
        )}
      >
        {isPending ? "Generating summary..." : "Generate Summary"}
      </button>

      <button
        className="btn-primary"
        type="button"
        title="generate title"
        disabled={isPending}
        onClick={() => runAction(
          generateTitle,
          "Title generated successfully.."
        )}
      >
        {isPending ? "Generating title..." : "Generate Title"}
      </button>

      <button
        className="btn-primary"
        type="button"
        title="generate tags"
        disabled={isPending}
        onClick={() => runAction(
          generateTags,
          "Tags generated successfully."
        )}
      >
        {isPending ? "Generating tags..." : "Generate Tags"}
      </button>

      <button
        className="btn-primary"
        type="button"
        title="generate todos"
        disabled={isPending}
        onClick={() => runAction(
          generateTodos,
          "Todos generated successfully."
        )}
      >
        {isPending ? "Generating todos..." : "Generate Todos"}
      </button>
    </div>
  );
}