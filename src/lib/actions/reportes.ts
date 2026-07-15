"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { obtenerProfesoraActual } from "@/lib/profesora";
import { enviarReporteSemanal } from "@/lib/email";
import { formatearFecha, obtenerSemanaActual } from "@/lib/utils";

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

  const entradas = actividadIds
    .map((actividadId, indice) => ({
      actividadId,
      observacion: (observaciones[indice] ?? "").trim(),
    }))
    .filter((entrada) => entrada.actividadId && entrada.observacion);

  if (entradas.length === 0) {
    throw new Error("Agrega al menos una actividad con su observación.");
  }

  const reporte = await prisma.reporteSemanal.create({
    data: {
      ninoId,
      profesoraId: profesora.id,
      fechaInicio: inicio,
      fechaFin: fin,
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
    include: { nino: true, observaciones: { include: { actividad: true } } },
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
    <ul>
      ${reporte.observaciones
        .map((o) => `<li><strong>${o.actividad.nombre}:</strong> ${o.observacion}</li>`)
        .join("")}
    </ul>
  `;

  await enviarReporteSemanal({ destinatarios, ninoNombre: reporte.nino.nombre, htmlReporte });

  await prisma.reporteSemanal.update({
    where: { id: reporteId },
    data: { enviadoEmail: true, enviadoA: destinatarios.join(", ") },
  });

  revalidatePath(`/mis-grupos/ninos/${reporte.ninoId}/reportes/${reporteId}`);
  revalidatePath(`/mis-grupos/ninos/${reporte.ninoId}`);
}
