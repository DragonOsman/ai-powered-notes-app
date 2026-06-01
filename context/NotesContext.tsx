"use client";

import React, { createContext, useContext, useState } from "react";
import { INote } from "../models/Note";

interface NotesContextType {
  notes: INote[];
  setNotes: React.Dispatch<React.SetStateAction<INote[]>>;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export function NotesProvider({ children }: { children: React.ReactNode }) {
  const [notes, setNotes] = useState<INote[]>([]);

  return (
    <NotesContext.Provider value={{ notes, setNotes }}>
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error("useNotes must be used within a NotesProvider");
  }
  return context;
}