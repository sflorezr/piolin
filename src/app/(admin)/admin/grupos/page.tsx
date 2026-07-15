import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { cambiarEstadoGrupo } from "@/lib/actions/grupos";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default async function GruposPage() {
  const grupos = await prisma.grupo.findMany({
    orderBy: { descripcion: "asc" },
    include: {
      profesoraPrincipal: true,
      profesoraAuxiliar: true,
      _count: { select: { ninos: true } },
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">Grupos</h1>
        <Link href="/admin/grupos/nuevo">
          <Button>Nuevo grupo</Button>
        </Link>
      </div>

      <Card className="mt-6 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-left text-neutral-500">
            <tr>
              <th className="px-4 py-3 font-medium">Descripción</th>
              <th className="px-4 py-3 font-medium">Profesora principal</th>
              <th className="px-4 py-3 font-medium">Profesora auxiliar</th>
              <th className="px-4 py-3 font-medium">Niños</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {grupos.map((grupo) => (
              <tr key={grupo.id}>
                <td className="px-4 py-3 font-medium text-neutral-900">{grupo.descripcion}</td>
                <td className="px-4 py-3 text-neutral-600">{grupo.profesoraPrincipal.nombre}</td>
                <td className="px-4 py-3 text-neutral-600">
                  {grupo.profesoraAuxiliar?.nombre ?? "—"}
                </td>
                <td className="px-4 py-3 text-neutral-600">{grupo._count.ninos}</td>
                <td className="px-4 py-3">
                  <Badge variant={grupo.estado === "ACTIVO" ? "success" : "neutral"}>
                    {grupo.estado === "ACTIVO" ? "Activo" : "Inactivo"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/grupos/${grupo.id}`}>
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                    </Link>
                    <form
                      action={cambiarEstadoGrupo.bind(
                        null,
                        grupo.id,
                        grupo.estado === "ACTIVO" ? "INACTIVO" : "ACTIVO"
                      )}
                    >
                      <Button variant="ghost" size="sm" type="submit">
                        {grupo.estado === "ACTIVO" ? "Desactivar" : "Activar"}
                      </Button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {grupos.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-neutral-500">
                  No hay grupos registrados todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
