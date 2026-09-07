import { auth } from "@/lib/auth";
import { SignOutButton } from "@/components/SignOutButton";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-[color:var(--border-subtle)] bg-white">
        <div className="ef-container-product flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <span className="ef-dot" style={{ background: "var(--green-500)", width: 8, height: 8 }} />
            <span className="ef-h3">
              Vibe<span className="ef-accent">Tracker</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="ef-small text-neutral-600 hidden sm:inline">
              {session?.user?.name || session?.user?.email}
            </span>
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="flex-1 ef-container-product w-full py-8">{children}</main>
    </div>
  );
}
