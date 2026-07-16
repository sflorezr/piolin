import { crearProfesora } from "@/lib/actions/profesoras";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BackLink } from "@/components/ui/back-link";

export default function NuevaProfesoraPage() {
  return (
    <div className="mx-auto max-w-lg">
      <BackLink href="/admin/profesoras" className="mb-4" />
      <h1 className="text-2xl font-semibold text-neutral-900">Nueva profesora</h1>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Datos de la profesora</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={crearProfesora} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="nombre">Nombre</Label>
              <Input id="nombre" name="nombre" required />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="documento">Documento</Label>
              <Input id="documento" name="documento" required />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input id="telefono" name="telefono" required />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="foto">Foto</Label>
              <Input id="foto" name="foto" type="file" accept="image/*" />
            </div>

            <hr className="my-2 border-neutral-200" />
            <p className="text-sm text-neutral-600">
              Acceso al sistema: la profesora usará este correo y contraseña para iniciar sesión.
            </p>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Correo</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" name="password" type="password" required minLength={6} />
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
