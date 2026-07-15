"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

function leerDatosFormulario(formData: FormData) {
  const nombre = String(formData.get("nombre") ?? "").trim();

  if (!nombre) {
    throw new Error("El nombre de la actividad es obligatorio.");
  }

  return { nombre };
}

export async function crearActividad(formData: FormData) {
  const datos = leerDatosFormulario(formData);

  const ultima = await prisma.actividad.findFirst({ orderBy: { orden: "desc" } });

  await prisma.actividad.create({
    data: { ...datos, orden: (ultima?.orden ?? 0) + 1 },
  });

  revalidatePath("/admin/actividades");
  redirect("/admin/actividades");
}

export async function actualizarActividad(id: string, formData: FormData) {
  const datos = leerDatosFormulario(formData);

  await prisma.actividad.update({ where: { id }, data: datos });

  revalidatePath("/admin/actividades");
  redirect("/admin/actividades");
}

export async function cambiarEstadoActividad(id: string, estado: "ACTIVO" | "INACTIVO") {
  await prisma.actividad.update({ where: { id }, data: { estado } });
  revalidatePath("/admin/actividades");
}
