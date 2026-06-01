"use client";

import { useTransition } from "react";
import { generateSummary } from "@/server/actions/ai/generateSummary";
import { generateTitle } from "@/server/actions/ai/generateTitle";
import { generateTags } from "@/server/actions/ai/generateTags";
import { generateTodos } from "@/server/actions/ai/generateTodos";

interface IAIToolbarProps {
  noteId: string;
  onRefresh: () => void;
}

export default function AIToolbar({ noteId, onRefresh }: IAIToolbarProps) {
  const [isPending, startTransition] = useTransition();

  const runAction = (
    action: (id: string) => Promise<unknown>
  ) => {
    startTransition(async () => {
      await action(noteId);
      onRefresh();
    })
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        className="btn-primary"
        type="button"
        title="summarize note"
        disabled={isPending}
        onClick={() => runAction(generateSummary)}
      >
        Summarize
      </button>

      <button
        className="btn-primary"
        type="button"
        title="generate title"
        disabled={isPending}
        onClick={() => runAction(generateTitle)}
      >
        Generate Title
      </button>

      <button
        className="btn-primary"
        type="button"
        title="generate tags"
        disabled={isPending}
        onClick={() => runAction(generateTags)}
      >
        Generate Tags
      </button>

      <button
        className="btn-primary"
        type="button"
        title="generate todos"
        disabled={isPending}
        onClick={() => runAction(generateTodos)}
      >
        Generate Todos
      </button>
    </div>
  );
}