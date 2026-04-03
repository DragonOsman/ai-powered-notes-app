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
      className={``}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
