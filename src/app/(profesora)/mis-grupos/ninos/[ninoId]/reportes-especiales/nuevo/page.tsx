import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { obtenerProfesoraActual } from "@/lib/profesora";
import { crearReporteEspecial } from "@/lib/actions/reportes-especiales";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BackLink } from "@/components/ui/back-link";

export default async function NuevoReporteEspecialPage({
  params,
}: {
  params: Promise<{ ninoId: string }>;
}) {
  const { ninoId } = await params;
  const profesora = await obtenerProfesoraActual();

  const nino = await prisma.nino.findFirst({
    where: {
      id: ninoId,
      grupo: {
        OR: [{ profesoraPrincipalId: profesora.id }, { profesoraAuxiliarId: profesora.id }],
      },
    },
  });

  if (!nino) notFound();

  const actividades = await prisma.actividad.findMany({
    where: { estado: "ACTIVO", alcance: "DIARIA" },
    orderBy: { orden: "asc" },
  });

  const crear = crearReporteEspecial.bind(null, nino.id);
  const hoy = new Date().toISOString().slice(0, 10);

  return (
    <div className="mx-auto max-w-lg">
      <BackLink href={`/mis-grupos/ninos/${nino.id}`} className="mb-4" />
      <h1 className="text-2xl font-semibold text-neutral-900">
        Nuevo reporte especial — {nino.nombre}
      </h1>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Actividad especial</CardTitle>
        </CardHeader>
        <CardContent>
          {actividades.length === 0 ? (
            <p className="text-neutral-500">
              Todavía no hay actividades especiales en el catálogo. Pide al administrador que cree una
              actividad con alcance &quot;Especial de un día&quot; en &quot;Actividades&quot;.
            </p>
          ) : (
            <form action={crear} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="actividadId">Actividad</Label>
                <Select id="actividadId" name="actividadId" required defaultValue="">
                  <option value="" disabled>
                    Selecciona una actividad
                  </option>
                  {actividades.map((actividad) => (
                    <option key={actividad.id} value={actividad.id}>
                      {actividad.nombre}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="fecha">Fecha</Label>
                <Input id="fecha" name="fecha" type="date" defaultValue={hoy} required />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="fotos">Fotos</Label>
                <Input id="fotos" name="fotos" type="file" accept="image/*" multiple required />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="comentario">Comentario (opcional)</Label>
                <Textarea id="comentario" name="comentario" placeholder="Comentario de la profesora" />
              </div>
              <Button type="submit" className="mt-2">
                Guardar reporte
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
