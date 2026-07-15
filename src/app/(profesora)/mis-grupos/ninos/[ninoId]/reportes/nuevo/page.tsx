import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { obtenerProfesoraActual } from "@/lib/profesora";
import { crearReporteSemanal } from "@/lib/actions/reportes";
import { ReporteSemanalForm } from "@/components/reportes/reporte-semanal-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatearFecha, obtenerSemanaActual } from "@/lib/utils";

export default async function NuevoReporteSemanalPage({
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
  });

  if (!nino) notFound();

  const { inicio, fin } = obtenerSemanaActual();
  const rangoSemana = `${formatearFecha(inicio)} — ${formatearFecha(fin)}`;

  const existente = await prisma.reporteSemanal.findUnique({
    where: { ninoId_fechaInicio: { ninoId, fechaInicio: inicio } },
  });

  if (existente) {
    return (
      <div className="mx-auto max-w-lg">
        <h1 className="text-2xl font-semibold text-neutral-900">
          Reporte semanal — {nino.nombre}
        </h1>
        <p className="mt-2 text-neutral-600">
          Ya existe un reporte para la semana del {rangoSemana}.
        </p>
        <Link href={`/mis-grupos/ninos/${nino.id}/reportes/${existente.id}`}>
          <Button className="mt-4">Ver reporte de esta semana</Button>
        </Link>
      </div>
    );
  }

  const actividades = await prisma.actividad.findMany({
    where: { estado: "ACTIVO" },
    orderBy: { orden: "asc" },
  });

  const crear = crearReporteSemanal.bind(null, nino.id);

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-2xl font-semibold text-neutral-900">
        Reporte de esta semana — {nino.nombre}
      </h1>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Actividades de la semana</CardTitle>
        </CardHeader>
        <CardContent>
          {actividades.length === 0 ? (
            <p className="text-neutral-500">
              Todavía no hay actividades en el catálogo. Pide al administrador que cree al menos una
              en &quot;Actividades&quot;.
            </p>
          ) : (
            <ReporteSemanalForm action={crear} actividades={actividades} rangoSemana={rangoSemana} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
