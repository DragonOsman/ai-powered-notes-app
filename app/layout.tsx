import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI-Powered Notes",
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
      <body className="min-h-full flex flex-col bg-bg text-text">
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
