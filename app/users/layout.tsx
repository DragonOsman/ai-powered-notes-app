import Link from "next/link";

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-app text-app flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-app bg-surface p-6">
        <h2 className="text-lg font-semibold mb-6">Account</h2>

        <nav className="flex flex-col gap-3 text-sm">
          <Link href="/users/profile" className="hover:text-primary">
            Profile
          </Link>

          <Link href="/users/settings" className="hover:text-primary">
            Settings
          </Link>

          <Link href="/notes" className="hover:text-primary">
            Notes
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}