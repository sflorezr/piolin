import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function obtenerProfesoraActual() {
  const session = await auth();

  if (!session?.user || session.user.rol !== "PROFESORA") {
    redirect("/login");
  }

  const profesora = await prisma.profesora.findUnique({ where: { usuarioId: session.user.id } });

  if (!profesora) {
    redirect("/login");
  }

  return profesora;
}
