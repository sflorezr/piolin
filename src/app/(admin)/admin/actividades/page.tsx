import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { cambiarEstadoActividad } from "@/lib/actions/actividades";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default async function ActividadesPage() {
  const actividades = await prisma.actividad.findMany({ orderBy: { orden: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">Actividades</h1>
        <Link href="/admin/actividades/nueva">
          <Button>Nueva actividad</Button>
        </Link>
      </div>
      <p className="mt-2 text-sm text-neutral-600">
        Catálogo de actividades: las semanales arman el reporte de la semana, las especiales de un día
        se usan para el reporte puntual de una actividad especial.
      </p>

      <Card className="mt-6 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-left text-neutral-500">
            <tr>
              <th className="px-4 py-3 font-medium">Actividad</th>
              <th className="px-4 py-3 font-medium">Alcance</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {actividades.map((actividad) => (
              <tr key={actividad.id}>
                <td className="px-4 py-3 font-medium text-neutral-900">{actividad.nombre}</td>
                <td className="px-4 py-3">
                  <Badge variant="neutral">
                    {actividad.alcance === "SEMANAL" ? "Semanal" : "Especial (1 día)"}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={actividad.estado === "ACTIVO" ? "success" : "neutral"}>
                    {actividad.estado === "ACTIVO" ? "Activo" : "Inactivo"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/actividades/${actividad.id}`}>
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                    </Link>
                    <form
                      action={cambiarEstadoActividad.bind(
                        null,
                        actividad.id,
                        actividad.estado === "ACTIVO" ? "INACTIVO" : "ACTIVO"
                      )}
                    >
                      <Button variant="ghost" size="sm" type="submit">
                        {actividad.estado === "ACTIVO" ? "Desactivar" : "Activar"}
                      </Button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {actividades.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-neutral-500">
                  No hay actividades registradas todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
