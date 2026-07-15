"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

function leerDatosFormulario(formData: FormData) {
  const texto = String(formData.get("texto") ?? "").trim();
  const tipo = String(formData.get("tipo") ?? "").trim();

  if (!texto || (tipo !== "OPCION_MULTIPLE" && tipo !== "ABIERTA")) {
    throw new Error("El texto y el tipo de pregunta son obligatorios.");
  }

  const opciones =
    tipo === "OPCION_MULTIPLE"
      ? formData
          .getAll("opciones")
          .map((valor) => String(valor).trim())
          .filter(Boolean)
      : [];

  if (tipo === "OPCION_MULTIPLE" && opciones.length < 2) {
    throw new Error("Una pregunta de opción múltiple necesita al menos 2 opciones.");
  }

  return { texto, tipo: tipo as "OPCION_MULTIPLE" | "ABIERTA", opciones };
}

export async function crearPregunta(formData: FormData) {
  const datos = leerDatosFormulario(formData);

  const ultima = await prisma.pregunta.findFirst({ orderBy: { orden: "desc" } });

  await prisma.pregunta.create({
    data: { ...datos, orden: (ultima?.orden ?? 0) + 1 },
  });

  revalidatePath("/admin/preguntas");
  redirect("/admin/preguntas");
}

export async function actualizarPregunta(id: string, formData: FormData) {
  const datos = leerDatosFormulario(formData);

  await prisma.pregunta.update({ where: { id }, data: datos });

  revalidatePath("/admin/preguntas");
  redirect("/admin/preguntas");
}

export async function cambiarEstadoPregunta(id: string, estado: "ACTIVO" | "INACTIVO") {
  await prisma.pregunta.update({ where: { id }, data: { estado } });
  revalidatePath("/admin/preguntas");
}
