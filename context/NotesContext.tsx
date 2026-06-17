"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { getNotes } from "@/server/actions/notes/getNotes";
import { createNote } from "@/server/actions/notes/createNote";
import { updateNote } from "@/server/actions/notes/updateNote";
import { deleteNote } from "@/server/actions/notes/deleteNote";
import { archiveNote } from "@/server/actions/notes/archiveNote";

import { generateTitle } from "@/server/actions/ai/generateTitle";
import { generateSummary } from "@/server/actions/ai/generateSummary";
import { generateTags } from "@/server/actions/ai/generateTags";
import { generateTodos } from "@/server/actions/ai/generateTodos";

interface ITodo {
  task: string;
}

export interface INote {
  _id: string;
  userId: string;
  title: string;
  content: string;
  summary?: string;
  tags?: string[];
  todos?: ITodo[];
  archived?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CreateNoteData {
  title: string;
  content: string;
}

interface NotesContextType {
  notes: INote[];
  loading: boolean;

  refreshNotes: () => Promise<void>;

  createNewNote: (
    data: CreateNoteData
  ) => Promise<INote>;

  updateExistingNote: (
    id: string,
    title: string,
    content: string
  ) => Promise<INote>;

  removeNote: (
    id: string
  ) => Promise<void>;

  archiveExistingNote: (
    id: string
  ) => Promise<void>;

  generateAiTitle: (
    noteId: string
  ) => Promise<string>;

  generateAiSummary: (
    noteId: string
  ) => Promise<string>;

  generateAiTags: (
    noteId: string
  ) => Promise<string[]>;

  generateAiTodos: (
    noteId: string
  ) => Promise<ITodo[]>;
}

const NotesContext =
  createContext<NotesContextType | null>(
    null
  );

interface NotesProviderProps {
  children: ReactNode;
}

export function NotesProvider({
  children,
}: NotesProviderProps) {
  const [notes, setNotes] = useState<
    INote[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const refreshNotes =
    useCallback(async () => {
      try {
        setLoading(true);

        const data =
          (await getNotes()) as INote[];

        setNotes(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    void refreshNotes();
  }, [refreshNotes]);

  const createNewNote =
    useCallback(
      async (
        data: CreateNoteData
      ) => {
        const note =
          (await createNote(
            data
          )) as INote;

        setNotes((prevNotes) => [
          note,
          ...prevNotes,
        ]);

        return note;
      },
      []
    );

  const updateExistingNote =
    useCallback(
      async (
        id: string,
        title: string,
        content: string
      ) => {
        const updated =
          (await updateNote(
            id,
            title,
            content
          )) as INote;

        setNotes((prevNotes) =>
          prevNotes.map((note) =>
            note._id === id
              ? updated
              : note
          )
        );

        return updated;
      },
      []
    );

  const removeNote =
    useCallback(
      async (id: string) => {
        await deleteNote(id);

        setNotes((prevNotes) =>
          prevNotes.filter(
            (note) =>
              note._id !== id
          )
        );
      },
      []
    );

  const archiveExistingNote =
    useCallback(
      async (id: string) => {
        await archiveNote(id);

        setNotes((prevNotes) =>
          prevNotes.map((note) =>
            note._id === id
              ? {
                  ...note,
                  archived: true,
                }
              : note
          )
        );
      },
      []
    );

  const generateAiTitle =
    useCallback(
      async (noteId: string) => {
        const title =
          await generateTitle(
            noteId
          );

        await refreshNotes();

        return title;
      },
      [refreshNotes]
    );

  const generateAiSummary =
    useCallback(
      async (noteId: string) => {
        const summary =
          await generateSummary(
            noteId
          );

        await refreshNotes();

        return summary;
      },
      [refreshNotes]
    );

  const generateAiTags =
    useCallback(
      async (noteId: string) => {
        const tags =
          await generateTags(
            noteId
          );

        await refreshNotes();

        return tags;
      },
      [refreshNotes]
    );

  const generateAiTodos = useCallback(
    async (
      noteId: string
    ): Promise<ITodo[]> => {
      const todos =
        await generateTodos(noteId);

      await refreshNotes();

      return todos;
    },
    [refreshNotes]
  );

  const value = useMemo(
    () => ({
      notes,
      loading,

      refreshNotes,

      createNewNote,
      updateExistingNote,

      removeNote,
      archiveExistingNote,

      generateAiTitle,
      generateAiSummary,
      generateAiTags,
      generateAiTodos,
    }),
    [
      notes,
      loading,
      refreshNotes,
      createNewNote,
      updateExistingNote,
      removeNote,
      archiveExistingNote,
      generateAiTitle,
      generateAiSummary,
      generateAiTags,
      generateAiTodos,
    ]
  );

  return (
    <NotesContext.Provider
      value={value}
    >
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const context =
    useContext(NotesContext);

  if (!context) {
    throw new Error(
      "useNotes must be used within a NotesProvider."
    );
  }

  return context;
}