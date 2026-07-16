import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { actualizarActividad } from "@/lib/actions/actividades";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BackLink } from "@/components/ui/back-link";

export default async function EditarActividadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const actividad = await prisma.actividad.findUnique({ where: { id } });

  if (!actividad) notFound();

  const actualizar = actualizarActividad.bind(null, actividad.id);

  return (
    <div className="mx-auto max-w-lg">
      <BackLink href="/admin/actividades" className="mb-4" />
      <h1 className="text-2xl font-semibold text-neutral-900">Editar actividad</h1>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Datos de la actividad</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={actualizar} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="nombre">Nombre</Label>
              <Input id="nombre" name="nombre" defaultValue={actividad.nombre} required />
            </div>
            <Button type="submit" className="mt-2">
              Guardar cambios
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
