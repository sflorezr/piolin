import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { actualizarGrupo } from "@/lib/actions/grupos";
import { SubmitButton } from "@/components/ui/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BackLink } from "@/components/ui/back-link";

export default async function EditarGrupoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const grupo = await prisma.grupo.findUnique({ where: { id } });

  if (!grupo) notFound();

  const profesoras = await prisma.profesora.findMany({
    where: {
      OR: [
        { estado: "ACTIVO" },
        { id: grupo.profesoraPrincipalId },
        { id: grupo.profesoraAuxiliarId ?? undefined },
      ],
    },
    orderBy: { nombre: "asc" },
  });

  const actualizar = actualizarGrupo.bind(null, grupo.id);

  return (
    <div className="mx-auto max-w-lg">
      <BackLink href="/admin/grupos" className="mb-4" />
      <h1 className="text-2xl font-semibold text-neutral-900">Editar grupo</h1>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Datos del grupo</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={actualizar} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="descripcion">Descripción</Label>
              <Input id="descripcion" name="descripcion" defaultValue={grupo.descripcion} required />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="profesoraPrincipalId">Profesora principal</Label>
              <Select
                id="profesoraPrincipalId"
                name="profesoraPrincipalId"
                required
                defaultValue={grupo.profesoraPrincipalId}
              >
                {profesoras.map((profesora) => (
                  <option key={profesora.id} value={profesora.id}>
                    {profesora.nombre}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="profesoraAuxiliarId">Profesora auxiliar (opcional)</Label>
              <Select
                id="profesoraAuxiliarId"
                name="profesoraAuxiliarId"
                defaultValue={grupo.profesoraAuxiliarId ?? ""}
              >
                <option value="">Sin auxiliar</option>
                {profesoras.map((profesora) => (
                  <option key={profesora.id} value={profesora.id}>
                    {profesora.nombre}
                  </option>
                ))}
              </Select>
            </div>
            <SubmitButton className="mt-2">Guardar cambios</SubmitButton>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
