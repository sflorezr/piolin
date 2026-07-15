import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { cambiarEstadoPregunta } from "@/lib/actions/preguntas";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default async function PreguntasPage() {
  const preguntas = await prisma.pregunta.findMany({ orderBy: { orden: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">Preguntas del reporte de entrega</h1>
        <Link href="/admin/preguntas/nueva">
          <Button>Nueva pregunta</Button>
        </Link>
      </div>

      <Card className="mt-6 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-left text-neutral-500">
            <tr>
              <th className="px-4 py-3 font-medium">Pregunta</th>
              <th className="px-4 py-3 font-medium">Tipo</th>
              <th className="px-4 py-3 font-medium">Opciones</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {preguntas.map((pregunta) => (
              <tr key={pregunta.id}>
                <td className="px-4 py-3 font-medium text-neutral-900">{pregunta.texto}</td>
                <td className="px-4 py-3 text-neutral-600">
                  {pregunta.tipo === "OPCION_MULTIPLE" ? "Opción múltiple" : "Abierta"}
                </td>
                <td className="px-4 py-3 text-neutral-600">
                  {pregunta.opciones.length > 0 ? pregunta.opciones.join(", ") : "—"}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={pregunta.estado === "ACTIVO" ? "success" : "neutral"}>
                    {pregunta.estado === "ACTIVO" ? "Activo" : "Inactivo"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/preguntas/${pregunta.id}`}>
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                    </Link>
                    <form
                      action={cambiarEstadoPregunta.bind(
                        null,
                        pregunta.id,
                        pregunta.estado === "ACTIVO" ? "INACTIVO" : "ACTIVO"
                      )}
                    >
                      <Button variant="ghost" size="sm" type="submit">
                        {pregunta.estado === "ACTIVO" ? "Desactivar" : "Activar"}
                      </Button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {preguntas.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-neutral-500">
                  No hay preguntas registradas todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
