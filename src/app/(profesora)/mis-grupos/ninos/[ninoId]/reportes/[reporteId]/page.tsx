import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { obtenerProfesoraActual } from "@/lib/profesora";
import { enviarReporteSemanalPorCorreo, eliminarReporteSemanal } from "@/lib/actions/reportes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EliminarReporteButton } from "@/components/reportes/eliminar-reporte-button";
import { formatearFecha } from "@/lib/utils";

export default async function ReporteSemanalPage({
  params,
}: {
  params: Promise<{ ninoId: string; reporteId: string }>;
}) {
  const { ninoId, reporteId } = await params;
  const profesora = await obtenerProfesoraActual();

  const reporte = await prisma.reporteSemanal.findFirst({
    where: {
      id: reporteId,
      ninoId,
      nino: {
        grupo: {
          OR: [{ profesoraPrincipalId: profesora.id }, { profesoraAuxiliarId: profesora.id }],
        },
      },
    },
    include: {
      nino: true,
      observaciones: { include: { actividad: true } },
    },
  });

  if (!reporte) notFound();

  const destinatarios = [reporte.nino.correoPapa, reporte.nino.correoMama].filter(
    (correo): correo is string => Boolean(correo)
  );
  const enviar = enviarReporteSemanalPorCorreo.bind(null, reporte.id);
  const eliminar = eliminarReporteSemanal.bind(null, reporte.id);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">
          Reporte semanal — {reporte.nino.nombre}
        </h1>
        <div className="flex items-center gap-3">
          <Badge variant={reporte.enviadoEmail ? "success" : "neutral"}>
            {reporte.enviadoEmail ? "Enviado" : "Sin enviar"}
          </Badge>
          <EliminarReporteButton action={eliminar} />
        </div>
      </div>
      <p className="mt-1 text-sm text-neutral-500">
        {formatearFecha(reporte.fechaInicio)} — {formatearFecha(reporte.fechaFin)}
      </p>

      <a
        href={`/mis-grupos/ninos/${ninoId}/reportes/${reporteId}/pdf`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-block"
      >
        <Button variant="outline" size="sm">
          Ver / descargar PDF
        </Button>
      </a>

      {reporte.comentarioGeneral && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">Comentario general de la semana</CardTitle>
          </CardHeader>
          <CardContent className="text-neutral-700">{reporte.comentarioGeneral}</CardContent>
        </Card>
      )}

      <div className="mt-6 flex flex-col gap-4">
        {reporte.observaciones.map((observacion) => (
          <Card key={observacion.id}>
            <CardHeader>
              <CardTitle className="text-base">{observacion.actividad.nombre}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-neutral-700">
              {observacion.observacion}
              {observacion.fotoUrl && (
                <Image
                  src={observacion.fotoUrl}
                  alt={observacion.actividad.nombre}
                  width={320}
                  height={240}
                  className="max-h-60 w-auto rounded-md object-cover"
                />
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6">
        {destinatarios.length === 0 ? (
          <p className="text-sm text-neutral-500">
            Este niño no tiene correo de papá ni de mamá registrado, no se puede enviar por correo.
          </p>
        ) : (
          <form action={enviar}>
            <Button type="submit">{reporte.enviadoEmail ? "Reenviar por correo" : "Enviar por correo"}</Button>
            <p className="mt-2 text-xs text-neutral-500">Se enviará a: {destinatarios.join(", ")}</p>
          </form>
        )}
      </div>
    </div>
  );
}
