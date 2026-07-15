import Link from "next/link";
import { signOut } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default function ProfesoraLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link href="/mis-grupos" className="text-sm font-medium text-neutral-700 hover:text-neutral-950">
            Mis grupos
          </Link>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button className="text-sm text-neutral-500 hover:text-neutral-950">Salir</button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
