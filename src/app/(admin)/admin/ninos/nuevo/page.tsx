import { prisma } from "@/lib/prisma";
import { crearNino } from "@/lib/actions/ninos";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BackLink } from "@/components/ui/back-link";

export default async function NuevoNinoPage() {
  const grupos = await prisma.grupo.findMany({
    where: { estado: "ACTIVO" },
    orderBy: { descripcion: "asc" },
  });

  return (
    <div className="mx-auto max-w-lg">
      <BackLink href="/admin/ninos" className="mb-4" />
      <h1 className="text-2xl font-semibold text-neutral-900">Nuevo niño</h1>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Datos del niño</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={crearNino} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="nombre">Nombre</Label>
              <Input id="nombre" name="nombre" required />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="fechaNacimiento">Fecha de nacimiento</Label>
              <Input id="fechaNacimiento" name="fechaNacimiento" type="date" required />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="grupoId">Grupo</Label>
              <Select id="grupoId" name="grupoId" required defaultValue="">
                <option value="" disabled>
                  Selecciona un grupo
                </option>
                {grupos.map((grupo) => (
                  <option key={grupo.id} value={grupo.id}>
                    {grupo.descripcion}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="horaEntrega">Hora de entrega</Label>
              <Input id="horaEntrega" name="horaEntrega" type="time" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="foto">Foto</Label>
              <Input id="foto" name="foto" type="file" accept="image/*" />
            </div>

            <div className="mt-2 grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="nombrePapa">Nombre del papá</Label>
                <Input id="nombrePapa" name="nombrePapa" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="celularPapa">Celular del papá</Label>
                <Input id="celularPapa" name="celularPapa" />
              </div>
              <div className="col-span-2 flex flex-col gap-1.5">
                <Label htmlFor="correoPapa">Correo del papá</Label>
                <Input id="correoPapa" name="correoPapa" type="email" />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="nombreMama">Nombre de la mamá</Label>
                <Input id="nombreMama" name="nombreMama" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="celularMama">Celular de la mamá</Label>
                <Input id="celularMama" name="celularMama" />
              </div>
              <div className="col-span-2 flex flex-col gap-1.5">
                <Label htmlFor="correoMama">Correo de la mamá</Label>
                <Input id="correoMama" name="correoMama" type="email" />
              </div>
            </div>

            <Button type="submit" className="mt-2">
              Guardar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
