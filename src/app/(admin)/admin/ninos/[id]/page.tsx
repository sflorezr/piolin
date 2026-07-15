import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { actualizarNino } from "@/lib/actions/ninos";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function EditarNinoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const nino = await prisma.nino.findUnique({ where: { id } });

  if (!nino) notFound();

  const grupos = await prisma.grupo.findMany({
    where: { OR: [{ estado: "ACTIVO" }, { id: nino.grupoId }] },
    orderBy: { descripcion: "asc" },
  });

  const actualizar = actualizarNino.bind(null, nino.id);
  const fechaNacimiento = nino.fechaNacimiento.toISOString().slice(0, 10);

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-2xl font-semibold text-neutral-900">Editar niño</h1>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Datos del niño</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={actualizar} className="flex flex-col gap-4">
            {nino.fotoUrl && (
              <Image
                src={nino.fotoUrl}
                alt={nino.nombre}
                width={64}
                height={64}
                className="h-16 w-16 rounded-full object-cover"
              />
            )}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="nombre">Nombre</Label>
              <Input id="nombre" name="nombre" defaultValue={nino.nombre} required />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="fechaNacimiento">Fecha de nacimiento</Label>
              <Input
                id="fechaNacimiento"
                name="fechaNacimiento"
                type="date"
                defaultValue={fechaNacimiento}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="grupoId">Grupo</Label>
              <Select id="grupoId" name="grupoId" required defaultValue={nino.grupoId}>
                {grupos.map((grupo) => (
                  <option key={grupo.id} value={grupo.id}>
                    {grupo.descripcion}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="horaEntrega">Hora de entrega</Label>
              <Input id="horaEntrega" name="horaEntrega" type="time" defaultValue={nino.horaEntrega ?? ""} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="foto">Reemplazar foto</Label>
              <Input id="foto" name="foto" type="file" accept="image/*" />
            </div>

            <div className="mt-2 grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="nombrePapa">Nombre del papá</Label>
                <Input id="nombrePapa" name="nombrePapa" defaultValue={nino.nombrePapa ?? ""} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="celularPapa">Celular del papá</Label>
                <Input id="celularPapa" name="celularPapa" defaultValue={nino.celularPapa ?? ""} />
              </div>
              <div className="col-span-2 flex flex-col gap-1.5">
                <Label htmlFor="correoPapa">Correo del papá</Label>
                <Input id="correoPapa" name="correoPapa" type="email" defaultValue={nino.correoPapa ?? ""} />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="nombreMama">Nombre de la mamá</Label>
                <Input id="nombreMama" name="nombreMama" defaultValue={nino.nombreMama ?? ""} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="celularMama">Celular de la mamá</Label>
                <Input id="celularMama" name="celularMama" defaultValue={nino.celularMama ?? ""} />
              </div>
              <div className="col-span-2 flex flex-col gap-1.5">
                <Label htmlFor="correoMama">Correo de la mamá</Label>
                <Input id="correoMama" name="correoMama" type="email" defaultValue={nino.correoMama ?? ""} />
              </div>
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
