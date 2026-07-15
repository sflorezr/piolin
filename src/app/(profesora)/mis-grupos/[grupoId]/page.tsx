import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { obtenerProfesoraActual } from "@/lib/profesora";
import { Card } from "@/components/ui/card";

export default async function GrupoDetallePage({
  params,
}: {
  params: Promise<{ grupoId: string }>;
}) {
  const { grupoId } = await params;
  const profesora = await obtenerProfesoraActual();

  const grupo = await prisma.grupo.findFirst({
    where: {
      id: grupoId,
      OR: [{ profesoraPrincipalId: profesora.id }, { profesoraAuxiliarId: profesora.id }],
    },
    include: { ninos: { where: { estado: "ACTIVO" }, orderBy: { nombre: "asc" } } },
  });

  if (!grupo) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900">{grupo.descripcion}</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {grupo.ninos.map((nino) => (
          <Link key={nino.id} href={`/mis-grupos/ninos/${nino.id}`}>
            <Card className="flex items-center gap-3 p-4 transition-colors hover:border-neutral-400">
              {nino.fotoUrl ? (
                <Image
                  src={nino.fotoUrl}
                  alt={nino.nombre}
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-neutral-200" />
              )}
              <p className="font-medium text-neutral-900">{nino.nombre}</p>
            </Card>
          </Link>
        ))}
        {grupo.ninos.length === 0 && (
          <p className="text-neutral-500">Este grupo no tiene niños activos.</p>
        )}
      </div>
    </div>
  );
}
