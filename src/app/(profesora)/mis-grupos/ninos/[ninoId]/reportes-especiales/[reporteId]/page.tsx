import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { obtenerProfesoraActual } from "@/lib/profesora";
import { enviarReporteEspecialPorCorreo, eliminarReporteEspecial } from "@/lib/actions/reportes-especiales";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EliminarReporteButton } from "@/components/reportes/eliminar-reporte-button";
import { BackLink } from "@/components/ui/back-link";
import { formatearFecha } from "@/lib/utils";

export default async function ReporteEspecialPage({
  params,
}: {
  params: Promise<{ ninoId: string; reporteId: string }>;
}) {
  const { ninoId, reporteId } = await params;
  const profesora = await obtenerProfesoraActual();

  const reporte = await prisma.reporteEspecial.findFirst({
    where: {
      id: reporteId,
      ninoId,
      nino: {
        grupo: {
          OR: [{ profesoraPrincipalId: profesora.id }, { profesoraAuxiliarId: profesora.id }],
        },
      },
    },
    include: { nino: true, actividad: true, fotos: true },
  });

  if (!reporte) notFound();

  const destinatarios = [reporte.nino.correoPapa, reporte.nino.correoMama].filter(
    (correo): correo is string => Boolean(correo)
  );
  const enviar = enviarReporteEspecialPorCorreo.bind(null, reporte.id);
  const eliminar = eliminarReporteEspecial.bind(null, reporte.id);

  return (
    <div className="mx-auto max-w-2xl">
      <BackLink href={`/mis-grupos/ninos/${ninoId}`} className="mb-4" />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">
          {reporte.actividad.nombre} — {reporte.nino.nombre}
        </h1>
        <div className="flex items-center gap-3">
          <Badge variant={reporte.enviadoEmail ? "success" : "neutral"}>
            {reporte.enviadoEmail ? "Enviado" : "Sin enviar"}
          </Badge>
          <EliminarReporteButton action={eliminar} />
        </div>
      </div>
      <p className="mt-1 text-sm text-neutral-500">{formatearFecha(reporte.fecha)}</p>

      {reporte.comentario && <p className="mt-4 text-neutral-700">{reporte.comentario}</p>}

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {reporte.fotos.map((foto) => (
          <Image
            key={foto.id}
            src={foto.fotoUrl}
            alt={reporte.actividad.nombre}
            width={200}
            height={200}
            className="h-40 w-full rounded-md object-cover"
          />
        ))}
      </div>

      <div className="mt-6">
        {destinatarios.length === 0 ? (
          <p className="text-sm text-neutral-500">
            Este niño no tiene correo de papá ni de mamá registrado, no se puede enviar por correo.
          </p>
        ) : (
          <form action={enviar}>
            <Button type="submit">
              {reporte.enviadoEmail ? "Reenviar por correo" : "Enviar por correo"}
            </Button>
            <p className="mt-2 text-xs text-neutral-500">
              Se enviará a: {destinatarios.join(", ")} (fotos adjuntas)
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
