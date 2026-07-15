import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { cambiarEstadoProfesora } from "@/lib/actions/profesoras";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default async function ProfesorasPage() {
  const profesoras = await prisma.profesora.findMany({ orderBy: { nombre: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">Profesoras</h1>
        <Link href="/admin/profesoras/nueva">
          <Button>Nueva profesora</Button>
        </Link>
      </div>

      <Card className="mt-6 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-left text-neutral-500">
            <tr>
              <th className="px-4 py-3 font-medium">Foto</th>
              <th className="px-4 py-3 font-medium">Nombre</th>
              <th className="px-4 py-3 font-medium">Documento</th>
              <th className="px-4 py-3 font-medium">Teléfono</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {profesoras.map((profesora) => (
              <tr key={profesora.id}>
                <td className="px-4 py-3">
                  {profesora.fotoUrl ? (
                    <Image
                      src={profesora.fotoUrl}
                      alt={profesora.nombre}
                      width={36}
                      height={36}
                      className="h-9 w-9 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-9 w-9 rounded-full bg-neutral-200" />
                  )}
                </td>
                <td className="px-4 py-3 font-medium text-neutral-900">{profesora.nombre}</td>
                <td className="px-4 py-3 text-neutral-600">{profesora.documento}</td>
                <td className="px-4 py-3 text-neutral-600">{profesora.telefono}</td>
                <td className="px-4 py-3">
                  <Badge variant={profesora.estado === "ACTIVO" ? "success" : "neutral"}>
                    {profesora.estado === "ACTIVO" ? "Activo" : "Inactivo"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/profesoras/${profesora.id}`}>
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                    </Link>
                    <form
                      action={cambiarEstadoProfesora.bind(
                        null,
                        profesora.id,
                        profesora.estado === "ACTIVO" ? "INACTIVO" : "ACTIVO"
                      )}
                    >
                      <Button variant="ghost" size="sm" type="submit">
                        {profesora.estado === "ACTIVO" ? "Desactivar" : "Activar"}
                      </Button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {profesoras.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-neutral-500">
                  No hay profesoras registradas todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
