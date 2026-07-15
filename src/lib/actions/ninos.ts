"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { subirFoto } from "@/lib/upload";

function leerDatosFormulario(formData: FormData) {
  const nombre = String(formData.get("nombre") ?? "").trim();
  const fechaNacimiento = String(formData.get("fechaNacimiento") ?? "").trim();
  const grupoId = String(formData.get("grupoId") ?? "").trim();

  if (!nombre || !fechaNacimiento || !grupoId) {
    throw new Error("Nombre, fecha de nacimiento y grupo son obligatorios.");
  }

  const opcional = (campo: string) => {
    const valor = String(formData.get(campo) ?? "").trim();
    return valor || null;
  };

  return {
    nombre,
    fechaNacimiento: new Date(fechaNacimiento),
    grupoId,
    nombrePapa: opcional("nombrePapa"),
    celularPapa: opcional("celularPapa"),
    correoPapa: opcional("correoPapa"),
    nombreMama: opcional("nombreMama"),
    celularMama: opcional("celularMama"),
    correoMama: opcional("correoMama"),
    horaEntrega: opcional("horaEntrega"),
  };
}

export async function crearNino(formData: FormData) {
  const datos = leerDatosFormulario(formData);
  const foto = formData.get("foto") as File | null;
  const fotoUrl = foto ? await subirFoto(foto, "ninos") : null;

  await prisma.nino.create({ data: { ...datos, fotoUrl } });

  revalidatePath("/admin/ninos");
  redirect("/admin/ninos");
}

export async function actualizarNino(id: string, formData: FormData) {
  const datos = leerDatosFormulario(formData);
  const foto = formData.get("foto") as File | null;
  const fotoUrl = foto && foto.size > 0 ? await subirFoto(foto, "ninos") : undefined;

  await prisma.nino.update({
    where: { id },
    data: { ...datos, ...(fotoUrl ? { fotoUrl } : {}) },
  });

  revalidatePath("/admin/ninos");
  redirect("/admin/ninos");
}

export async function cambiarEstadoNino(id: string, estado: "ACTIVO" | "INACTIVO") {
  await prisma.nino.update({ where: { id }, data: { estado } });
  revalidatePath("/admin/ninos");
}
