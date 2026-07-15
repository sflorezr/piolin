"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { subirFoto } from "@/lib/upload";

function leerDatosProfesora(formData: FormData) {
  const nombre = String(formData.get("nombre") ?? "").trim();
  const documento = String(formData.get("documento") ?? "").trim();
  const telefono = String(formData.get("telefono") ?? "").trim();

  if (!nombre || !documento || !telefono) {
    throw new Error("Nombre, documento y teléfono son obligatorios.");
  }

  return { nombre, documento, telefono };
}

export async function crearProfesora(formData: FormData) {
  const datos = leerDatosProfesora(formData);
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();

  if (!email || !password) {
    throw new Error("El correo y la contraseña de acceso son obligatorios.");
  }

  const foto = formData.get("foto") as File | null;
  const fotoUrl = foto ? await subirFoto(foto, "profesoras") : null;
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.profesora.create({
    data: {
      ...datos,
      fotoUrl,
      usuario: {
        create: { email, password: passwordHash, rol: "PROFESORA" },
      },
    },
  });

  revalidatePath("/admin/profesoras");
  redirect("/admin/profesoras");
}

export async function actualizarProfesora(id: string, formData: FormData) {
  const datos = leerDatosProfesora(formData);
  const foto = formData.get("foto") as File | null;
  const fotoUrl = foto && foto.size > 0 ? await subirFoto(foto, "profesoras") : undefined;

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();

  const datosUsuario: { email?: string; password?: string } = {};
  if (email) datosUsuario.email = email;
  if (password) datosUsuario.password = await bcrypt.hash(password, 10);

  await prisma.profesora.update({
    where: { id },
    data: {
      ...datos,
      ...(fotoUrl ? { fotoUrl } : {}),
      ...(Object.keys(datosUsuario).length > 0
        ? {
            usuario: {
              upsert: {
                update: datosUsuario,
                create: {
                  email: datosUsuario.email ?? "",
                  password: datosUsuario.password ?? "",
                  rol: "PROFESORA",
                },
              },
            },
          }
        : {}),
    },
  });

  revalidatePath("/admin/profesoras");
  redirect("/admin/profesoras");
}

export async function cambiarEstadoProfesora(id: string, estado: "ACTIVO" | "INACTIVO") {
  await prisma.profesora.update({ where: { id }, data: { estado } });
  revalidatePath("/admin/profesoras");
}
