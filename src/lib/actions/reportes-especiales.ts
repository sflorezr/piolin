"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { obtenerProfesoraActual } from "@/lib/profesora";
import { subirFoto } from "@/lib/upload";
import { enviarReporteEspecial } from "@/lib/email";

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

export async function crearReporteEspecial(ninoId: string, formData: FormData) {
  const profesora = await obtenerProfesoraActual();
  await verificarAccesoAlNino(ninoId, profesora.id);

  const actividadId = String(formData.get("actividadId") ?? "").trim();
  const fecha = String(formData.get("fecha") ?? "").trim();
  const comentario = String(formData.get("comentario") ?? "").trim() || null;

  if (!actividadId || !fecha) {
    throw new Error("Selecciona la actividad y la fecha.");
  }

  const fotos = (formData.getAll("fotos") as File[]).filter((foto) => foto && foto.size > 0);

  if (fotos.length === 0) {
    throw new Error("Agrega al menos una foto.");
  }

  const fotoUrls = await Promise.all(fotos.map((foto) => subirFoto(foto, "reportes-especiales")));

  const reporte = await prisma.reporteEspecial.create({
    data: {
      ninoId,
      profesoraId: profesora.id,
      actividadId,
      fecha: new Date(fecha),
      comentario,
      fotos: {
        create: fotoUrls
          .filter((url): url is string => Boolean(url))
          .map((fotoUrl) => ({ fotoUrl })),
      },
    },
  });

  revalidatePath(`/mis-grupos/ninos/${ninoId}`);
  redirect(`/mis-grupos/ninos/${ninoId}/reportes-especiales/${reporte.id}`);
}

export async function enviarReporteEspecialPorCorreo(reporteId: string) {
  const profesora = await obtenerProfesoraActual();

  const reporte = await prisma.reporteEspecial.findFirst({
    where: {
      id: reporteId,
      nino: {
        grupo: {
          OR: [{ profesoraPrincipalId: profesora.id }, { profesoraAuxiliarId: profesora.id }],
        },
      },
    },
    include: { nino: true, actividad: true, fotos: true },
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

  if (reporte.fotos.length === 0) {
    throw new Error("El reporte no tiene fotos para adjuntar.");
  }

  await enviarReporteEspecial({
    destinatarios,
    ninoNombre: reporte.nino.nombre,
    actividadNombre: reporte.actividad.nombre,
    fecha: reporte.fecha,
    comentario: reporte.comentario,
    fotos: reporte.fotos.map((foto, indice) => ({
      filename: `foto-${indice + 1}.jpg`,
      url: foto.fotoUrl,
    })),
  });

  await prisma.reporteEspecial.update({
    where: { id: reporteId },
    data: { enviadoEmail: true, enviadoA: destinatarios.join(", ") },
  });

  revalidatePath(`/mis-grupos/ninos/${reporte.ninoId}/reportes-especiales/${reporteId}`);
  revalidatePath(`/mis-grupos/ninos/${reporte.ninoId}`);
}

export async function eliminarReporteEspecial(reporteId: string) {
  const profesora = await obtenerProfesoraActual();

  const reporte = await prisma.reporteEspecial.findFirst({
    where: {
      id: reporteId,
      nino: {
        grupo: {
          OR: [{ profesoraPrincipalId: profesora.id }, { profesoraAuxiliarId: profesora.id }],
        },
      },
    },
  });

  if (!reporte) {
    throw new Error("Reporte no encontrado.");
  }

  await prisma.$transaction([
    prisma.fotoReporteEspecial.deleteMany({ where: { reporteId } }),
    prisma.reporteEspecial.delete({ where: { id: reporteId } }),
  ]);

  revalidatePath(`/mis-grupos/ninos/${reporte.ninoId}`);
  redirect(`/mis-grupos/ninos/${reporte.ninoId}`);
}
