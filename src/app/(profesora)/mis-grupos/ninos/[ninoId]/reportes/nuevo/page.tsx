import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { obtenerProfesoraActual } from "@/lib/profesora";
import { crearReporteSemanal } from "@/lib/actions/reportes";
import { ReporteSemanalForm } from "@/components/reportes/reporte-semanal-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

  const actividades = await prisma.actividad.findMany({
    where: { estado: "ACTIVO" },
    orderBy: { orden: "asc" },
  });

  const crear = crearReporteSemanal.bind(null, nino.id);

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-2xl font-semibold text-neutral-900">
        Nuevo reporte semanal — {nino.nombre}
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
            <ReporteSemanalForm action={crear} actividades={actividades} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
