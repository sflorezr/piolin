import Link from "next/link";
import { signOut } from "@/lib/auth";

const NAV_ITEMS = [
  { href: "/admin", label: "Inicio" },
  { href: "/admin/profesoras", label: "Profesoras" },
  { href: "/admin/grupos", label: "Grupos" },
  { href: "/admin/ninos", label: "Niños" },
  { href: "/admin/preguntas", label: "Preguntas" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <nav className="flex gap-4 text-sm font-medium">
            {NAV_ITEMS.map((item) => (
              <Link key={item.href} href={item.href} className="text-neutral-700 hover:text-neutral-950">
                {item.label}
              </Link>
            ))}
          </nav>
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
