import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { obtenerProfesoraActual } from "@/lib/profesora";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatearFecha } from "@/lib/utils";

export default async function NinoDetallePage({
  params,
}: {
  params: Promise<{ ninoId: string }>;
}) {
  const { ninoId } = await params;
  const profesora = await obtenerProfesoraActual();

  const nino = await prisma.nino.findFirst({
    where: {
      id: ninoId,
      grupo: {
        OR: [{ profesoraPrincipalId: profesora.id }, { profesoraAuxiliarId: profesora.id }],
      },
    },
    include: { grupo: true },
  });

  if (!nino) notFound();

  const reportes = await prisma.reporteSemanal.findMany({
    where: { ninoId: nino.id },
    orderBy: { fechaInicio: "desc" },
  });

  return (
    <div>
      <div className="flex items-center gap-4">
        {nino.fotoUrl ? (
          <Image
            src={nino.fotoUrl}
            alt={nino.nombre}
            width={64}
            height={64}
            className="h-16 w-16 rounded-full object-cover"
          />
        ) : (
          <div className="h-16 w-16 rounded-full bg-neutral-200" />
        )}
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">{nino.nombre}</h1>
          <p className="text-sm text-neutral-500">{nino.grupo.descripcion}</p>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-lg font-medium text-neutral-900">Reportes semanales</h2>
        <Link href={`/mis-grupos/ninos/${nino.id}/reportes/nuevo`}>
          <Button>Nuevo reporte semanal</Button>
        </Link>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {reportes.map((reporte) => (
          <Link key={reporte.id} href={`/mis-grupos/ninos/${nino.id}/reportes/${reporte.id}`}>
            <Card className="flex items-center justify-between p-4 transition-colors hover:border-neutral-400">
              <p className="font-medium text-neutral-900">
                {formatearFecha(reporte.fechaInicio)} — {formatearFecha(reporte.fechaFin)}
              </p>
              <Badge variant={reporte.enviadoEmail ? "success" : "neutral"}>
                {reporte.enviadoEmail ? "Enviado" : "Sin enviar"}
              </Badge>
            </Card>
          </Link>
        ))}
        {reportes.length === 0 && (
          <p className="text-neutral-500">Todavía no hay reportes semanales.</p>
        )}
      </div>
    </div>
  );
}
