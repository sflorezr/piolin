"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

function leerDatosFormulario(formData: FormData) {
  const descripcion = String(formData.get("descripcion") ?? "").trim();
  const profesoraPrincipalId = String(formData.get("profesoraPrincipalId") ?? "").trim();
  const profesoraAuxiliarId = String(formData.get("profesoraAuxiliarId") ?? "").trim();

  if (!descripcion || !profesoraPrincipalId) {
    throw new Error("La descripción y la profesora principal son obligatorias.");
  }

  return {
    descripcion,
    profesoraPrincipalId,
    profesoraAuxiliarId: profesoraAuxiliarId || null,
  };
}

export async function crearGrupo(formData: FormData) {
  const datos = leerDatosFormulario(formData);

  await prisma.grupo.create({ data: datos });

  revalidatePath("/admin/grupos");
  redirect("/admin/grupos");
}

export async function actualizarGrupo(id: string, formData: FormData) {
  const datos = leerDatosFormulario(formData);

  await prisma.grupo.update({ where: { id }, data: datos });

  revalidatePath("/admin/grupos");
  redirect("/admin/grupos");
}

export async function cambiarEstadoGrupo(id: string, estado: "ACTIVO" | "INACTIVO") {
  await prisma.grupo.update({ where: { id }, data: { estado } });
  revalidatePath("/admin/grupos");
}
