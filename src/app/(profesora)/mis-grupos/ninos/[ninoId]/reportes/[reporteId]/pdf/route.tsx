import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { obtenerProfesoraActual } from "@/lib/profesora";
import { construirPropsReportePdf, generarBufferReporteSemanal } from "@/lib/pdf/reporte-semanal-pdf";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ ninoId: string; reporteId: string }> }
) {
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
      nino: { include: { grupo: true } },
      profesora: true,
      observaciones: { include: { actividad: true } },
    },
  });

  if (!reporte) {
    return new NextResponse("Reporte no encontrado.", { status: 404 });
  }

  const buffer = await generarBufferReporteSemanal(construirPropsReportePdf(reporte));
  const nombreArchivo = `reporte-${reporte.nino.nombre.toLowerCase().replace(/\s+/g, "-")}.pdf`;

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${nombreArchivo}"`,
    },
  });
}
