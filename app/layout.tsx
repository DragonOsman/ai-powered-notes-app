import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

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
