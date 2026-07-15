import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { actualizarProfesora } from "@/lib/actions/profesoras";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function EditarProfesoraPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profesora = await prisma.profesora.findUnique({ where: { id } });

  if (!profesora) notFound();

  const actualizar = actualizarProfesora.bind(null, profesora.id);

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-2xl font-semibold text-neutral-900">Editar profesora</h1>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Datos de la profesora</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={actualizar} className="flex flex-col gap-4">
            {profesora.fotoUrl && (
              <Image
                src={profesora.fotoUrl}
                alt={profesora.nombre}
                width={64}
                height={64}
                className="h-16 w-16 rounded-full object-cover"
              />
            )}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="nombre">Nombre</Label>
              <Input id="nombre" name="nombre" defaultValue={profesora.nombre} required />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="documento">Documento</Label>
              <Input id="documento" name="documento" defaultValue={profesora.documento} required />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input id="telefono" name="telefono" defaultValue={profesora.telefono} required />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="foto">Reemplazar foto</Label>
              <Input id="foto" name="foto" type="file" accept="image/*" />
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
