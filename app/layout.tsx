import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import { NotesProvider } from "@/context/NotesContext";
import ThemeProvider from "@/components/providers/ThemeProvider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: {
    default: "DragonOsman's AI Notes",
    template: "%s | DragonOsman's AI Notes"
  },
  description: "AI-powered note-taking app built with Next.js and Tailwind CSS"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
    >
      <body className="min-h-screen bg-app text-app">
        <ThemeProvider>
          <NotesProvider>
            <Header />
            <main className="pt-16">
              {children}
              <Toaster richColors />
            </main>
          </NotesProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
