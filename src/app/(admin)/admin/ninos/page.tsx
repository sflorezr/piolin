import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { cambiarEstadoNino } from "@/lib/actions/ninos";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default async function NinosPage() {
  const ninos = await prisma.nino.findMany({
    orderBy: { nombre: "asc" },
    include: { grupo: true },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">Niños</h1>
        <Link href="/admin/ninos/nuevo">
          <Button>Nuevo niño</Button>
        </Link>
      </div>

      <Card className="mt-6 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-left text-neutral-500">
            <tr>
              <th className="px-4 py-3 font-medium">Foto</th>
              <th className="px-4 py-3 font-medium">Nombre</th>
              <th className="px-4 py-3 font-medium">Grupo</th>
              <th className="px-4 py-3 font-medium">Hora de entrega</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {ninos.map((nino) => (
              <tr key={nino.id}>
                <td className="px-4 py-3">
                  {nino.fotoUrl ? (
                    <Image
                      src={nino.fotoUrl}
                      alt={nino.nombre}
                      width={36}
                      height={36}
                      className="h-9 w-9 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-9 w-9 rounded-full bg-neutral-200" />
                  )}
                </td>
                <td className="px-4 py-3 font-medium text-neutral-900">{nino.nombre}</td>
                <td className="px-4 py-3 text-neutral-600">{nino.grupo.descripcion}</td>
                <td className="px-4 py-3 text-neutral-600">{nino.horaEntrega ?? "—"}</td>
                <td className="px-4 py-3">
                  <Badge variant={nino.estado === "ACTIVO" ? "success" : "neutral"}>
                    {nino.estado === "ACTIVO" ? "Activo" : "Inactivo"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/ninos/${nino.id}`}>
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                    </Link>
                    <form
                      action={cambiarEstadoNino.bind(
                        null,
                        nino.id,
                        nino.estado === "ACTIVO" ? "INACTIVO" : "ACTIVO"
                      )}
                    >
                      <SubmitButton variant="ghost" size="sm">
                        {nino.estado === "ACTIVO" ? "Desactivar" : "Activar"}
                      </SubmitButton>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {ninos.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-neutral-500">
                  No hay niños registrados todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
