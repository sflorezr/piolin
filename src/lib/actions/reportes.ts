"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { obtenerProfesoraActual } from "@/lib/profesora";
import { enviarReporteSemanal } from "@/lib/email";
import { formatearFecha, obtenerSemanaActual } from "@/lib/utils";
import { construirPropsReportePdf, generarBufferReporteSemanal } from "@/lib/pdf/reporte-semanal-pdf";
import { subirFoto } from "@/lib/upload";

async function verificarAccesoAlNino(ninoId: string, profesoraId: string) {
  const nino = await prisma.nino.findFirst({
    where: {
      id: ninoId,
      grupo: {
        OR: [{ profesoraPrincipalId: profesoraId }, { profesoraAuxiliarId: profesoraId }],
      },
    },
  });

  if (!nino) {
    throw new Error("No tienes acceso a este niño.");
  }

  return nino;
}

export async function crearReporteSemanal(ninoId: string, formData: FormData) {
  const profesora = await obtenerProfesoraActual();
  await verificarAccesoAlNino(ninoId, profesora.id);

  const { inicio, fin } = obtenerSemanaActual();

  const existente = await prisma.reporteSemanal.findUnique({
    where: { ninoId_fechaInicio: { ninoId, fechaInicio: inicio } },
  });

  if (existente) {
    redirect(`/mis-grupos/ninos/${ninoId}/reportes/${existente.id}`);
  }

  const actividadIds = formData.getAll("actividadId").map(String);
  const observaciones = formData.getAll("observacion").map(String);
  const fotos = formData.getAll("foto") as File[];

  const entradas: { actividadId: string; observacion: string; fotoUrl: string | null }[] = [];

  for (let indice = 0; indice < actividadIds.length; indice++) {
    const actividadId = actividadIds[indice];
    const observacion = (observaciones[indice] ?? "").trim();

    if (!actividadId || !observacion) continue;

    const foto = fotos[indice];
    const fotoUrl = foto && foto.size > 0 ? await subirFoto(foto, "reportes") : null;

    entradas.push({ actividadId, observacion, fotoUrl });
  }

  if (entradas.length === 0) {
    throw new Error("Agrega al menos una actividad con su observación.");
  }

  const comentarioGeneral = String(formData.get("comentarioGeneral") ?? "").trim() || null;

  const reporte = await prisma.reporteSemanal.create({
    data: {
      ninoId,
      profesoraId: profesora.id,
      fechaInicio: inicio,
      fechaFin: fin,
      comentarioGeneral,
      observaciones: { create: entradas },
    },
  });

  revalidatePath(`/mis-grupos/ninos/${ninoId}`);
  redirect(`/mis-grupos/ninos/${ninoId}/reportes/${reporte.id}`);
}

export async function enviarReporteSemanalPorCorreo(reporteId: string) {
  const profesora = await obtenerProfesoraActual();

  const reporte = await prisma.reporteSemanal.findFirst({
    where: {
      id: reporteId,
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
    throw new Error("Reporte no encontrado.");
  }

  const destinatarios = [reporte.nino.correoPapa, reporte.nino.correoMama].filter(
    (correo): correo is string => Boolean(correo)
  );

  if (destinatarios.length === 0) {
    throw new Error("El niño no tiene correo de papá ni de mamá registrado.");
  }

  const htmlReporte = `
    <h2>Reporte semanal de ${reporte.nino.nombre}</h2>
    <p>${formatearFecha(reporte.fechaInicio)} — ${formatearFecha(reporte.fechaFin)}</p>
    <p>Encontrarás el detalle completo en el PDF adjunto.</p>
  `;

  const adjuntoPdf = await generarBufferReporteSemanal(construirPropsReportePdf(reporte));
  const nombreAdjunto = `reporte-${reporte.nino.nombre.toLowerCase().replace(/\s+/g, "-")}.pdf`;

  await enviarReporteSemanal({
    destinatarios,
    ninoNombre: reporte.nino.nombre,
    htmlReporte,
    adjuntoPdf,
    nombreAdjunto,
  });

  await prisma.reporteSemanal.update({
    where: { id: reporteId },
    data: { enviadoEmail: true, enviadoA: destinatarios.join(", ") },
  });

  revalidatePath(`/mis-grupos/ninos/${reporte.ninoId}/reportes/${reporteId}`);
  revalidatePath(`/mis-grupos/ninos/${reporte.ninoId}`);
}
