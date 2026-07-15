"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { subirFoto } from "@/lib/upload";

function leerDatosFormulario(formData: FormData) {
  const nombre = String(formData.get("nombre") ?? "").trim();
  const documento = String(formData.get("documento") ?? "").trim();
  const telefono = String(formData.get("telefono") ?? "").trim();

  if (!nombre || !documento || !telefono) {
    throw new Error("Nombre, documento y teléfono son obligatorios.");
  }

  return { nombre, documento, telefono };
}

export async function crearProfesora(formData: FormData) {
  const datos = leerDatosFormulario(formData);
  const foto = formData.get("foto") as File | null;
  const fotoUrl = foto ? await subirFoto(foto, "profesoras") : null;

  await prisma.profesora.create({
    data: { ...datos, fotoUrl },
  });

  revalidatePath("/admin/profesoras");
  redirect("/admin/profesoras");
}

export async function actualizarProfesora(id: string, formData: FormData) {
  const datos = leerDatosFormulario(formData);
  const foto = formData.get("foto") as File | null;
  const fotoUrl = foto && foto.size > 0 ? await subirFoto(foto, "profesoras") : undefined;

  await prisma.profesora.update({
    where: { id },
    data: { ...datos, ...(fotoUrl ? { fotoUrl } : {}) },
  });

  revalidatePath("/admin/profesoras");
  redirect("/admin/profesoras");
}

export async function cambiarEstadoProfesora(id: string, estado: "ACTIVO" | "INACTIVO") {
  await prisma.profesora.update({ where: { id }, data: { estado } });
  revalidatePath("/admin/profesoras");
}
