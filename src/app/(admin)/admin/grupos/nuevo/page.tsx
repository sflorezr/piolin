import { prisma } from "@/lib/prisma";
import { crearGrupo } from "@/lib/actions/grupos";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BackLink } from "@/components/ui/back-link";

export default async function NuevoGrupoPage() {
  const profesoras = await prisma.profesora.findMany({
    where: { estado: "ACTIVO" },
    orderBy: { nombre: "asc" },
  });

  return (
    <div className="mx-auto max-w-lg">
      <BackLink href="/admin/grupos" className="mb-4" />
      <h1 className="text-2xl font-semibold text-neutral-900">Nuevo grupo</h1>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Datos del grupo</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={crearGrupo} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="descripcion">Descripción</Label>
              <Input id="descripcion" name="descripcion" required />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="profesoraPrincipalId">Profesora principal</Label>
              <Select id="profesoraPrincipalId" name="profesoraPrincipalId" required defaultValue="">
                <option value="" disabled>
                  Selecciona una profesora
                </option>
                {profesoras.map((profesora) => (
                  <option key={profesora.id} value={profesora.id}>
                    {profesora.nombre}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="profesoraAuxiliarId">Profesora auxiliar (opcional)</Label>
              <Select id="profesoraAuxiliarId" name="profesoraAuxiliarId" defaultValue="">
                <option value="">Sin auxiliar</option>
                {profesoras.map((profesora) => (
                  <option key={profesora.id} value={profesora.id}>
                    {profesora.nombre}
                  </option>
                ))}
              </Select>
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
