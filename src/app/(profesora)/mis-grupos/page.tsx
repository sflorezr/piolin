import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { obtenerProfesoraActual } from "@/lib/profesora";
import { Card } from "@/components/ui/card";

export default async function MisGruposPage() {
  const profesora = await obtenerProfesoraActual();

  const grupos = await prisma.grupo.findMany({
    where: {
      estado: "ACTIVO",
      OR: [{ profesoraPrincipalId: profesora.id }, { profesoraAuxiliarId: profesora.id }],
    },
    orderBy: { descripcion: "asc" },
    include: { _count: { select: { ninos: true } } },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900">Mis grupos</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {grupos.map((grupo) => (
          <Link key={grupo.id} href={`/mis-grupos/${grupo.id}`}>
            <Card className="p-4 transition-colors hover:border-neutral-400">
              <p className="font-medium text-neutral-900">{grupo.descripcion}</p>
              <p className="mt-1 text-sm text-neutral-500">{grupo._count.ninos} niños</p>
            </Card>
          </Link>
        ))}
        {grupos.length === 0 && <p className="text-neutral-500">No tienes grupos asignados todavía.</p>}
      </div>
    </div>
  );
}
